import { User as UserType, InsertUser, users } from '@shared/schema';
import { pgSessions } from '@shared/schema';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import bcrypt from 'bcryptjs';
import { db, pool } from './db';
import { eq } from 'drizzle-orm';

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods you might need
export interface IStorage {
  getUser(id: number): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  getUserByEmail(email: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Use PostgreSQL session store
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      tableName: 'pg_sessions',
      createTableIfMissing: true 
    });
    
    // Add demo user only if it doesn't exist
    this.getUserByUsername('demouser').then(existingUser => {
      if (!existingUser) {
        this.createUser({
          username: 'demouser',
          email: 'demo@example.com',
          password: 'password123',
          firstName: 'Demo',
          lastName: 'User'
        }).catch(console.error);
      }
    }).catch(error => {
      console.error('Error checking for demo user:', error);
    });
  }

  async getUser(id: number): Promise<UserType | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    // Check if username or email already exists
    const existingUsername = await this.getUserByUsername(insertUser.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }
    
    const existingEmail = await this.getUserByEmail(insertUser.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(insertUser.password, salt);

    // Insert user into database
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        password: hashedPassword,
      }).returning();
      
      const newUser = result[0];
      console.log(`Created user: ${newUser.username}`);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}

export const storage = new DatabaseStorage();
