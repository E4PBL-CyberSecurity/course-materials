import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, publication, readSources, getDocuments } from './documents.mjs';

const decode = text => text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity) =>
  entity.startsWith('#') ? String.fromCodePoint(parseInt(entity.slice(entity[1] === 'x' ? 2 : 1), entity[1] === 'x' ? 16 : 10)) :
    ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[entity]);
const plain = text => decode(text.replace(/<[^>]*>/g, '').replace(/\*\*|`/g, '')).replace(/\s+/g, '');
const inlineText = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(inlineText).join('') : (node.text ?? inlineText(node.body ?? []));

export async function check(project) {
  const root = path.dirname(project);
  const sources = await readSources(root);
  const documents = getDocuments(sources);
  const results = JSON.parse(await fs.readFile(path.join(project, 'verification.json'), 'utf8'));
  assert.equal(results.length, documents.length + 1);
  await fs.access(path.join(project, 'dist/pagefind/pagefind.js'));
  const htmlFiles = (await fs.readdir(path.join(project, 'dist'), { recursive: true }))
    .filter(name => name.endsWith('.html')).map(name => name.replaceAll('\\', '/')).sort();
  assert.deepEqual(htmlFiles, ['404.html', ...documents.map(doc => `${doc.slug}.html`),
    ...publication.assets.filter(asset => asset.endsWith('.html'))].sort(),
    'Obsolete HTML remains');
  assert.deepEqual((await fs.readdir(path.join(project, 'dist/pdf'))).sort(),
    [...documents.map(doc => doc.pdf), 'handbook.pdf'].sort(), 'Obsolete PDF remains');
  const combined = results.find(result => result.slug === 'handbook');
  assert.deepEqual(combined.diagnostics, []);
  assert.deepEqual(combined.codes, results.slice(0, publication.chapterCount).flatMap(result => result.codes),
    'Combined handbook commands changed');
  assert.deepEqual(combined.tableCaptions, results.slice(0, publication.chapterCount).flatMap(result => result.tableCaptions),
    'Combined handbook table captions changed');
  const figureLabels = results.filter(result => result.slug !== 'handbook').flatMap(result => result.images.map(image => image.alt.split(' ')[0]));
  const tableLabels = results.filter(result => result.slug !== 'handbook').flatMap(result => result.tableCaptions.map(label => label.split(' ')[0]));
  assert.equal(new Set(figureLabels).size, figureLabels.length, 'Duplicate figure numbers');
  assert.equal(new Set(tableLabels).size, tableLabels.length, 'Duplicate table numbers');
  assert.deepEqual(await fs.readFile(path.join(project, 'dist/index.pdf')),
    await fs.readFile(path.join(project, 'dist/pdf/handbook.pdf')));
  for (const doc of documents) {
    const result = results.find(r => r.slug === doc.slug);
    assert(result, doc.slug);
    assert.deepEqual(result.diagnostics, []);
    const source = doc.chapters.map(name => sources.get(name)).join('\n');
    const codeBlocks = [...source.matchAll(/^```[^\n]*\n([\s\S]*?)^```\s*$/gm)].map(m => m[1].replace(/\n$/, ''));
    assert.deepEqual(result.codes, codeBlocks, `${doc.slug}: PDF commands changed`);
    const withoutCode = source.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
    const headings = [...withoutCode.matchAll(/^#{1,4} (.+)$/gm)].map(m => plain(m[1]));
    assert.deepEqual(result.headings.map(h => plain(inlineText(h))), headings, `${doc.slug}: PDF headings lost`);
    assert.equal(result.asides, [...withoutCode.matchAll(/^:::(?:caution|danger|note|tip)\b/gm)].length, `${doc.slug}: warnings lost`);
    assert.equal(result.tables, [...withoutCode.matchAll(/^\|[ :|\-]+\|\s*$/gm)].length, `${doc.slug}: tables lost`);
    assert.equal(result.images.length, [...withoutCode.matchAll(/!\[[^\]]*\]\(/g)].length, `${doc.slug}: images lost`);
    const tableCaptions = [...withoutCode.matchAll(/^表[0-9A-Z]+(?:-\d+)* .+$/gm)].map(match => match[0]);
    assert.equal(tableCaptions.length, result.tables, `${doc.slug}: every table needs a numbered caption`);
    assert.deepEqual(result.tableCaptions, tableCaptions, `${doc.slug}: PDF table captions changed`);
    const htmlFile = path.join(project, 'dist', `${doc.slug}.html`);
    const html = await fs.readFile(htmlFile, 'utf8');
    const position = documents.indexOf(doc);
    if (position < publication.chapterCount) {
      const next = html.match(/<a href="([^"]+)" rel="next"/);
      const previous = html.match(/<a href="([^"]+)" rel="prev"/);
      assert.equal(next?.[1], position < publication.chapterCount - 1 ? `${base}/${documents[position + 1].slug}.html` : undefined,
        `${doc.slug}: next chapter is out of order`);
      assert.equal(previous?.[1], position > 0 ? `${base}/${documents[position - 1].slug}.html` : undefined,
        `${doc.slug}: previous chapter is out of order`);
    }
    const screenCss = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].filter(m => !m[0].includes('media="print"'));
    const css = (await Promise.all(screenCss.map(async m => {
      const href = m[0].match(/href="([^"]+)"/)[1];
      return fs.readFile(path.join(project, 'dist', href.slice(base.length + 1)), 'utf8');
    }))).join('\n');
    assert(css.includes('--sl-sidebar-width'), `${doc.slug}: Starlight screen styles lost`);
    const copied = [...html.matchAll(/data-code="([^"]*)"/g)].map(m => decode(m[1]).replaceAll('\x7f', '\n'));
    assert.deepEqual(copied, codeBlocks, `${doc.slug}: HTML copy buttons changed commands`);
    const htmlText = plain(html);
    const captions = [...html.matchAll(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g)].map(m => plain(m[1]));
    const htmlTableCaptions = [...html.matchAll(/<caption[^>]*>([\s\S]*?)<\/caption>/g)].map(m => plain(m[1]));
    assert.deepEqual(htmlTableCaptions, tableCaptions.map(plain), `${doc.slug}: HTML table captions changed`);
    for (const image of result.images) assert(/^図\d+(?:-\d+)* .+/.test(image.alt), `${doc.slug}: figure number missing`);
    for (const image of result.images) assert(captions.some(c => c.includes(plain(image.alt))), `${doc.slug}: figure caption lost`);
    for (const heading of headings) assert(htmlText.includes(heading), `${doc.slug}: HTML heading lost: ${heading}`);
    for (const table of result.tableRows) for (const row of table) for (const cell of row)
      assert(htmlText.includes(plain(cell)), `${doc.slug}: table cell lost: ${cell}`);
    assert(!html.includes('id="undefined"'), `${doc.slug}: invalid heading anchor`);
    const pdf = await fs.readFile(path.join(project, 'dist/pdf', doc.pdf));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert(html.includes(`${base}/pdf/${doc.pdf}`), `${doc.slug}: download link lost`);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(decode(match[1]), `https://e4pbl-cybersecurity.github.io${base}/${doc.slug}.html`);
      if (url.origin !== 'https://e4pbl-cybersecurity.github.io' || !url.pathname.startsWith(`${base}/`)) continue;
      let relative = decodeURIComponent(url.pathname.slice(base.length + 1));
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      const target = path.join(project, 'dist', relative);
      await fs.access(target).catch(() => { throw new Error(`${doc.slug}: broken local link ${match[1]}`); });
      if (url.hash.startsWith('#table-') && relative.endsWith('.html')) {
        const targetHtml = await fs.readFile(target, 'utf8');
        assert(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `${doc.slug}: broken table reference ${match[1]}`);
      }
    }
    console.log(`Checked ${doc.slug}: ${result.pages} pages, ${codeBlocks.length} code blocks, ${result.tables} tables, ${result.asides} warnings.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await check(path.dirname(fileURLToPath(import.meta.url)));
