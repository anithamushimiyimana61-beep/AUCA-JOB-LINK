const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// Job schema
const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: { type: String, default: 'Kigali, Rwanda' },
  description: String,
  salary: String,
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
  requirements: [String],
  minGrade: { type: Number, default: 12, min: 0, max: 20 },
  skills: [String],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

// Auth middleware
const authenticate = (event) => {
  const authHeader = event.headers.authorization || event.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
    return verified;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

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
    // Authenticate user
    const user = authenticate(event);

    await connectDB();

    const { title, company, location, description, salary, jobType, requirements, minGrade, skills } = JSON.parse(event.body);

    const job = await Job.create({
      title,
      company,
      location: location || '',
      description,
      salary,
      jobType,
      requirements: requirements || [],
      minGrade,
      skills: skills || [],
      postedBy: user.id
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(job)
    };
  } catch (error) {
    console.error('Create job error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to create job' })
    };
  }
};