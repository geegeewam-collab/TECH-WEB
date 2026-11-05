import { cp, mkdir, rm, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(projectRoot, 'site');
const output = path.join(projectRoot, 'dist');

try {
  await access(source);
} catch {
  console.error('Build failed: the site/ directory is missing.');
  process.exit(1);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('Build complete. Static website copied to dist/.');
console.log('Deploy the dist/ directory to Vercel, or use the included Vercel configuration.');
