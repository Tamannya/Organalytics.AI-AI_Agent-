import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = connectionString 
  ? new Pool({ connectionString }) 
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'organization_analytics',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error', err);
});

// Self-healing DB initialization schema
export const initDB = async () => {
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        data_source VARCHAR(20) DEFAULT 'csv',
        vision_image_path TEXT,
        vision_confidence DECIMAL(3,2),
        vision_raw_output JSONB
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
    console.log('Database tables verified/created successfully');
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    throw error;
  }
};

export default pool;
