import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { documents, publication } from './documents.mjs';

export function checkScope(files, scope) {
  if (scope !== 'public-network') return;
  for (const file of files) {
    const normalized = file.replaceAll('\\', '/');
    assert(!/^(?:dvwa\/|bettercap\/|firewall\/|archive\/|copilot-agent\/solution\/|verification\/|handbook\/(?:12-|01-dvwa-setup\.md$|02-web-experiments\.md$|03-arp-dns\.md$|04-vyos-firewall\.md$))/.test(normalized),
      `Private material in public scope: ${file}`);
    assert(!file.endsWith('.pdf'), `Existing PDF in public source scope: ${file}`);
  }
}

export async function checkSources(root, entries = documents, settings = publication) {
  const actualRoot = await fs.realpath(root);
  const withinRoot = async file => {
    assert(file && !path.isAbsolute(file) && !file.split(/[\\/]/).includes('..'), `Source escapes repository: ${file}`);
    const target = await fs.realpath(path.join(root, file));
    const relative = path.relative(actualRoot, target);
    assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), `Source escapes repository: ${file}`);
    return target;
  };
  assert(Number.isInteger(settings.chapterCount) && settings.chapterCount > 0 && settings.chapterCount <= entries.length,
    'Invalid chapter count');
  assert.equal(new Set(entries.map(doc => doc.slug)).size, entries.length, 'Duplicate page slug');
  assert.equal(new Set(entries.map(doc => doc.source)).size, entries.length, 'Duplicate source');
  checkScope([...entries.map(doc => doc.source), ...settings.assets, ...Object.keys(settings.aliases)], settings.scope);
  const generated = new Set(['docs/pdf/handbook.pdf', ...entries.map(doc => `docs/pdf/${doc.pdf}`)]);
  for (const asset of settings.assets) await withinRoot(asset);
  const sourceFiles = new Set([...entries.map(doc => doc.source), 'README.md', 'AGENTS.md', 'publishing/README.md']);
  for (const file of sourceFiles) {
    const source = await fs.readFile(await withinRoot(file), 'utf8');
    assert(/^# .+/m.test(source), `Missing title: ${file}`);
    const prose = source.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
    for (const [, href] of prose.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      if (/^(?:[a-z]+:|#|\/)/i.test(href)) continue;
      const [target] = href.split('#');
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(target)));
      assert(!resolved.startsWith('../'), `${file}: link escapes repository: ${href}`);
      if (!generated.has(resolved)) await withinRoot(resolved).catch(error => {
        throw new Error(`${file}: broken local link ${href}`, { cause: error });
      });
    }
  }
  console.log(`Checked ${settings.scope}: ${entries.length} pages, ${settings.assets.length} assets. No Web or PDF generated.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await checkSources(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
