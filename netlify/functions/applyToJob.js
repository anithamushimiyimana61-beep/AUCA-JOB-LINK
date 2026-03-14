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
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Authenticate user
    const user = authenticate(event);

    await connectDB();

    const jobId = event.path.split('/').pop();
    const job = await Job.findById(jobId);

    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Job not found' })
      };
    }

    // Prevent duplicate applications
    if (job.applicants && job.applicants.some(a => a.user.toString() === user.id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Already applied' })
      };
    }

    job.applicants = job.applicants || [];
    job.applicants.push({ user: user.id, appliedAt: new Date() });
    await job.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Application submitted' })
    };
  } catch (error) {
    console.error('Apply to job error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to apply' })
    };
  }
};