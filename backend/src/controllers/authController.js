import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { getDbMeta } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password.' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    );

    const user = newUser.rows[0];

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    // Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

export const getDbInfo = async (req, res) => {
  try {
    if (!req.user || req.user.email !== 'admin@test.com') {
      return res.status(403).json({ error: 'Forbidden: Administrator access required.' });
    }
    const meta = getDbMeta();
    
    // Count stats
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const orgCount = await pool.query('SELECT COUNT(*) as count FROM organizations');
    const analysisCount = await pool.query('SELECT COUNT(*) as count FROM analyses');

    // Get all users
    const users = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, u.phone, u.title,
              o.name as org_name,
              (SELECT COUNT(*) FROM analyses a WHERE a.org_id = o.id) as analysis_count
       FROM users u
       LEFT JOIN organizations o ON o.user_id = u.id
       ORDER BY u.id DESC`
    );

    // Map database counts properly regardless of PostgreSQL or SQLite count key names
    const getCount = (row) => {
      if (!row) return 0;
      return parseInt(row.count !== undefined ? row.count : (row.cnt !== undefined ? row.cnt : 0));
    };

    res.json({
      status: 'success',
      db_type: meta.type,
      db_path: meta.path,
      counts: {
        users: getCount(userCount.rows[0]),
        organizations: getCount(orgCount.rows[0]),
        analyses: getCount(analysisCount.rows[0]),
      },
      users: users.rows
    });
  } catch (error) {
    console.error('Failed to get database info:', error);
    res.status(500).json({ error: 'Server error retrieving database info.' });
  }
};
