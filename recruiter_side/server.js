/**
 * @file server.js
 * @description Custom Next.js server with Socket.io integration
 * @keywords server, socket, real-time, next, custom
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    // Create Socket.io server
    const io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
        path: '/socket.io',
    });

    // Store io instance globally for API routes
    global.io = io;

    // =====================================================
    // Socket.io Event Handlers
    // =====================================================
    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // Job events - broadcast to all clients
        socket.on('job_posted', (data) => {
            console.log(`📢 [Job Posted] ${data.title}`);
            socket.broadcast.emit('job_posted', data);
        });

        // Application events
        socket.on('application_submitted', (data) => {
            console.log(`📝 [Application] ${data.candidateName} applied`);
            io.emit('application_received_notification', data);
        });

        // Candidate status events
        socket.on('candidate_shortlisted', (data) => {
            console.log(`🎯 [Shortlisted] ${data.candidateName}`);
            socket.broadcast.emit('candidate_shortlisted', data);
        });

        // Interview events
        socket.on('interview_scheduled', (data) => {
            console.log(`📅 [Interview] Scheduled for ${data.candidateName}`);
            socket.broadcast.emit('interview_scheduled', data);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   🚀 Recruiter Portal - Running                               ║
║                                                               ║
║   URL:       http://${hostname}:${port}                           ║
║   Socket.io: ws://${hostname}:${port}/socket.io                   ║
║   Mode:      ${dev ? 'Development' : 'Production'}                                     ║
╚═══════════════════════════════════════════════════════════════╝
        `);
    });
});
