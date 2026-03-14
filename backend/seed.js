const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');

// Sample jobs with requirements
const sampleJobs = [
  {
    title: 'Junior Software Developer',
    company: 'AC Group Ltd',
    location: 'Kigali, Rwanda',
    description: 'Join our innovative team at AC Group developing digital transport solutions. Work on backend and frontend systems for Tap&Go payment platform.',
    salary: '$800 - $1,200/month',
    jobType: 'full-time',
    requirements: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    minGrade: 14,
    skills: ['Problem-solving', 'Team collaboration', 'Quick learner']
  },
  {
    title: 'Full Stack Web Developer',
    company: 'Irembo',
    location: 'Kigali, Rwanda',
    description: 'Build government e-services platforms. Work on scalable web applications that serve millions of Rwandans.',
    salary: '$1,000 - $1,500/month',
    jobType: 'full-time',
    requirements: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker'],
    minGrade: 15,
    skills: ['API design', 'Database optimization', 'Security awareness']
  },
  {
    title: 'Mobile App Developer (React Native)',
    company: 'VugaPay',
    location: 'Kigali, Rwanda',
    description: 'Develop mobile payment solutions for the fintech revolution in Rwanda. Work on cross-platform mobile apps.',
    salary: '$900 - $1,400/month',
    jobType: 'full-time',
    requirements: ['React Native', 'JavaScript', 'Firebase', 'Mobile Payment APIs'],
    minGrade: 14,
    skills: ['Mobile UX', 'Payment integration', 'Debugging']
  },
  {
    title: 'IT Support Technician',
    company: 'TECOS Ltd',
    location: 'Kigali, Rwanda',
    description: 'Provide IT support and solutions to enterprise clients. Troubleshoot hardware and software issues.',
    salary: '$600 - $900/month',
    jobType: 'full-time',
    requirements: ['Windows/Linux', 'Networking basics', 'Customer service'],
    minGrade: 12,
    skills: ['Network troubleshooting', 'Help desk support', 'Documentation']
  },
  {
    title: 'Cybersecurity Specialist',
    company: 'UNITECH',
    location: 'Kigali, Rwanda',
    description: 'Protect enterprise networks and systems. Conduct security audits and implement security solutions.',
    salary: '$1,200 - $1,800/month',
    jobType: 'full-time',
    requirements: ['Network security', 'Firewalls', 'Penetration testing', 'Linux'],
    minGrade: 16,
    skills: ['Risk analysis', 'Incident response', 'Security policies']
  },
  {
    title: 'Data Scientist',
    company: 'MTN Rwanda',
    location: 'Kigali, Rwanda',
    description: 'Analyze telecom data to drive business insights. Build predictive models for customer behavior.',
    salary: '$1,300 - $2,000/month',
    jobType: 'full-time',
    requirements: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
    minGrade: 16,
    skills: ['Data visualization', 'Statistical analysis', 'Big data']
  },
  {
    title: 'QA Automation Engineer',
    company: 'wHTa Networks',
    location: 'Nairobi, Kenya (Remote OK)',
    description: 'Ensure software quality through automation testing. Build and maintain test automation frameworks.',
    salary: '$900 - $1,400/month',
    jobType: 'full-time',
    requirements: ['Selenium', 'Java/Python', 'CI/CD', 'Test frameworks'],
    minGrade: 13,
    skills: ['Automation', 'Bug reporting', 'Testing methodologies']
  },
  {
    title: 'Cloud Infrastructure Engineer',
    company: 'East Africa Hi Tech Solutions',
    location: 'Nairobi, Kenya',
    description: 'Design and manage cloud infrastructure on AWS/Azure. Ensure system availability and performance.',
    salary: '$1,100 - $1,700/month',
    jobType: 'full-time',
    requirements: ['AWS/Azure', 'Kubernetes', 'Linux', 'Terraform'],
    minGrade: 15,
    skills: ['Infrastructure as Code', 'DevOps', 'System administration']
  },
  {
    title: 'Frontend Developer (Angular)',
    company: 'JUMO',
    location: 'Kampala, Uganda / Remote',
    description: 'Build responsive web interfaces for mobile financial technology. Work with modern frontend frameworks.',
    salary: '$950 - $1,500/month',
    jobType: 'full-time',
    requirements: ['Angular', 'TypeScript', 'RxJS', 'HTML/CSS'],
    minGrade: 14,
    skills: ['UI/UX understanding', 'Responsive design', 'Browser debugging']
  },
  {
    title: 'Backend API Developer',
    company: 'TA Telecom',
    location: 'Kigali, Rwanda / Nairobi, Kenya',
    description: 'Develop robust APIs for telecom analytics platform. Handle high-volume data processing.',
    salary: '$1,000 - $1,600/month',
    jobType: 'full-time',
    requirements: ['Java/Go', 'REST APIs', 'PostgreSQL', 'Message queues'],
    minGrade: 15,
    skills: ['System design', 'Performance optimization', 'API security']
  },
  {
    title: 'DevOps Engineer',
    company: 'Digital Umuganda',
    location: 'Kigali, Rwanda',
    description: 'Manage deployment pipelines and infrastructure. Implement CI/CD for smooth development workflow.',
    salary: '$1,100 - $1,600/month',
    jobType: 'full-time',
    requirements: ['Docker', 'Jenkins', 'GitLab CI', 'Linux'],
    minGrade: 14,
    skills: ['Automation scripting', 'Monitoring', 'Troubleshooting']
  },
  {
    title: 'Intern - Web Development',
    company: 'kLab.rw',
    location: 'Kigali, Rwanda',
    description: 'Entry-level position for aspiring developers. Learn modern web development in a startup environment.',
    salary: '$200 - $400/month',
    jobType: 'internship',
    requirements: ['HTML/CSS', 'JavaScript basics', 'Willingness to learn'],
    minGrade: 12,
    skills: ['Curiosity', 'Communication', 'Time management']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auca-job-link');

    console.log('✅ Connected to MongoDB');

    // Create a demo employer user
    let employer = await User.findOne({ email: 'employer@auca.rw' });
    if (!employer) {
      employer = await User.create({
        name: 'AUCA Employer',
        email: 'employer@auca.rw',
        password: 'password123',
        role: 'employer'
      });
      console.log('✅ Created demo employer user');
    }

    // Create admin user for testing
    const adminExists = await User.findOne({ email: 'HOD@auca.rw' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'HOD@auca.rw',
        password: 'HOD123',
        role: 'admin'
      });
      console.log('✅ Created demo admin user');
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');

    // Add sample jobs
    const jobsWithEmployer = sampleJobs.map(job => ({
      ...job,
      postedBy: employer._id
    }));

    await Job.insertMany(jobsWithEmployer);
    console.log(`✅ Added ${sampleJobs.length} sample jobs to the database`);

    // Display summary
    const totalJobs = await Job.countDocuments();
    console.log(`\n📊 Database Summary:`);
    console.log(`   - Total jobs: ${totalJobs}`);
    console.log(`   - Posted by: ${employer.name}`);
    console.log(`\n✨ Seeding completed successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
