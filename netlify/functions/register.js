const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'job_seeker' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Check if environment variables are set
    if (!process.env.MONGODB_URI) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Database configuration error' })
      };
    }

    await connectDB();

    const { name, email, password, role } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    // Normalize role: accept 'student' from frontend and map to 'job_seeker'
    let normalizedRole = role;
    if (role === 'student') normalizedRole = 'job_seeker';

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email already registered' })
      };
    }

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole || 'job_seeker'
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'User created',
        user: { id: user._id, email: user.email, role: user.role }
      })
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Registration failed' })
    };
  }
};