import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkScope, checkSources } from './check-sources.mjs';

test('public scope rejects private procedures, fixtures, exports and old PDFs', () => {
  for (const file of ['handbook/12-experiments.md', 'handbook/01-dvwa-setup.md', 'handbook/02-web-experiments.md', 'handbook/03-arp-dns.md', 'handbook/04-vyos-firewall.md', 'firewall/check-lab.mjs', 'dvwa/pbl-experiments.zip', 'bettercap/experiment.md', 'archive/old.md',
    'copilot-agent/solution/bot.xml', 'verification/attacks.json', 'handbook.pdf'])
    assert.throws(() => checkScope([file], 'public-network'));
  assert.doesNotThrow(() => checkScope(['handbook/09-router2.md', 'network-construction/network.png'], 'public-network'));
  assert.doesNotThrow(() => checkScope(['dvwa/setup.md'], 'private-experiments'));
});

test('source check rejects broken links and paths outside the repository without rendering', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'e4pbl-source-check-'));
  t.after(async () => {
    assert(path.resolve(root).startsWith(path.join(os.tmpdir(), 'e4pbl-source-check-')));
    await fs.rm(root, { recursive: true, force: true });
  });
  await fs.mkdir(path.join(root, 'publishing'));
  for (const file of ['README.md', 'AGENTS.md', 'publishing/README.md', 'page.md'])
    await fs.writeFile(path.join(root, file), '# Fixture\n');
  const entries = [{ slug: 'index', source: 'page.md', pdf: 'index.pdf' }];
  const settings = { scope: 'public-network', chapterCount: 1, assets: [], aliases: {} };
  await checkSources(root, entries, settings);
  await fs.writeFile(path.join(root, 'page.md'), '# Fixture\n[missing](missing.md)\n');
  await assert.rejects(checkSources(root, entries, settings), /broken local link/);
  await assert.rejects(checkSources(root, [{ ...entries[0], source: '../outside.md' }], settings), /escapes repository/);
});
