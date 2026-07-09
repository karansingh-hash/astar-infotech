const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Set keep-alive
    res.setHeader('Connection', 'keep-alive');
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  server.keepAliveTimeout = 60000;
  server.headersTimeout = 65000;
  server.requestTimeout = 120000;
  
  server.listen(3000, '0.0.0.0', () => {
    console.log('> Ready on http://0.0.0.0:3000');
  });
  
  // Prevent any close signals
  process.on('SIGTERM', () => console.log('Ignoring SIGTERM'));
  process.on('SIGINT', () => console.log('Ignoring SIGINT'));
  
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
  });
  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
  });
  
  process.stdin.resume();
});

// Don't let the process exit
setInterval(() => {}, 60000);
