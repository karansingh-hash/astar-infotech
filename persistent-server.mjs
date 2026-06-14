import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

const env = {
  ...process.env,
  DATABASE_URL: 'postgresql://neondb_owner/npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ADMIN_PASSWORD: 'astar@2024'
};

function startServer() {
  const child = spawn('node', ['node_modules/.bin/next', 'start', '--port', '3000'], {
    cwd: '/home/z/my-project',
    env,
    stdio: 'inherit'
  });
  
  child.on('exit', (code) => {
    writeFileSync('/home/z/my-project/restart.log', `${new Date().toISOString()}: Server exited with code ${code}, restarting in 2s...\n`, { flag: 'a' });
    setTimeout(startServer, 2000);
  });
  
  child.on('error', (err) => {
    writeFileSync('/home/z/my-project/restart.log', `${new Date().toISOString()}: Server error: ${err.message}\n`, { flag: 'a' });
    setTimeout(startServer, 2000);
  });
  
  return child;
}

// Keep this process alive
process.on('SIGTERM', () => { /* ignore */ });
process.on('SIGINT', () => { /* ignore */ });

const server = startServer();
writeFileSync('/home/z/my-project/restart.log', `${new Date().toISOString()}: Persistent server manager started\n`, { flag: 'a' });
