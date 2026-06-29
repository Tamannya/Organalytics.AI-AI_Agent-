import pg from 'pg';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const useSQLite = process.env.DB_TYPE === 'sqlite' || !connectionString;

let pool;
let sqliteDb;
let dbFilePath = '';

if (useSQLite) {
  dbFilePath = path.resolve(process.cwd(), '../data.db');
  console.log(`Configuring SQLite database at: ${dbFilePath}`);
  
  sqliteDb = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error('Failed to open SQLite database:', err);
    } else {
      console.log('Connected to SQLite database successfully');
    }
  });

  // Mock pg Pool query interface
  pool = {
    query: (text, params = []) => {
      return new Promise((resolve, reject) => {
        // Map postgres $1, $2 placeholders to SQLite ?
        const sqliteText = text.replace(/\$\d+/g, '?');
        
        sqliteDb.all(sqliteText, params, (err, rows) => {
          if (err) {
            console.error(`SQLite query error on: ${sqliteText}`, err);
            return reject(err);
          }
          resolve({ rows: rows || [] });
        });
      });
    },
    on: (event, callback) => {
      if (event === 'connect') {
        callback();
      }
    }
  };
} else {
  pool = new Pool({ connectionString });
  pool.on('connect', () => {
    console.log('PostgreSQL database connected successfully');
  });
  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL database error', err);
  });
}

export const getDbMeta = () => {
  return {
    type: useSQLite ? 'SQLite' : 'PostgreSQL',
    path: useSQLite ? dbFilePath : (connectionString ? connectionString.split('@')[1] || 'PostgreSQL Connection' : 'localhost')
  };
};

// Self-healing DB initialization schema
export const initDB = async () => {
  if (useSQLite) {
    const sqliteSchema = `
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          name TEXT NOT NULL,
          industry TEXT NOT NULL,
          size TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS analyses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          org_id INTEGER,
          input_data_path TEXT,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(org_id) REFERENCES organizations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          analysis_id INTEGER,
          report_json TEXT NOT NULL,
          pdf_path TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS recommendations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          report_id INTEGER,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          priority_score INTEGER,
          category TEXT NOT NULL,
          FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE
      );
    `;

    const migrateSchema = [
      "ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'midnight'",
      "ALTER TABLE users ADD COLUMN phone TEXT",
      "ALTER TABLE users ADD COLUMN profile_pic TEXT",
      "ALTER TABLE users ADD COLUMN title TEXT",
      "ALTER TABLE users ADD COLUMN bio TEXT",
      "ALTER TABLE organizations ADD COLUMN website TEXT",
      "ALTER TABLE organizations ADD COLUMN address TEXT",
      "ALTER TABLE organizations ADD COLUMN description TEXT",
      "ALTER TABLE analyses ADD COLUMN data_source TEXT DEFAULT 'csv'",
      "ALTER TABLE analyses ADD COLUMN vision_image_path TEXT",
      "ALTER TABLE analyses ADD COLUMN vision_confidence REAL",
      "ALTER TABLE analyses ADD COLUMN vision_raw_output TEXT",
      `CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          category TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );`
    ];

    try {
      const runQuery = (sql) => {
        return new Promise((resolve, reject) => {
          sqliteDb.exec(sql, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      };

      const runSingleQuery = (sql) => {
        return new Promise((resolve) => {
          sqliteDb.run(sql, (err) => {
            // Ignore duplicate column errors during migrations
            resolve();
          });
        });
      };

      await runQuery(sqliteSchema);
      for (const migration of migrateSchema) {
        await runSingleQuery(migration);
      }
      console.log('SQLite database tables initialized and verified.');
    } catch (error) {
      console.error('Failed to initialize SQLite database tables:', error);
      throw error;
    }
  } else {
    const schemaQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS organizations (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          industry VARCHAR(255) NOT NULL,
          size VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analyses (
          id SERIAL PRIMARY KEY,
          org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
          input_data_path VARCHAR(555),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reports (
          id SERIAL PRIMARY KEY,
          analysis_id INTEGER REFERENCES analyses(id) ON DELETE CASCADE,
          report_json JSONB NOT NULL,
          pdf_path VARCHAR(555),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS recommendations (
          id SERIAL PRIMARY KEY,
          report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          priority_score INTEGER CHECK (priority_score BETWEEN 1 AND 100),
          category VARCHAR(100) NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_organizations_user ON organizations(user_id);
      CREATE INDEX IF NOT EXISTS idx_analyses_org ON analyses(org_id);
      CREATE INDEX IF NOT EXISTS idx_reports_analysis ON reports(analysis_id);
      CREATE INDEX IF NOT EXISTS idx_recommendations_report ON recommendations(report_id);

      -- Self-healing migrations for existing tables
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS data_source VARCHAR(20) DEFAULT 'csv';
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS vision_image_path TEXT;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS vision_confidence DECIMAL(3,2);
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS vision_raw_output JSONB;
    `;

    try {
      await pool.query(schemaQuery);
      console.log('PostgreSQL database tables verified/created successfully');
    } catch (error) {
      console.error('Failed to initialize PostgreSQL database tables:', error);
      throw error;
    }
  }
};

export default pool;

