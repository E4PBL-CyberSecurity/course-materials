import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { base, metadata, publication, readSources, getDocuments } from './documents.mjs';
import { renderPdf } from './pdf.mjs';
import { buildWeb } from './web.mjs';
import { check } from './check.mjs';
import { checkSources } from './check-sources.mjs';

const project = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(project);
await checkSources(root);
const publish = process.argv.includes('--publish');
const staging = path.join(project, 'dist');
const sources = await readSources(root);
const documents = getDocuments(sources);
const publishedSources = new Map(documents.map(doc => [doc.source, doc.slug]));
for (const [source, slug] of Object.entries(publication.aliases)) publishedSources.set(source, slug);
// Resolve links from their source folder before moving Markdown to the Web root.
function pdfLinks(source, doc) {
  return source.replace(/(^|[^!])(\[[^\]]*\])\(([^)]+)\)/g, (match, prefix, label, href) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(href)) return match;
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(doc.source), href));
    return `${prefix}${label}(https://github.com/${publication.repository}/blob/main/${resolved})`;
  });
}
function webLinks(source, doc) {
  return source.replace(/(!?\[[^\]]*\])\(([^)]+)\)/g, (match, label, href) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(href)) return match;
    const [file, anchor] = href.split('#');
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(doc.source), file));
    const slug = publishedSources.get(resolved);
    if (slug) return `${label}(${base}/${slug}.html${anchor ? `#${anchor}` : ''})`;
    if (resolved === 'docs/pdf/handbook.pdf') return `${label}(${base}/pdf/handbook.pdf)`;
    if (publication.assets.includes(resolved))
      return `${label}(${base}/${resolved})`;
    return `${label}(https://github.com/${publication.repository}/blob/main/${resolved}${anchor ? `#${anchor}` : ''})`;
  });
}
await fs.rm(path.join(project, 'src/content/docs'), { recursive: true, force: true });
await fs.rm(path.join(project, 'public'), { recursive: true, force: true });
await fs.mkdir(path.join(project, 'src/content/docs'), { recursive: true });
await fs.mkdir(path.join(project, 'public/pdf'), { recursive: true });
await fs.copyFile(path.join(project, 'assets/favicon.svg'), path.join(project, 'public/favicon.svg'));
for (const asset of publication.assets) {
  const destination = path.join(project, 'public', asset);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(path.join(root, asset), destination);
}
const originalCwd = process.cwd();
const cache = path.join(os.tmpdir(), `e4pbl-minitype-${createHash('sha256').update(project).digest('hex').slice(0, 8)}`);
await fs.mkdir(cache, { recursive: true });
const verification = [];
process.chdir(cache);
try {
  for (const doc of documents) {
    const chapters = doc.chapters.map(name => sources.get(name));
    const result = await renderPdf(doc.title, chapters.map(chapter => pdfLinks(chapter, doc)),
      path.join(project, 'public/pdf', doc.pdf), root);
    verification.push({ slug: doc.slug, pdf: doc.pdf, ...result });
    const content = webLinks(chapters.join('\n').replace(/^# .+\n/, ''), doc)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
        `<figure>\n\n![${alt}](${src})\n\n<figcaption>${alt}</figcaption>\n</figure>`);
    const position = documents.indexOf(doc);
    const link = target => ({ link: `${base}/${target.slug}.html`, label: target.label });
    const navigation = position < publication.chapterCount ?
      `prev: ${JSON.stringify(position ? link(documents[position - 1]) : false)}\n` +
      `next: ${JSON.stringify(position < publication.chapterCount - 1 ? link(documents[position + 1]) : false)}\n` : '';
    const frontmatter = `---\ntitle: ${JSON.stringify(doc.title)}\n${navigation}---\n`;
    const stamp = `${metadata.author}　${metadata.version} / ${metadata.date}`;
    await fs.writeFile(path.join(project, 'src/content/docs', `${doc.slug}.md`),
      `${frontmatter}\n${stamp}\n\n[印刷・配布用PDF](${base}/pdf/${doc.pdf})\n\n${content}`);
    console.log(`${doc.slug}: ${result.pages} PDF pages`);
  }
  const handbook = documents.slice(0, publication.chapterCount).map(doc => pdfLinks(sources.get(doc.slug), doc));
  const combined = await renderPdf(publication.handbookTitle, handbook,
    path.join(project, 'public/pdf/handbook.pdf'), root);
  verification.push({ slug: 'handbook', pdf: 'handbook.pdf', ...combined });
} finally { process.chdir(originalCwd); }
await fs.writeFile(path.join(project, 'verification.json'), JSON.stringify(verification, null, 2));
await buildWeb(project);
for (const doc of documents) {
  const filename = path.join(staging, `${doc.slug}.html`);
  const html = await fs.readFile(filename, 'utf8');
  await fs.writeFile(filename, html.replace(/<p>(表[0-9A-Z]+(?:-\d+)* [\s\S]*?)<\/p>\s*<table([^>]*)>/g,
    '<table$2><caption>$1</caption>'));
}
await fs.writeFile(path.join(staging, '.nojekyll'), '');
await fs.copyFile(path.join(staging, 'pdf/handbook.pdf'), path.join(staging, 'index.pdf'));
await check(project);
if (publish) {
  const destination = path.join(root, 'docs');
  if (process.platform === 'win32') {
    // Keep the root directory: SMB can delay deleting and recreating the same path.
    await new Promise((resolve, reject) => execFile('robocopy',
      [staging, destination, '/MIR', '/R:2', '/W:1', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'],
      { windowsHide: true }, error => {
        if (error && !(Number.isInteger(error.code) && error.code >= 0 && error.code < 8)) reject(error);
        else resolve();
      }));
  } else {
    await fs.rm(destination, { recursive: true, force: true });
    await fs.cp(staging, destination, { recursive: true });
  }
  console.log('Updated E4 docs/ from the verified build.');
} else console.log('Review build: publishing/dist/');
