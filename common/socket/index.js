/**
 * @file index.js
 * @description Central Socket.io server configuration
 * @keywords socket, server, hub, real-time, websocket
 * 
 * Search tags:
 * - socket: socket.io setup
 * - hub: central event hub
 * - namespace: recruiter/student namespaces
 * - broadcast: cross-namespace messaging
 */

import { Server } from 'socket.io';
import {
    JOB_EVENTS,
    APPLICATION_EVENTS,
    CANDIDATE_EVENTS,
    NAMESPACES
} from './events.js';

/**
 * Initialize Socket.io server
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {Server} Socket.io server instance
 */
export function createSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // ============================================================
    // RECRUITER NAMESPACE
    // ============================================================
    const recruiterNs = io.of(NAMESPACES.RECRUITER);

    recruiterNs.on('connection', (socket) => {
        console.log(`[Recruiter] Connected: ${socket.id}`);

        // When recruiter creates a job → notify students
        socket.on(JOB_EVENTS.CREATED, (jobData) => {
            console.log(`[Job Created] ${jobData.title}`);
            io.of(NAMESPACES.STUDENT).emit(JOB_EVENTS.CREATED, jobData);
        });

        // When recruiter updates job → notify students
        socket.on(JOB_EVENTS.UPDATED, (jobData) => {
            io.of(NAMESPACES.STUDENT).emit(JOB_EVENTS.UPDATED, jobData);
        });

        // When recruiter shortlists candidate → notify that student
        socket.on(CANDIDATE_EVENTS.SHORTLISTED, (data) => {
            io.of(NAMESPACES.STUDENT).emit(CANDIDATE_EVENTS.SHORTLISTED, data);
        });

        // When recruiter schedules interview
        socket.on(CANDIDATE_EVENTS.INTERVIEW_SCHEDULED, (data) => {
            io.of(NAMESPACES.STUDENT).emit(CANDIDATE_EVENTS.INTERVIEW_SCHEDULED, data);
        });

        socket.on('disconnect', () => {
            console.log(`[Recruiter] Disconnected: ${socket.id}`);
        });
    });

    // ============================================================
    // STUDENT NAMESPACE
    // ============================================================
    const studentNs = io.of(NAMESPACES.STUDENT);

    studentNs.on('connection', (socket) => {
        console.log(`[Student] Connected: ${socket.id}`);

        // When student submits application → notify recruiters
        socket.on(APPLICATION_EVENTS.SUBMITTED, (applicationData) => {
            console.log(`[Application] ${applicationData.candidateName} applied`);
            io.of(NAMESPACES.RECRUITER).emit(APPLICATION_EVENTS.SUBMITTED, applicationData);
        });

        // When student withdraws application
        socket.on(APPLICATION_EVENTS.WITHDRAWN, (data) => {
            io.of(NAMESPACES.RECRUITER).emit(APPLICATION_EVENTS.WITHDRAWN, data);
        });

        socket.on('disconnect', () => {
            console.log(`[Student] Disconnected: ${socket.id}`);
        });
    });

    // ============================================================
    // GLOBAL NAMESPACE (for backwards compatibility)
    // ============================================================
    io.on('connection', (socket) => {
        console.log(`[Global] Connected: ${socket.id}`);

        // Legacy event support
        socket.on('job_posted', (data) => {
            io.emit('job_posted', data);
        });

        socket.on('application_submitted', (data) => {
            io.emit('application_received_notification', data);
        });
    });

    return io;
}

export default createSocketServer;
