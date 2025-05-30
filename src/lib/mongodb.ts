import { MongoClient, MongoClientOptions } from 'mongodb';
import { cookies } from 'next/headers';

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

// Connection pool for managing multiple connections
const connectionPool = new Map<string, {
  client: MongoClient;
  lastActivity: number;
  timeout: NodeJS.Timeout;
  requestCount: number;
}>();

const INACTIVITY_TIMEOUT = 30000; // 30 seconds

async function getConnectionId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;
    
    if (!sessionId) {
      // Generate a new session ID if none exists
      sessionId = Math.random().toString(36).substring(2, 15);
      // Note: We can't set cookies in this context, but the client should set it
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error getting connection ID:', error);
    return Math.random().toString(36).substring(2, 15);
  }
}

function resetInactivityTimer(connectionId: string) {
  const connection = connectionPool.get(connectionId);
  if (!connection) return;

  // Clear existing timeout
  if (connection.timeout) {
    clearTimeout(connection.timeout);
  }

  // Update last activity time
  connection.lastActivity = Date.now();

  // Set new timeout
  connection.timeout = setTimeout(async () => {
    const currentConnection = connectionPool.get(connectionId);
    if (currentConnection) {
      const timeSinceLastActivity = Date.now() - currentConnection.lastActivity;
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.log(`Closing inactive MongoDB connection for session ${connectionId}`);
        await closeConnection(connectionId);
      }
    }
  }, INACTIVITY_TIMEOUT);

  connectionPool.set(connectionId, connection);
}

async function closeConnection(connectionId: string) {
  const connection = connectionPool.get(connectionId);
  if (connection) {
    try {
      await connection.client.close();
      clearTimeout(connection.timeout);
      connectionPool.delete(connectionId);
      console.log(`MongoDB connection closed for session ${connectionId}`);
    } catch (error) {
      console.error(`Error closing MongoDB connection for session ${connectionId}:`, error);
      throw error;
    }
  }
}

export async function connectToDatabase() {
  const connectionId = await getConnectionId();
  try {
    let connection = connectionPool.get(connectionId);
    
    if (!connection) {
      const client = new MongoClient(uri, clientOptions);
      await client.connect();
      console.log(`Connected successfully to MongoDB for session ${connectionId}`);

      connection = {
        client,
        lastActivity: Date.now(),
        timeout: setTimeout(() => {}, 0),
        requestCount: 0
      };
      connectionPool.set(connectionId, connection);
    }

    // Increment request count
    connection.requestCount++;
    resetInactivityTimer(connectionId);
    
    return { client: connection.client, connectionId };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function closeDatabaseConnection(connectionId: string) {
  const connection = connectionPool.get(connectionId);
  if (connection) {
    connection.requestCount--;
    if (connection.requestCount <= 0) {
      await closeConnection(connectionId);
    }
  }
}

// Helper function to execute database operations with automatic connection management
export async function withDatabase<T>(operation: (client: MongoClient) => Promise<T>): Promise<T> {
  const { client, connectionId } = await connectToDatabase();
  try {
    return await operation(client);
  } finally {
    resetInactivityTimer(connectionId);
  }
}

export async function getCollection(collectionName: string) {
  const { client, connectionId } = await connectToDatabase();
  const dbName = "seco_org";
  const actualCollectionName = collectionName.toLowerCase();
  
  resetInactivityTimer(connectionId);
  return client.db(dbName).collection(actualCollectionName);
}

// Clean up on app termination
process.on('SIGINT', async () => {
  // Close all connections in the pool
  for (const [connectionId] of connectionPool) {
    await closeConnection(connectionId);
  }
  process.exit();
});
