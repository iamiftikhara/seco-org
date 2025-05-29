import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const clientOptions: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  connectTimeoutMS: 10000,
};

let client: MongoClient | null = null;

export async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(uri, clientOptions);
      await client.connect();
      console.log("Connected successfully to MongoDB");
    }
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    try {
      await client.close();
      client = null;
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }
}

// Helper function to execute database operations with automatic connection management
export async function withDatabase<T>(operation: (client: MongoClient) => Promise<T>): Promise<T> {
  const client = await connectToDatabase();
  try {
    return await operation(client);
  } finally {
    await closeDatabaseConnection();
  }
}

export async function getCollection(collectionName: string) {
  const client = await connectToDatabase();
  const dbName = "seco_org"; // Use the database name from the URI

  // Dynamically determine the actual collection name, converting to lowercase
  // as new collections will be created on the go based on data files.
  const actualCollectionName = collectionName.toLowerCase();

  return client.db(dbName).collection(actualCollectionName);
}

// Clean up on app termination
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    client = null;
  }
  process.exit();
});