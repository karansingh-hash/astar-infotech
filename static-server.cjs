const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

const publicDir = path.join(__dirname, 'public');
const nextStaticDir = path.join(__dirname, '.next', 'static');

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  
  // Root path -> serve captured HTML
  if (urlPath === '/') {
    const html = fs.readFileSync('/tmp/homepage-full.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }
  
  // Try to serve static files from public/ first, then .next/static/
  let filePath;
  if (urlPath.startsWith('/_next/static/')) {
    filePath = path.join(__dirname, urlPath);
  } else {
    filePath = path.join(publicDir, urlPath);
  }
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found: ' + urlPath);
      return;
    }
    
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}/`);
});

// Keep alive
setInterval(() => {}, 30000);
process.stdin.resume();
