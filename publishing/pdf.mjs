import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { PDFDocument, PDFDict, PDFArray, PDFString, PDFNumber, PDFName } from 'pdf-lib';
import { fileURLToPath } from 'node:url';
import {
  minitype, mdString, h1, h2, h3, h4, p, code, image, caption, box,
  newpage, page, totalPages, physical, pt, em, fill, hexToRgb, solid, extractInlineText, url,
} from '@minitype/minitype';
import { metadata, publication } from './documents.mjs';

const fontDir = path.join(path.dirname(fileURLToPath(import.meta.resolve('@minitype/minitype'))), '../fonts');
const regular = 'SourceHanSansJP-Regular';
const bold = 'SourceHanSansJP-Bold';
const mono = 'NOTONOTO35HS-Regular';
const ink = hexToRgb('#183047');
const accent = hexToRgb('#006B73');
const pale = hexToRgb('#EDF4F5');
const bodyStyle = { font: regular, size: pt(10), lineHeight: em(1.5), firstIndent: 0, align: 'left', hyphenation: false, burasagari: false, effects: [fill(ink)] };
const heading = (fn, text) => ({ ...fn(text), unnumbered: true });

export async function renderPdf(title, chapters, destination, repoRoot) {
  const body = [
    heading(h1, [title]),
    p(`${metadata.author}　${metadata.version} / ${metadata.date}`),
  ];
  const captures = { codes: [], headings: [], tables: 0, tableRows: [], tableCaptions: [], asides: 0, links: [], images: [] };
  const aside = (label, color) => blocks => {
    captures.asides++;
    return box([p(label, { font: bold, effects: [fill(color)] }), ...blocks], {
      padding: physical(3, 4), splitable: true, background: [fill(pale)],
    });
  };
  for (const [index, source] of chapters.entries()) {
    if (index === 1) body.push(newpage());
    const mapping = {
      ...Object.fromEntries([h1, h2, h3, h4].map((fn, i) => [`h${i + 1}`, text => {
        captures.headings.push(text);
        if (i === 0 && index === 0 && extractInlineText(text) === title) return [];
        return heading(fn, text);
      }])),
      code: (text) => {
        captures.codes.push(text);
        const longest = Math.max(...text.split('\n').map(line => line.length));
        assert(longest <= 110, 'Split commands longer than 110 characters with the shell continuation syntax');
        // Keep commands literal; syntax highlighting must not alter shell quoting.
        return box([code(text, undefined, { size: pt(longest > 96 ? 7 : 8), splitable: false })], { padding: physical(2, 3), splitable: false, background: [fill(pale)] });
      },
      link: (href, inlines) => {
        if (href.startsWith('#table-')) {
          captures.links.push(href);
          return { ...url(href, inlines), link: { type: 'destination', destination: href.slice(1) } };
        }
        const target = new URL(href, `https://github.com/${publication.repository}/blob/main/`).href;
        captures.links.push(target);
        return url(target, inlines);
      },
      image: (src, alt, title) => {
        captures.images.push({ src, alt });
        return box([
          image(path.resolve(repoRoot, src.replace(/^\.\.\//, '')), { width: 170, align: 'center' }),
          caption(title || alt),
        ], { splitable: false });
      },
      containers: {
        caution: aside('警告', hexToRgb('#8A4800')),
        danger: aside('警告', hexToRgb('#A62020')),
        note: aside('補足', accent),
        tip: aside('重要', accent),
      },
    };
    const { blocks } = mdString(source, mapping);
    const visit = blocks => {
      for (const block of blocks) {
        if (block.type === 'table') {
          captures.tables++;
          captures.tableRows.push(block.rows.map(row => row.map(cell => extractInlineText(cell.block.lines.flat()))));
          const columns = block.rows[0].length;
          const firstHeader = extractInlineText(block.rows[0][0].block.lines.flat());
          let widths = columns === 2 ? [48, 122] : columns === 5 ? [25, 36.25, 36.25, 36.25, 36.25] : Array(columns).fill(170 / columns);
          if (firstHeader === '区域') widths = [32, 62, 76];
          if (firstHeader === '対象') widths = [43, 69, 58];
          if (firstHeader === 'DNS名') widths = [84, 46, 40];
          if (firstHeader === 'ペア' || firstHeader === '班番号') widths = [24, 26, 55, 65];
          block.style = { ...block.style, columnWidths: widths, cellPadding: physical(2, 2) };
        }
        if (Array.isArray(block.blocks)) visit(block.blocks);
        if (Array.isArray(block.body)) visit(block.body);
      }
    };
    visit(blocks);
    for (let position = 0; position < blocks.length; position++) {
      const block = blocks[position];
      if (block.textType === 'paragraph' && blocks[position + 1]?.type === 'table') {
        const label = extractInlineText(block.lines.flat());
        assert(/^表[0-9A-Z]+(?:-\d+)* .+/.test(label), `Table caption missing: ${label}`);
        captures.tableCaptions.push(label);
        blocks[position] = { ...caption(label), id: `table-${label.split(' ')[0].slice(1)}` };
      }
    }
    for (let position = 0; position < blocks.length; position++) {
      const block = blocks[position];
      if (/^h[1-4]$/.test(block.textType) && blocks[position + 1]?.textType === 'caption' && blocks[position + 2]?.type === 'table') {
        body.push(box([block, blocks[++position], blocks[++position]], { splitable: false }));
      } else if (block.textType === 'caption' && blocks[position + 1]?.type === 'table') {
        body.push(box([block, blocks[++position]], { splitable: false }));
      }
      // A table can move to the next page as a unit; its heading must follow it.
      else if (/^h[1-4]$/.test(block.textType) && blocks[position + 1]?.type === 'table') {
        body.push(box([block, blocks[++position]], { splitable: false }));
      } else body.push(block);
    }
  }
  body.push({ type: 'flow', position: 'nombre', blockOffset: 5,
    blocks: [p([[page, ' / ', totalPages]], { ...bodyStyle, size: pt(8), align: 'right' })] });
  const document = minitype([{ body }], {
    size: 'A4', padding: physical(18, 20, 22, 20),
    block: {
      paragraph: bodyStyle,
      h1: { ...bodyStyle, font: bold, size: pt(17), splitable: false, needspace: 14, effects: [fill(accent)] },
      h2: { ...bodyStyle, font: bold, size: pt(13), splitable: false, needspace: 12, effects: [fill(accent)] },
      h3: { ...bodyStyle, font: bold, size: pt(11), splitable: false, needspace: 10 },
      h4: { ...bodyStyle, font: bold, size: pt(10), splitable: false, needspace: 10 },
      code: { ...bodyStyle, font: mono, size: pt(8), lineHeight: em(1.45), pre: true, splitable: true },
      li1: { ...bodyStyle, splitable: true }, li2: { ...bodyStyle, splitable: true }, li3: { ...bodyStyle, splitable: true },
      caption: { ...bodyStyle, size: pt(8.5), lineHeight: em(1.4) },
      table: {
        splitable: true, cellPadding: physical(2, 2),
        horizontalBorders: solid(.2, hexToRgb('#CBD7DB')),
        textStyle: row => ({ ...bodyStyle, font: row === 0 ? bold : regular, size: pt(8.5), lineHeight: em(1.4) }),
        background: row => row === 0 ? pale : undefined,
      },
    },
    command: {
      b: { font: bold },
      c: { font: mono, size: pt(9), splitable: true, effects: [fill(accent)] },
      url: { effects: [fill(accent)] },
    },
    gaps: [['h1', 'fallback', 5], ['h2', 'fallback', 3], ['h3', 'fallback', 2], ['fallback', 'h2', 5], ['fallback', 'h3', 4], ['fallback', 'fallback', 2]],
  // Chapter and figure/table numbers are written explicitly in the Markdown.
  }, { fontDir, disableDefaultTransformers: true, metadata: { title, author: metadata.author } });
  const diagnostics = await document.getDiagnostics();
  if (diagnostics.length) {
    const layout = await document.getLayout();
    console.log(diagnostics.map(d => ({ ...d, content: layout.find(b => b.id === d.blockId)?.content })));
  }
  assert.deepEqual(diagnostics, [], `${title}: typesetting diagnostics`);
  assert.equal(captures.codes.length, chapters.reduce((n, s) => n + [...s.matchAll(/^```[^\n]*\n/gm)].filter(m => !m[0].trim().endsWith('```')).length, 0), 'Code blocks were lost');
  await document.save(destination);
  const tableLinks = new Set(captures.links.filter(link => link.startsWith('#table-')).map(link => link.slice(1)));
  if (tableLinks.size) {
    const pdf = await PDFDocument.load(await fs.readFile(destination));
    const names = pdf.catalog.lookup(PDFName.of('Names'), PDFDict)
      .lookup(PDFName.of('Dests'), PDFDict).lookup(PDFName.of('Names'), PDFArray);
    const layout = new Map((await document.getLayout()).map(block => [block.id, block]));
    for (let i = 0; i < names.size(); i += 2) {
      const id = names.lookup(i, PDFString).decodeText();
      if (!tableLinks.has(id)) continue;
      const block = layout.get(id);
      assert(block && block.pageIndex !== null && block.x !== null && block.y !== null, `Missing table destination: ${id}`);
      const target = names.lookup(i + 1, PDFArray);
      // minitype 0.1.7 writes destinations in mm; use PDF points and leave space above the caption.
      target.set(2, PDFNumber.of(block.x * 72 / 25.4));
      target.set(3, PDFNumber.of(pdf.getPage(block.pageIndex).getHeight() - Math.max(0, block.y - 3) * 72 / 25.4));
      tableLinks.delete(id);
    }
    assert.equal(tableLinks.size, 0, `Unresolved PDF table links: ${[...tableLinks].join(', ')}`);
    await fs.writeFile(destination, await pdf.save());
  }
  return { pages: await document.getPageCount(), ...captures, diagnostics };
}
