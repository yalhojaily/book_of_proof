import katex from 'katex';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Turn "text with $x \in A$ math" into HTML, rendering each $...$ with KaTeX (build time). */
export function inlineMath(src: string): string {
  return src
    .split(/(\$[^$]+\$)/g)
    .map((p) =>
      p.startsWith('$') && p.endsWith('$')
        ? katex.renderToString(p.slice(1, -1), { throwOnError: false, strict: false })
        : esc(p)
    )
    .join('');
}
