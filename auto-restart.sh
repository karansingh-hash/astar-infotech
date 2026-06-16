#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="postgresql://neondb_owner/npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"

while true; do
  # Check if server is responding
  if ! curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    pkill -f "next start" 2>/dev/null
    sleep 1
    node node_modules/.bin/next start --port 3000 >> /home/z/my-project/dev.log 2>&1 &
    echo "$(date): Restarted server" >> /home/z/my-project/restart.log
    sleep 5
  fi
  sleep 3
done
