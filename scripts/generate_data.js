const fs = require('fs');
const path = require('path');

const ROLES = ['Product Analyst', 'UX Researcher', 'Data Analyst', 'Product Manager', 'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer'];
const LOCATIONS = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Noida', 'Gurgaon'];
const EDUCATIONS = ['B.Tech', 'B.Des', 'B.Sc Statistics', 'MBA', 'M.Tech', 'BCA', 'MCA'];
const SKILLS = ['Product Strategy', 'SQL', 'Figma', 'User Research', 'Wireframing', 'Prototyping', 'Python', 'Tableau', 'Excel', 'Roadmapping', 'Agile', 'Jira', 'React', 'Node.js', 'Java', 'AWS', 'Docker'];
const STATUSES = ['Shortlisted', 'Pending Review', 'New', 'Ineligible'];

const FIRST_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Kiara', 'Myra', 'Riya', 'Anvi', 'Aaradhya', 'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Neha', 'Rohan', 'Kavita', 'Suresh', 'Pooja'];
const LAST_NAMES = ['Sharma', 'Patel', 'Kumar', 'Gupta', 'Singh', 'Reddy', 'Verma', 'Mishra', 'Jain', 'Yadav', 'Nair', 'Kulkarni', 'Das', 'Roy', 'Chopra', 'Malhotra', 'Bhat', 'Rao', 'Desai', 'Mehta'];

const SUMMARIES = [
    "Highly motivated professional with a passion for problem-solving and a strong technical background.",
    "Creative thinker with experience in user-centric design and agile methodologies.",
    "Data-driven analyst with proficiency in statistical modeling and visualization tools.",
    "Experienced developer with a track record of delivering scalable and efficient software solutions.",
    "Aspiring product manager with a knack for identifying user needs and translating them into features."
];

const PROJECT_TITLES = [
    "E-commerce Analytics Dashboard", "Task Management App", "Food Delivery App Redesign", "Accessibility Audit",
    "Stock Market Prediction", "Sales Dashboard", "SaaS Platform Launch", "Mobile App Roadmap",
    "Portfolio Website", "Chat Application", "Weather App", "Expense Tracker"
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSubarray(arr, size) {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp, index;
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function generateCandidates(count) {
    const candidates = [];
    for (let i = 1; i <= count; i++) {
        const role = getRandomItem(ROLES);
        const status = getRandomItem(STATUSES);
        const matchScore = status === 'Shortlisted' ? getRandomInt(85, 99) :
            status === 'Pending Review' ? getRandomInt(70, 85) :
                status === 'Ineligible' ? getRandomInt(30, 60) : getRandomInt(60, 90);

        const firstName = getRandomItem(FIRST_NAMES);
        const lastName = getRandomItem(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 99)}@example.com`;
        const phone = `+91 ${getRandomInt(70000, 99999)} ${getRandomInt(10000, 99999)}`;
        const location = getRandomItem(LOCATIONS);
        const education = getRandomItem(EDUCATIONS);
        const skills = getRandomSubarray(SKILLS, 4);

        const candidate = {
            id: i,
            name: fullName,
            role: role,
            email: email,
            phone: phone,
            location: location,
            education: education,
            matchScore: matchScore,
            summary: getRandomItem(SUMMARIES),
            skills: skills,
            status: status,
            jobId: getRandomInt(1, 5),
            ineligibleReason: status === 'Ineligible' ? 'Does not meet criteria' : undefined,
            aiInterview: {
                status: status === 'New' ? 'Pending' : 'Completed',
                score: status === 'New' ? 0 : getRandomInt(70, 95),
                summary: "Candidate showed good potential and understanding of core concepts.",
                strengths: ["Communication", "Technical Knowledge"],
                weaknesses: ["Practical Experience"]
            },
            eligibility: {
                isEligible: status !== 'Ineligible',
                checks: [
                    { label: 'Age (21-24)', status: 'pass' },
                    { label: 'Indian National', status: 'pass' },
                    { label: 'Education (High School+)', status: status === 'Ineligible' ? 'fail' : 'pass' },
                    { label: 'Not in Full-time Employment', status: 'pass' },
                    { label: 'Not from Exclusion List (IIT/IIM)', status: 'pass' }
                ]
            },
            timeline: [
                { type: 'application', title: 'Application Received', date: '2 days ago', description: `Applied for ${role} position.` }
            ],
            matchBreakdown: {
                overall: matchScore,
                categories: [
                    { name: 'Skills', score: getRandomInt(70, 95), evidence: [`Matched: ${skills[0]}, ${skills[1]}`], missing: [] },
                    { name: 'Education', score: getRandomInt(80, 100), evidence: [`${education} matches requirement`], missing: [] },
                    { name: 'Experience', score: getRandomInt(60, 90), evidence: ['Internship experience'], missing: [] },
                    { name: 'AI Interview', score: getRandomInt(70, 95), evidence: ['Good communication'], missing: [] },
                    { name: 'Location', score: getRandomInt(80, 100), evidence: [`${location}`], missing: [] }
                ]
            },
            certificates: [
                { id: 1, name: 'Professional Certificate', issuer: 'Coursera', date: '2023-05-15', status: 'verified' }
            ],
            projects: [
                {
                    title: getRandomItem(PROJECT_TITLES),
                    description: "A comprehensive project demonstrating core skills and problem-solving abilities.",
                    techStack: [skills[0], skills[1], "HTML/CSS"],
                    link: "https://github.com/example/project"
                }
            ]
        };
        candidates.push(candidate);
    }
    return candidates;
}

const candidates = generateCandidates(100);

// Generate Frontend Data
const frontendData = `export const candidates = ${JSON.stringify(candidates, null, 2)};`;
fs.writeFileSync(path.join(__dirname, '../src/data/candidates.js'), frontendData);

// Generate SQL Data
let sqlData = 'DELETE FROM applicants;\n';
candidates.forEach(c => {
    sqlData += `INSERT INTO applicants (id, name, role, email, status, match_score) VALUES (${c.id}, '${c.name}', '${c.role}', '${c.email}', '${c.status}', ${c.matchScore});\n`;
});

fs.writeFileSync(path.join(__dirname, '../chatbot/db/seed_data.sql'), sqlData);

console.log('Data generated successfully!');
