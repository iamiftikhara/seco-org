import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = "seco_org";

// Global variables for singleton pattern
declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoDb: Db | undefined;
  var _mongoPromise: Promise<MongoClient> | undefined;
}

// Singleton pattern to prevent multiple connections
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connectionPromise: Promise<MongoClient> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private async createConnection(): Promise<MongoClient> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('Creating new MongoDB connection...');

        const client = new MongoClient(uri, {
          maxPoolSize: 10,
          minPoolSize: 2,
          maxIdleTimeMS: 30000,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
          heartbeatFrequencyMS: 10000,
        });

        await client.connect();

        // Test the connection
        await client.db(dbName).admin().ping();

        this.client = client;
        this.db = client.db(dbName);

        console.log('MongoDB connection established successfully');
        resolve(client);
      } catch (error) {
        console.error('Failed to create MongoDB connection:', error);
        this.connectionPromise = null;
        this.client = null;
        this.db = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  public async getClient(): Promise<MongoClient> {
    // Use global variables in development to persist across hot reloads
    if (process.env.NODE_ENV === 'development') {
      if (global._mongoClient && global._mongoDb) {
        this.client = global._mongoClient;
        this.db = global._mongoDb;
        return this.client;
      }

      if (global._mongoPromise) {
        return global._mongoPromise;
      }

      global._mongoPromise = this.createConnection();
      const client = await global._mongoPromise;

      global._mongoClient = client;
      global._mongoDb = client.db(dbName);

      return client;
    }

    // Production: use instance variables
    if (this.client) {
      try {
        // Test if connection is still alive
        await this.client.db(dbName).admin().ping();
        return this.client;
      } catch (error) {
        console.log('Connection lost, reconnecting...');
        this.client = null;
        this.db = null;
        this.connectionPromise = null;
      }
    }

    return this.createConnection();
  }

  public async getDb(): Promise<Db> {
    if (process.env.NODE_ENV === 'development' && global._mongoDb) {
      return global._mongoDb;
    }

    if (this.db) {
      return this.db;
    }

    const client = await this.getClient();
    this.db = client.db(dbName);

    if (process.env.NODE_ENV === 'development') {
      global._mongoDb = this.db;
    }

    return this.db;
  }

  public async closeConnection(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.connectionPromise = null;

      if (process.env.NODE_ENV === 'development') {
        global._mongoClient = undefined;
        global._mongoDb = undefined;
        global._mongoPromise = undefined;
      }

      console.log('MongoDB connection closed');
    }
  }
}

// Export functions
export async function connectToDatabase(): Promise<MongoClient> {
  const dbConnection = DatabaseConnection.getInstance();
  return dbConnection.getClient();
}

export async function getDatabase(): Promise<Db> {
  const dbConnection = DatabaseConnection.getInstance();
  return dbConnection.getDb();
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  const actualCollectionName = collectionName.toLowerCase();
  return db.collection(actualCollectionName);
}

// Graceful shutdown
const gracefulShutdown = async () => {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.closeConnection();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
