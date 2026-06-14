#!/bin/bash
# Double-fork daemon pattern
cd /home/z/my-project
export DATABASE_URL="postgresql://neondb_owner/npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"

# First fork
(
  # Second fork - this detaches from the session
  setsid node node_modules/.bin/next start --port 3000 >> /home/z/my-project/dev.log 2>&1 &
  echo $! > /home/z/my-project/server.pid
) &

# Wait a moment for the PID file
sleep 2
if [ -f /home/z/my-project/server.pid ]; then
  PID=$(cat /home/z/my-project/server.pid)
  echo "Server daemonized with PID: $PID"
else
  echo "Failed to start server"
fi
