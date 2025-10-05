const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'waasha-secret-key-change-this-in-production';

// Database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'main_new_waasha_db_2025',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to main_new_waasha_db_2025 database successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL:', error.message);
    console.error('💡 Make sure XAMPP is running and the database exists');
    process.exit(1);
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
}

// ========== ROUTES ========== //

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Waasha API is working!',
    timestamp: new Date().toISOString()
  });
});

// Featured services
app.get('/api/services/featured', (req, res) => {
  const featuredServices = [
    { id: 1, title: 'Hair Styling', icon: '💇‍♀️' },
    { id: 2, title: 'Car Wash', icon: '🚗' },
    { id: 3, title: 'Barber', icon: '✂️' },
    { id: 4, title: 'Training', icon: '🎓' },
    { id: 5, title: 'Beauty', icon: '💄' },
    { id: 6, title: 'Cleaning', icon: '🧹' }
  ];

  res.json({
    success: true,
    services: featuredServices
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, phone_number, user_type = 'Client' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const [existingUsers] = await db.execute(
      'SELECT user_id FROM Users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already registered'
      });
    }

    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute(
      `INSERT INTO Users (username, password_hash, email, phone_number, user_type, date_registered) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [username, password_hash, email, phone_number, user_type]
    );

    const token = jwt.sign(
      { user_id: result.insertId, username, email, user_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = {
      user_id: result.insertId,
      username,
      email,
      phone_number,
      user_type,
      token
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const [users] = await db.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = {
      id: user.user_id,
      user_id: user.user_id,
      first_name: user.username,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.user_type.toLowerCase(),
      user_type: user.user_type,
      token
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token
app.get('/api/verify-token', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT user_id, username, email, phone_number, user_type FROM Users WHERE user_id = ?',
      [req.user.user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const userData = {
      id: user.user_id,
      user_id: user.user_id,
      first_name: user.username,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.user_type.toLowerCase(),
      user_type: user.user_type
    };

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler - This version should work
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Waasha Server running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🗄️  Connected to database: main_new_waasha_db_2025`);
      console.log(`📋 Test your API:`);
      console.log(`   GET  http://localhost:${PORT}/api/test`);
      console.log(`   GET  http://localhost:${PORT}/api/services/featured`);
      console.log(`   POST http://localhost:${PORT}/api/register`);
      console.log(`   POST http://localhost:${PORT}/api/login`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();