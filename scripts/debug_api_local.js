
// Mock NextResponse
const NextResponse = {
    json: (body, init) => ({ body, init, type: 'JSON' })
};

// Mock Request
class Request {
    constructor(url) {
        this.url = url || 'http://localhost:3000/api/test';
    }
}

async function testRoutes() {
    console.log("--- Testing Courses API ---");
    try {
        const { GET } = await import('../recruiter_side/src/app/api/courses/nptel/route.js');
        const req = new Request('http://localhost:3000/api/courses/nptel?skills=python');
        const res = await GET(req);
        console.log("Courses API Result:", res.body.courses ? `Success (${res.body.courses.length} courses)` : res);
    } catch (e) {
        console.error("Courses API Failed:", e);
    }

    console.log("\n--- Testing Profile API ---");
    try {
        const { GET } = await import('../recruiter_side/src/app/api/student/profile/route.js');
        const req = new Request('http://localhost:3000/api/student/profile?email=kartik12e4@gmail.com');
        const res = await GET(req);
        console.log("Profile API Result:", res.body.profile ? "Success" : res);
    } catch (e) {
        console.error("Profile API Failed:", e);
    }
}

// Mock next/server
import { Module } from 'module';
const originalRequire = Module.prototype.require;
Module.prototype.require = function (path) {
    if (path === 'next/server') return { NextResponse };
    return originalRequire.apply(this, arguments);
};

// Ensure environment variables are loaded for DB
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
// Manually parse env if dotenv fails (using the logic from before)
try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match && !process.env[match[1].trim()]) {
                process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        });
    }
} catch (e) { }


testRoutes();
