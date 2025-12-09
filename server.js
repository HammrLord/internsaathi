/**
 * @file server.js
 * @description Central Socket.io Hub for PM Internship Platform
 * @keywords socket, server, hub, central, real-time, sync
 * 
 * This server acts as the real-time communication hub between:
 * - Recruiter Portal (localhost:3000)
 * - Student Portal (localhost:3001)
 * 
 * Run: node server.js
 * Port: 4000
 */

import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.SOCKET_PORT || 4000;

// Create HTTP server
const httpServer = createServer();

// Create Socket.io server with CORS
const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost:3000',  // Recruiter Portal
            'http://localhost:3001',  // Student Portal
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// ============================================================
// RECRUITER NAMESPACE (/recruiter)
// ============================================================
const recruiterNs = io.of('/recruiter');

recruiterNs.on('connection', (socket) => {
    console.log(`✅ [Recruiter] Connected: ${socket.id}`);

    // Job posted → broadcast to students
    socket.on('job:created', (data) => {
        console.log(`📢 [Job Created] ${data.title}`);
        io.of('/student').emit('job:created', data);
        io.emit('job_posted', data); // Legacy support
    });

    // Job updated → broadcast to students
    socket.on('job:updated', (data) => {
        io.of('/student').emit('job:updated', data);
    });

    // Candidate shortlisted → notify student
    socket.on('candidate:shortlisted', (data) => {
        console.log(`🎯 [Shortlisted] ${data.candidateName}`);
        io.of('/student').emit('candidate:shortlisted', data);
    });

    // Interview scheduled → notify student
    socket.on('interview:scheduled', (data) => {
        console.log(`📅 [Interview] Scheduled for ${data.candidateName}`);
        io.of('/student').emit('interview:scheduled', data);
    });

    socket.on('disconnect', () => {
        console.log(`❌ [Recruiter] Disconnected: ${socket.id}`);
    });
});

// ============================================================
// STUDENT NAMESPACE (/student)
// ============================================================
const studentNs = io.of('/student');

studentNs.on('connection', (socket) => {
    console.log(`✅ [Student] Connected: ${socket.id}`);

    // Application submitted → notify recruiters
    socket.on('application:submitted', (data) => {
        console.log(`📝 [Application] ${data.candidateName} applied for ${data.jobTitle}`);
        io.of('/recruiter').emit('application:submitted', data);
        io.emit('application_received_notification', data); // Legacy support
    });

    // Application withdrawn
    socket.on('application:withdrawn', (data) => {
        console.log(`🚪 [Withdrawn] ${data.candidateName}`);
        io.of('/recruiter').emit('application:withdrawn', data);
    });

    socket.on('disconnect', () => {
        console.log(`❌ [Student] Disconnected: ${socket.id}`);
    });
});

// ============================================================
// GLOBAL NAMESPACE (Legacy support for existing code)
// ============================================================
io.on('connection', (socket) => {
    console.log(`🌐 [Global] Connected: ${socket.id}`);

    // Legacy: job_posted event
    socket.on('job_posted', (data) => {
        socket.broadcast.emit('job_posted', data);
    });

    // Legacy: application_submitted event
    socket.on('application_submitted', (data) => {
        io.emit('application_received_notification', data);
    });

    socket.on('disconnect', () => {
        console.log(`🌐 [Global] Disconnected: ${socket.id}`);
    });
});

// ============================================================
// START SERVER
// ============================================================
httpServer.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🔌 PM Internship Platform - Socket.io Hub                  ║
║                                                               ║
║   Status:    Running                                          ║
║   Port:      ${PORT}                                              ║
║   Recruiter: http://localhost:3000 → /recruiter namespace     ║
║   Student:   http://localhost:3001 → /student namespace       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
});

export default io;
