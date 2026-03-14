const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    await connectDB();

    const { email, password } = JSON.parse(event.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    // Check password (in production, use bcrypt for hashing)
    if (user.password !== password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        role: user.role,
        name: user.name,
        email: user.email
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};