import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string; // Ensure this is a string or handle the case where it's undefined or null
if (!uri) throw new Error('MONGODB_URI is not defined'); // Throw an error if it's undefined or null to halt the serve
console.log('MONGODB_URI:', uri); // Log the URI to check if it's correct
const clientOptions = {
  retryWrites: true,
  maxPoolSize: 10,
  minPoolSize: 1,
  tls: true,
  tlsInsecure: true,
  directConnection: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  replicaSet: 'atlas-pvef8v-shard-0',
  authSource: 'admin',
  ssl: true,
};

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(uri, clientOptions);
    await client.connect();
    // Assuming "seco_org" is the correct database name based on the URI
    await client.db("seco_org").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Try to clean up if connection fails
    if (cachedClient) {
      try {
        await cachedClient.close();
      } catch (closeError) {
        console.error("Error closing cached connection:", closeError);
      } finally {
        cachedClient = null;
      }
    }
    throw error;
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
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
  process.exit();
});