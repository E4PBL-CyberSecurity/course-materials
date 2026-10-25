import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

async function run(script, args, cwd) {
  const env = { ...process.env };
  // Windows treats Path case-insensitively; avoid duplicate keys in child processes.
  const searchPath = Object.entries(env).find(([key]) => key.toLowerCase() === 'path')?.[1] ?? '';
  for (const key of Object.keys(env)) if (key.toLowerCase() === 'path') delete env[key];
  env[process.platform === 'win32' ? 'Path' : 'PATH'] = `${path.join(cwd, 'node_modules/.bin')}${path.delimiter}${path.dirname(process.execPath)}${path.delimiter}${searchPath}`;
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd, env, stdio: 'inherit', windowsHide: true });
    child.on('error', reject);
    child.on('exit', status => status === 0 ? resolve() : reject(new Error(`Web build command failed: ${status}`)));
  });
}

export async function buildWeb(project) {
  let work = project;
  if (process.platform === 'win32') {
    // Astro loses styles when source/module paths differ on mapped shares.
    // Keep only the Web build on local disk; Markdown remains in the repository.
    work = path.join(os.tmpdir(), `e4pbl-documents-web-${createHash('sha256').update(project).digest('hex').slice(0, 8)}`);
    await fs.mkdir(work, { recursive: true });
    const lock = await fs.readFile(path.join(project, 'package-lock.json'), 'utf8');
    for (const name of ['package.json', 'package-lock.json', 'astro.config.mjs', 'documents.mjs'])
      await fs.copyFile(path.join(project, name), path.join(work, name));
    let installed;
    try { installed = await fs.readFile(path.join(work, '.installed-lock'), 'utf8'); } catch {}
    if (installed !== lock) {
      await run(path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'), ['ci', '--no-audit', '--no-fund'], work);
      await fs.writeFile(path.join(work, '.installed-lock'), lock);
    }
    for (const name of ['src', 'public']) {
      await fs.rm(path.join(work, name), { recursive: true, force: true });
      await fs.cp(path.join(project, name), path.join(work, name), { recursive: true });
    }
  }
  await fs.rm(path.join(work, 'dist'), { recursive: true, force: true });
  await fs.rm(path.join(work, 'node_modules/.astro/data-store.json'), { force: true });
  await run(path.join(work, 'node_modules/astro/astro.js'), ['build'], work);
  if (work !== project) {
    await fs.rm(path.join(project, 'dist'), { recursive: true, force: true });
    await fs.cp(path.join(work, 'dist'), path.join(project, 'dist'), { recursive: true });
  }
}
