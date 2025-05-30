'use server';

import { connectToDatabase } from './mongodb';

// Initialize database connection
async function initializeDatabase() {
  try {
    await connectToDatabase();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1); // Exit if database connection fails
  }
}

// Run initialization
initializeDatabase(); 