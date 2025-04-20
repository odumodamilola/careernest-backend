import { User as UserType, InsertUser } from '@shared/schema';
import { randomUUID } from 'crypto';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import bcrypt from 'bcryptjs';

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods you might need
export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  getUserByEmail(email: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, UserType> = new Map();
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    // Add demo user
    this.createUser({
      username: 'demouser',
      email: 'demo@example.com',
      password: 'password123',
      firstName: 'Demo',
      lastName: 'User'
    }).catch(console.error);
  }

  async getUser(id: string): Promise<UserType | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    return Array.from(this.users.values()).find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    // Check if username or email already exists
    if (await this.getUserByUsername(insertUser.username)) {
      throw new Error('Username already exists');
    }
    
    if (insertUser.email && await this.getUserByEmail(insertUser.email)) {
      throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(insertUser.password, salt);

    // Create user object
    const newUser: UserType = {
      id: randomUUID(),
      ...insertUser,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      bookmarkedCareers: []
    };

    // Store the user
    this.users.set(newUser.id, newUser);
    console.log(`Created user: ${newUser.username}`);
    
    return newUser;
  }
}

export const storage = new MemStorage();
