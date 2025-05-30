import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

// Global connection instance
let client: MongoClient | null = null;
let isInitializing = false;

// Initialize database connection
async function initializeDatabase() {
  if (client) return client;
  if (isInitializing) {
    // Wait for the ongoing initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (!client) {
      throw new Error('Database initialization failed');
    }
    return client;
  }

  try {
    isInitializing = true;
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    console.log('MongoDB connection initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
    client = null;
    throw error;
  } finally {
    isInitializing = false;
  }
  return client;
}

// Connect to MongoDB
export async function connectToDatabase() {
  if (!client) {
    return initializeDatabase();
  }
  return client;
}

// Get collection helper
export async function getCollection(collectionName: string) {
  const dbClient = await connectToDatabase();
  if (!dbClient) {
    throw new Error('Database connection not available');
  }
  const dbName = "seco_org";
  const actualCollectionName = collectionName.toLowerCase();
  return dbClient.db(dbName).collection(actualCollectionName);
}

// Clean up on app termination
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit();
});

// Initialize database connection when the module is loaded
initializeDatabase().catch(console.error);
