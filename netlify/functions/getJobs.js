const mongoose = require('mongoose');

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

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    await connectDB();

    const jobs = await Job.find().sort({ createdAt: -1 });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(jobs)
    };
  } catch (err) {
    console.error('Error fetching jobs:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to fetch jobs' })
    };
  }
};