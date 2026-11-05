import http from 'node:http';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const useDist = process.argv.includes('--dist');
const root = path.join(projectRoot, useDist ? 'dist' : 'site');
const port = Number(process.env.PORT || (useDist ? 4174 : 4173));

try {
  await access(root);
} catch {
  console.error(useDist ? 'No dist/ folder found. Run npm run build first.' : 'The site/ folder is missing.');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function safePath(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]); }
  catch { return null; }
  const normalized = path.normalize(decoded).replace(/^([.][.][/\\])+/, '');
  const candidate = path.resolve(root, `.${normalized.startsWith('/') ? normalized : `/${normalized}`}`);
  if (candidate !== root && !candidate.startsWith(root + path.sep)) return null;
  return candidate;
}

async function resolveFile(requestPath) {
  const candidate = safePath(requestPath);
  if (!candidate) return null;
  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    if (info.isDirectory()) {
      const index = path.join(candidate, 'index.html');
      await access(index);
      return index;
    }
  } catch {}
  if (!path.extname(candidate)) {
    const cleanUrlIndex = path.join(candidate, 'index.html');
    try { await access(cleanUrlIndex); return cleanUrlIndex; } catch {}
  }
  return null;
}

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Method not allowed');
    return;
  }

  const filePath = await resolveFile(request.url || '/');
  if (!filePath) {
    const notFound = path.join(root, '404.html');
    try {
      const body = await readFile(notFound);
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
    return;
  }

  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const isAsset = filePath.includes(`${path.sep}assets${path.sep}`);
    response.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': isAsset && /\.(png|svg)$/.test(ext) ? 'public, max-age=31536000, immutable' : 'no-cache'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Unable to read the requested file.');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`GEEGEE TECH ${useDist ? 'preview' : 'development'} server is running.`);
  console.log(`Open: http://localhost:${port}`);
  console.log('Press Ctrl + C to stop the server.');
});
