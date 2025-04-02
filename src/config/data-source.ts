import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Team } from '../models/Team';
import { TeamMember } from '../models/TeamMember';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Y8m27c@012345',
  database: process.env.DB_NAME || 'taskmanager',
  synchronize: true,
  logging: true,
  entities: [User, Task, Team, TeamMember]
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
}; 