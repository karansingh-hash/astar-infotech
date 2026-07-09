const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  server.listen(3000, '0.0.0.0', () => {
    console.log('> Ready on http://0.0.0.0:3000');
  });
  
  // Keep alive - catch errors
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
  });
  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
  });
  
  // Keep stdin open
  process.stdin.resume();
});
