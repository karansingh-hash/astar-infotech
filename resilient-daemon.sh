#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"

while true; do
  # Double-fork to properly daemonize
  (
    setsid node node_modules/.bin/next dev --port 3000 >> /home/z/my-project/dev.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > /home/z/my-project/server.pid
    wait $SERVER_PID
  )
  echo "$(date): Server exited, restarting in 2s..." >> /home/z/my-project/daemon.log
  sleep 2
done
