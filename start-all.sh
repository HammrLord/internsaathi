#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════╗
# ║   PM Internship Platform - Start All Services                ║
# ╚═══════════════════════════════════════════════════════════════╝

echo "🚀 Starting PM Internship Platform..."
echo ""

# Set environment variables if not already set
export DB_USER=${DB_USER:-kartiksharma}
export DB_HOST=${DB_HOST:-localhost}
export DB_NAME=${DB_NAME:-pm_recruit}
export DB_PASSWORD=${DB_PASSWORD:-}
export NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-secret123}
export NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

# Kill any existing processes on our ports
echo "🧹 Cleaning up old processes..."
lsof -ti :3000 | xargs kill -9 2>/dev/null
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :4000 | xargs kill -9 2>/dev/null

# Wait a moment
sleep 1

# Start Socket.io Hub
echo "🔌 Starting Socket.io Hub on :4000..."
node server.js &
SOCKET_PID=$!

# Wait for socket server to start
sleep 2

# Start Recruiter Portal
echo "👔 Starting Recruiter Portal on :3000..."
cd recruiter_side && npm run dev &
RECRUITER_PID=$!

# Start Student Portal
echo "🎓 Starting Student Portal on :3001..."
cd ../student_side && npm run dev &
STUDENT_PID=$!

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   All services started!                                       ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║   🔌 Socket Hub:       http://localhost:4000                  ║"
echo "║   👔 Recruiter Portal: http://localhost:3000                  ║"
echo "║   🎓 Student Portal:   http://localhost:3001                  ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║   Press Ctrl+C to stop all services                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Wait for all processes
wait
