#!/bin/bash
export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"
cd /home/z/my-project
exec node node_modules/.bin/next dev -p 3000
