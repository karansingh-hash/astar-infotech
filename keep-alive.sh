#!/bin/bash
while true; do
  cd /home/z/my-project
  export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
  export ADMIN_PASSWORD="astar@2024"
  node node_modules/.bin/next start --port 3000
  sleep 2
done
