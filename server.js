const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const relativePath = requestPath === '/manus-routes.json' || requestPath.startsWith('/assets/')
    ? path.join('public', requestPath.replace(/^\/+/, ''))
    : requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) return send(res, 403, 'Forbidden');

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (requestPath !== '/') return send(res, 404, 'Not found');
      return send(res, 404, 'Not found');
    }
    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`SEYLARI coming-soon page listening on ${port}`);
});
