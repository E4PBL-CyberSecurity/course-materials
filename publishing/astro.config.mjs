import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { base, metadata, publication, documents } from './documents.mjs';

export default defineConfig({
  site: 'https://e4pbl-cybersecurity.github.io', base,
  build: { format: 'file' }, trailingSlash: 'never',
  integrations: [starlight({
    title: metadata.title,
    defaultLocale: 'root', locales: { root: { label: '日本語', lang: 'ja' } },
    sidebar: [
      ...documents.slice(0, publication.chapterCount).map(({ label, slug }) => ({ label, slug })),
      { label: '別冊・教員用・検証記録', collapsed: true,
        items: documents.slice(publication.chapterCount).map(({ label, slug }) => ({ label, slug })) },
    ],
    tableOfContents: { minHeadingLevel: 1, maxHeadingLevel: 3 },
    customCss: ['./src/styles.css'], pagination: true, lastUpdated: false,
    head: [{ tag: 'meta', attrs: { name: 'author', content: metadata.author } }],
  })],
});
