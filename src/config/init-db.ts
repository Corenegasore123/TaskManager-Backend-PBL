import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    await pool.query(`
      SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME}'
    `).then(async (result) => {
      if (result.rowCount === 0) {
        await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log('Database created successfully');
      } else {
        console.log('Database already exists');
      }
    });

    // Connect to the created database
    const client = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // Read and execute schema file
    const schemaFile = path.join(__dirname, 'database.sql');
    const schema = fs.readFileSync(schemaFile, 'utf8');
    
    await client.query(schema);
    console.log('Schema created successfully');

    await client.end();
    await pool.end();
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 