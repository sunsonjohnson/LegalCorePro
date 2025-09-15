import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
const initSchema = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      emailVerified TEXT,
      image TEXT,
      password TEXT,
      role TEXT DEFAULT 'ASSOCIATE',
      lawFirmId TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Law firms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lawFirms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      logo TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'OPEN',
      priority TEXT DEFAULT 'MEDIUM',
      caseNumber TEXT UNIQUE NOT NULL,
      clientId TEXT NOT NULL,
      assignedToId TEXT NOT NULL,
      lawFirmId TEXT NOT NULL,
      startDate TEXT DEFAULT CURRENT_TIMESTAMP,
      closeDate TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      company TEXT,
      lawFirmId TEXT NOT NULL,
      assignedToId TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Time entries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS timeEntries (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      hours REAL NOT NULL,
      date TEXT NOT NULL,
      billableRate REAL NOT NULL,
      userId TEXT NOT NULL,
      caseId TEXT NOT NULL,
      isBilled INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Billing records table
  db.exec(`
    CREATE TABLE IF NOT EXISTS billingRecords (
      id TEXT PRIMARY KEY,
      invoiceNumber TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'DRAFT',
      dueDate TEXT NOT NULL,
      paidDate TEXT,
      caseId TEXT NOT NULL,
      lawFirmId TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Appointments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      location TEXT,
      type TEXT DEFAULT 'CONSULTATION',
      status TEXT DEFAULT 'SCHEDULED',
      userId TEXT NOT NULL,
      caseId TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Initialize schema on startup
initSchema();

// Helper function to generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export default db;