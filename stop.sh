#!/bin/bash

# WOI On-Prem Mockup - Stop Script
# This script stops the development server running on port 5173

echo "🛑 Stopping WOI On-Prem Mockup..."
echo ""

# Find process running on port 5173
PID=$(lsof -ti:5173)

if [ -z "$PID" ]; then
    echo "ℹ️  No process found running on port 5173"
    echo "✅ Server is already stopped"
else
    echo "🔍 Found process $PID running on port 5173"
    echo "🔪 Killing process..."
    kill -9 $PID
    
    # Wait a moment and verify
    sleep 1
    
    # Check if process is still running
    if lsof -ti:5173 > /dev/null 2>&1; then
        echo "❌ Failed to stop the server"
        exit 1
    else
        echo "✅ Server stopped successfully"
    fi
fi

echo ""
echo "Done!"
