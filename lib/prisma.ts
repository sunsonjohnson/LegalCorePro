import db, { generateId } from './database';

// Define the User interface to match the database schema
interface MockUser {
  id: string;
  name: string | null;
  email: string;
  password: string | null;
  role: string;
  lawFirmId: string | null;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
  emailVerified?: string | null;
}

// Mock Prisma-like interface for compatibility
export const prisma = {
  user: {
    findUnique: (params: { where: { id?: string; email?: string } }): MockUser | null => {
      const stmt = params.where.id 
        ? db.prepare('SELECT * FROM users WHERE id = ?')
        : db.prepare('SELECT * FROM users WHERE email = ?');
      
      const value = params.where.id || params.where.email;
      const result = stmt.get(value);
      return result ? (result as MockUser) : null;
    },
    
    create: (params: { data: any }) => {
      const id = generateId();
      const stmt = db.prepare(`
        INSERT INTO users (id, name, email, password, role, lawFirmId)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        params.data.name || null,
        params.data.email,
        params.data.password || null,
        params.data.role || 'ASSOCIATE',
        params.data.lawFirmId || null
      );
      
      return { id, ...params.data };
    },
    
    findMany: () => {
      const stmt = db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
      return stmt.all();
    }
  },
  
  case: {
    findMany: (params?: { where?: any; include?: any }) => {
      let query = 'SELECT * FROM cases';
      const conditions = [];
      const values = [];
      
      if (params?.where) {
        if (params.where.lawFirmId) {
          conditions.push('lawFirmId = ?');
          values.push(params.where.lawFirmId);
        }
        if (params.where.status) {
          conditions.push('status = ?');
          values.push(params.where.status);
        }
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY createdAt DESC';
      
      const stmt = db.prepare(query);
      return stmt.all(...values);
    },
    
    count: (params?: { where?: any }) => {
      let query = 'SELECT COUNT(*) as count FROM cases';
      const conditions = [];
      const values = [];
      
      if (params?.where) {
        if (params.where.lawFirmId) {
          conditions.push('lawFirmId = ?');
          values.push(params.where.lawFirmId);
        }
        if (params.where.status) {
          conditions.push('status = ?');
          values.push(params.where.status);
        }
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const stmt = db.prepare(query);
      const result = stmt.get(...values) as { count: number };
      return result.count;
    }
  },
  
  client: {
    count: (params?: { where?: any }) => {
      let query = 'SELECT COUNT(*) as count FROM clients';
      const conditions = [];
      const values = [];
      
      if (params?.where?.lawFirmId) {
        conditions.push('lawFirmId = ?');
        values.push(params.where.lawFirmId);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const stmt = db.prepare(query);
      const result = stmt.get(...values) as { count: number };
      return result.count;
    }
  },
  
  timeEntry: {
    aggregate: (params: { where?: any; _sum?: { hours?: boolean } }) => {
      let query = 'SELECT SUM(hours) as sum FROM timeEntries';
      const conditions = [];
      const values = [];
      
      if (params.where) {
        if (params.where.lawFirmId) {
          conditions.push('lawFirmId = ?');
          values.push(params.where.lawFirmId);
        }
        if (params.where.isBilled === false) {
          conditions.push('isBilled = 0');
        }
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const stmt = db.prepare(query);
      const result = stmt.get(...values) as { sum: number | null };
      return { _sum: { hours: result.sum || 0 } };
    }
  },
  
  billingRecord: {
    aggregate: (params: { where?: any; _sum?: { amount?: boolean } }) => {
      let query = 'SELECT SUM(amount) as sum FROM billingRecords';
      const conditions = [];
      const values = [];
      
      if (params.where) {
        if (params.where.lawFirmId) {
          conditions.push('lawFirmId = ?');
          values.push(params.where.lawFirmId);
        }
        if (params.where.status) {
          conditions.push('status = ?');
          values.push(params.where.status);
        }
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const stmt = db.prepare(query);
      const result = stmt.get(...values) as { sum: number | null };
      return { _sum: { amount: result.sum || 0 } };
    }
  }
};

export default prisma;