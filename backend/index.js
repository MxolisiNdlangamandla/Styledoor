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
      id: result.insertId, // Add this for consistency with frontend expectations
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

// ========== UPDATED SERVICE PROVIDER ENDPOINTS ========== //

/**
 * Create Service Provider Profile
 * 
 * This endpoint creates a service provider record after user registration.
 * It's called from the Choose Services page when providers select their services.
 * 
 * UPDATED: Now works with your existing serviceproviders table structure:
 * - provider_id (auto increment primary key)
 * - user_id (foreign key to Users table)
 * - provider_name (business/provider name)
 * - provider_type (Individual, Salon, Barbershop, Carwash, Training Center)
 * - business_category (Hair, Carwash, Training)
 * - location (service location)
 * - contact_info (additional contact details)
 * - offers_home_request (1 or 0)
 * - offers_walk_in (1 or 0)
 * - offers_drive_in (1 or 0)
 * 
 * Expected request body:
 * {
 *   user_id: number,
 *   business_name: string,
 *   services: array of service IDs,
 *   location: string (optional),
 *   description: string (optional)
 * }
 */
app.post('/api/service-providers', async (req, res) => {
  console.log('📝 Creating service provider profile:', req.body);
  
  try {
    const { 
      user_id, 
      business_name, 
      services, 
      location = '', 
      description = '' 
    } = req.body;

    // Validate required fields to ensure we have minimum data needed
    if (!user_id || !business_name || !services || !Array.isArray(services)) {
      return res.status(400).json({
        success: false,
        message: 'user_id, business_name, and services array are required'
      });
    }

    // Validate that at least one service is selected - providers must offer something
    if (services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service must be selected'
      });
    }

    // Check if user exists and is registered as a Provider in Users table
    const [users] = await db.execute(
      'SELECT user_id, username, user_type FROM Users WHERE user_id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    // Only users with user_type = 'Provider' can create service provider profiles
    if (user.user_type !== 'Provider') {
      return res.status(400).json({
        success: false,
        message: 'User must be registered as a Provider'
      });
    }

    // Check if service provider profile already exists to prevent duplicates
    // Using lowercase 'serviceproviders' to match your table name
    const [existingProviders] = await db.execute(
      'SELECT provider_id FROM serviceproviders WHERE user_id = ?',
      [user_id]
    );

    if (existingProviders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Service provider profile already exists for this user'
      });
    }

    // Map frontend service IDs to your database business categories
    // This handles the translation between what users select and what your DB expects
    const serviceMapping = {
      'hair_service': 'Hair',  // Hair styling, cutting, etc.
      'nails': 'Hair',         // Nail services grouped under Hair/Beauty
      'facials': 'Hair',       // Facial treatments grouped under Hair/Beauty  
      'massages': 'Hair',      // Massage services grouped under Hair/Beauty
      'makeup': 'Hair',        // Makeup services grouped under Hair/Beauty
      'carwash': 'Carwash'     // Car washing services
    };
    
    // Determine primary business category based on first selected service
    const primaryService = services[0];
    const businessCategory = serviceMapping[primaryService] || 'Hair';
    
    // Determine provider type based on services selected and business logic
    let providerType = 'Individual'; // Default for single-person operations
    
    if (services.includes('carwash')) {
      // Car wash services typically require specific equipment/location
      providerType = 'Carwash';
    } else if (services.length > 2) {
      // Multiple beauty services suggest a salon/spa operation
      providerType = 'Salon';
    }
    // Individual remains for 1-2 beauty services (freelancer/mobile service)
    
    // Insert service provider record into your existing table structure
    // Using column names that match your serviceproviders table exactly
    const [result] = await db.execute(
      `INSERT INTO serviceproviders (
        user_id, 
        provider_name, 
        provider_type, 
        business_category, 
        location, 
        contact_info,
        offers_home_request,
        offers_walk_in,
        offers_drive_in
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,                                      // Link to Users table
        business_name,                                // Provider/business name
        providerType,                                 // Individual, Salon, or Carwash
        businessCategory,                             // Hair, Carwash, Training
        location,                                     // Service location (can be empty initially)
        description,                                  // Additional contact/description info
        1,                                           // Default: offers home/mobile requests
        1,                                           // Default: accepts walk-in clients
        services.includes('carwash') ? 1 : 0         // Only carwash offers drive-in service
      ]
    );

    console.log('✅ Service provider created with ID:', result.insertId);

    // Return success response with created service provider data
    // Include both the database structure and frontend-friendly data
    res.status(201).json({
      success: true,
      message: 'Service provider profile created successfully',
      service_provider: {
        id: result.insertId,                    // Frontend expects 'id'
        provider_id: result.insertId,           // Database primary key
        user_id,                               // User reference
        provider_name: business_name,           // Business name in DB format
        provider_type: providerType,            // Individual/Salon/Carwash
        business_category: businessCategory,    // Hair/Carwash/Training
        services,                              // Original services array for frontend
        location,                              // Service location
        contact_info: description,             // Contact details
        offers_home_request: 1,                // Mobile service capability
        offers_walk_in: 1,                     // Walk-in acceptance
        offers_drive_in: services.includes('carwash') ? 1 : 0  // Drive-in for carwash only
      }
    });

  } catch (error) {
    console.error('❌ Error creating service provider:', error);
    
    // Handle specific database errors with helpful messages
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        success: false,
        message: 'serviceproviders table does not exist in database'
      });
    }
    
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        success: false,
        message: 'Database column mismatch - please check table structure'
      });
    }
    
    // Generic server error for any other database issues
    res.status(500).json({
      success: false,
      message: 'Server error while creating service provider profile'
    });
  }
});

/**
 * Get Service Provider Profile by User ID
 * 
 * This endpoint retrieves an existing service provider profile.
 * Used for loading provider dashboard, editing profile, etc.
 * 
 * UPDATED: Now works with your serviceproviders table structure
 * 
 * URL: GET /api/service-providers/user/:user_id
 * Returns: Complete service provider profile data
 */
app.get('/api/service-providers/user/:user_id', async (req, res) => {
  console.log('🔍 Getting service provider profile for user:', req.params.user_id);
  
  try {
    const { user_id } = req.params;

    // Query your serviceproviders table using lowercase name to match DB
    const [providers] = await db.execute(
      'SELECT * FROM serviceproviders WHERE user_id = ?',
      [user_id]
    );

    // Check if service provider profile exists for this user
    if (providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service provider profile not found for this user'
      });
    }

    const provider = providers[0];

    // Format response data to match both your DB structure and frontend expectations
    const providerData = {
      id: provider.provider_id,                    // Frontend-friendly ID
      provider_id: provider.provider_id,           // Database primary key
      user_id: provider.user_id,                  // User reference
      provider_name: provider.provider_name,       // Business/provider name
      provider_type: provider.provider_type,       // Individual/Salon/Carwash/etc
      business_category: provider.business_category, // Hair/Carwash/Training
      location: provider.location,                 // Service location
      contact_info: provider.contact_info,         // Contact details
      offers_home_request: provider.offers_home_request, // Mobile service (1/0)
      offers_walk_in: provider.offers_walk_in,     // Walk-in acceptance (1/0)
      offers_drive_in: provider.offers_drive_in    // Drive-in service (1/0)
    };

    console.log('✅ Service provider profile retrieved:', providerData.provider_name);

    res.json({
      success: true,
      service_provider: providerData
    });

  } catch (error) {
    console.error('❌ Error getting service provider profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving service provider profile'
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
      console.log(`   POST http://localhost:${PORT}/api/service-providers`);
      console.log(`   GET  http://localhost:${PORT}/api/service-providers/user/:user_id`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();