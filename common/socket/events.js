/**
 * @file events.js
 * @description Socket.io event name constants for real-time sync
 * @keywords socket, events, real-time, sync, broadcast
 * 
 * Search tags:
 * - socket: socket.io events
 * - real-time: live updates
 * - sync: data synchronization
 * - broadcast: emit to all clients
 */

// ============================================================
// JOB EVENTS - Recruiter → Student sync
// ============================================================
export const JOB_EVENTS = {
    CREATED: 'job:created',           // New job posted
    UPDATED: 'job:updated',           // Job details changed
    DELETED: 'job:deleted',           // Job removed
    STATUS_CHANGED: 'job:status',     // Active/Inactive toggle
};

// ============================================================
// APPLICATION EVENTS - Student → Recruiter sync
// ============================================================
export const APPLICATION_EVENTS = {
    SUBMITTED: 'application:submitted',     // New application
    WITHDRAWN: 'application:withdrawn',     // Student withdrew
    STATUS_UPDATED: 'application:status',   // Status changed
};

// ============================================================
// CANDIDATE EVENTS - Recruiter actions → Student notifications
// ============================================================
export const CANDIDATE_EVENTS = {
    SHORTLISTED: 'candidate:shortlisted',       // Moved to shortlist
    REJECTED: 'candidate:rejected',             // Application rejected
    INTERVIEW_SCHEDULED: 'candidate:interview', // Interview scheduled
    OFFER_SENT: 'candidate:offer',              // Offer letter sent
    HIRED: 'candidate:hired',                   // Final selection
};

// ============================================================
// NOTIFICATION EVENTS - Both directions
// ============================================================
export const NOTIFICATION_EVENTS = {
    NEW: 'notification:new',             // New notification
    READ: 'notification:read',           // Marked as read
    CLEAR_ALL: 'notification:clear',     // Clear all notifications
};

// ============================================================
// INTERVIEW EVENTS - Real-time interview updates
// ============================================================
export const INTERVIEW_EVENTS = {
    SCHEDULED: 'interview:scheduled',
    RESCHEDULED: 'interview:rescheduled',
    CANCELLED: 'interview:cancelled',
    COMPLETED: 'interview:completed',
    REMINDER: 'interview:reminder',
};

// ============================================================
// SYSTEM EVENTS - Connection management
// ============================================================
export const SYSTEM_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    PING: 'ping',
    PONG: 'pong',
};

// ============================================================
// NAMESPACE CONSTANTS
// ============================================================
export const NAMESPACES = {
    RECRUITER: '/recruiter',
    STUDENT: '/student',
    ADMIN: '/admin',
};
