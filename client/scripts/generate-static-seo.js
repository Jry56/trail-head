// Runs after `vite build`. The static files in client/public/ (robots.txt,
// llms.txt) are copied into dist/ automatically by Vite as safe fallbacks.
// If the API is reachable at build time, this script overwrites them with
// the live, database-backed versions (see server/src/controllers/seoController.js)
// so sitemap.xml in particular always reflects the current catalog rather
// than only the four static routes.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const apiBase = (process.env.VITE_SITE_URL || 'http://localhost:5000').replace(/\/$/, '');

const targets = [
  { url: `${apiBase}/sitemap.xml`, file: 'sitemap.xml' },
  { url: `${apiBase}/robots.txt`, file: 'robots.txt' },
  { url: `${apiBase}/llms.txt`, file: 'llms.txt' },
];

async function run() {
  for (const target of targets) {
    try {
      const res = await fetch(target.url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.text();
      await writeFile(path.join(distDir, target.file), body, 'utf8');
      console.log(`[postbuild] Wrote live ${target.file} from ${target.url}`);
    } catch (err) {
      console.log(`[postbuild] Skipped ${target.file} (API not reachable at build time: ${err.message}). Keeping the static fallback from public/.`);
    }
  }
}

run();
