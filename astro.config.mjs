// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages serves the site from /book_of_proof/
export default defineConfig({
  site: 'https://yalhojaily.github.io',
  base: '/book_of_proof',
  trailingSlash: 'always',
  integrations: [react(), mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false }]],
    }),
  },
});
