const fs = require('fs');
const path = require('path');

const LOCATIONS = [
    'Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Hyderabad, India',
    'Pune, India', 'Chennai, India', 'Gurgaon, India', 'Noida, India',
    'Remote', 'Kolkata, India'
];

const ROLES = [
    {
        title: 'Product Analyst Intern',
        skills: ['SQL', 'Python', 'Data Analysis', 'Product Management', 'Tableau'],
        responsibilities: [
            'Analyze user behavior and product performance metrics',
            'Conduct market research and competitive analysis',
            'Assist in defining product requirements and user stories',
            'Collaborate with engineering and design teams'
        ]
    },
    {
        title: 'UX Research Intern',
        skills: ['User Research', 'Usability Testing', 'Figma', 'Interviewing', 'Prototyping'],
        responsibilities: [
            'Plan and conduct user research studies',
            'Analyze research findings and generate insights',
            'Create personas and user journey maps',
            'Present findings to stakeholders'
        ]
    },
    {
        title: 'Data Science Intern',
        skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'PyTorch'],
        responsibilities: [
            'Build and train machine learning models',
            'Preprocess and analyze large datasets',
            'Evaluate model performance and optimize hyperparameters',
            'Deploy models to production'
        ]
    },
    {
        title: 'Frontend Developer Intern',
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Next.js'],
        responsibilities: [
            'Develop responsive web interfaces',
            'Optimize application for maximum speed and scalability',
            'Collaborate with backend developers and designers',
            'Ensure high quality graphic standards and brand consistency'
        ]
    },
    {
        title: 'Backend Developer Intern',
        skills: ['Node.js', 'Python', 'Java', 'SQL', 'API Design'],
        responsibilities: [
            'Design and implement server-side logic',
            'Optimize database queries and schema',
            'Ensure security and data protection',
            'Integrate user-facing elements developed by frontend developers'
        ]
    },
    {
        title: 'Digital Marketing Intern',
        skills: ['SEO', 'Content Marketing', 'Social Media', 'Google Analytics', 'Copywriting'],
        responsibilities: [
            'Assist in the formulation of strategies to build a lasting digital connection with consumers',
            'Plan and monitor the ongoing company presence on social media',
            'Launch optimized online adverts through Google Adwords, Facebook etc.',
            'Measure performance of digital marketing efforts'
        ]
    }
];

const STIPENDS = ['₹15,000/month', '₹20,000/month', '₹25,000/month', '₹30,000/month', '₹35,000/month', '₹40,000/month'];
const DURATIONS = ['3 Months', '6 Months', '2 Months', '4 Months'];

function generateJobs() {
    const jobs = [];

    for (let i = 1; i <= 15; i++) {
        const role = ROLES[Math.floor(Math.random() * ROLES.length)];
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const stipend = STIPENDS[Math.floor(Math.random() * STIPENDS.length)];
        const duration = DURATIONS[Math.floor(Math.random() * DURATIONS.length)];

        // Generate random stats
        const applicants = Math.floor(Math.random() * 200) + 20;
        const shortlisted = Math.floor(applicants * (Math.random() * 0.1 + 0.05)); // 5-15% shortlisted
        const avgMatchScore = Math.floor(Math.random() * 20) + 75; // 75-95

        // Generate random date within last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const postedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        const posted = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

        jobs.push({
            id: i,
            title: role.title,
            location: location,
            type: Math.random() > 0.3 ? 'Full-time' : 'Part-time',
            applicants: applicants,
            posted: posted,
            postedDate: postedDate,
            status: Math.random() > 0.2 ? 'Active' : 'Closed',
            description: `We are looking for a ${role.title} to join our dynamic team. This is an exciting opportunity to work on real-world projects and gain hands-on experience in the industry.`,
            responsibilities: role.responsibilities,
            skills: role.skills,
            duration: duration,
            stipend: stipend,
            nptelCourses: [
                { name: 'Related Course 1', url: '#', platform: 'NPTEL' },
                { name: 'Related Course 2', url: '#', platform: 'NPTEL' }
            ],
            analytics: {
                applicants: applicants,
                shortlisted: shortlisted,
                avgMatchScore: avgMatchScore
            }
        });
    }

    const fileContent = `const jobs = ${JSON.stringify(jobs, null, 2)};\n\nexport default jobs;`;

    const outputPath = path.join(__dirname, '../src/data/jobs.js');
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Generated 15 jobs at ${outputPath}`);
}

generateJobs();
