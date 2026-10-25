// Turn plain-text cross-references in lessons into links:
//   «القسم 2.10» → link to that section page,  «الفصل 6» → link to that chapter page.
// References to the page's own section or chapter are left as text. Math, code and existing links are skipped.

const BASE = '/book_of_proof';
const SLUGS = {
  1: 'sets', 2: 'logic', 3: 'counting', 4: 'direct-proof', 5: 'contrapositive-proof',
  6: 'proof-by-contradiction', 7: 'non-conditional', 8: 'proofs-involving-sets', 9: 'disproof',
  10: 'induction', 11: 'relations', 12: 'functions', 13: 'calculus', 14: 'cardinality',
};
const SECTIONS = { 1: 10, 2: 12, 3: 10, 4: 5, 5: 3, 6: 4, 7: 4, 8: 4, 9: 3, 10: 5, 11: 6, 12: 6, 13: 8, 14: 4 };

// «القسم 2.10» / «القسمين 3.4» … ; «الفصل 6» / «الفصل الـ6» (not followed by another digit or a dot-number)
const RE = /(القسم|القسمين|الأقسام)\s+(\d{1,2})\.(\d{1,2})(?!\d|\.\d)|(الفصل|الفصلين)\s+(\d{1,2})(?!\d|\.\d)/g;
const SKIP = new Set(['link', 'linkReference', 'inlineMath', 'math', 'inlineCode', 'code', 'heading', 'yaml', 'mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression']);

export default function remarkXref() {
  return (tree, file) => {
    const path = String(file.path || file.history?.[0] || '');
    const m = path.match(/lessons\/\d+-[^/]+\/(\d+)-(\d+|x)\.mdx?$/);
    if (!m) return;
    const curChap = +m[1];
    const curSec = m[2];

    const walk = (node) => {
      if (!node.children) return;
      const out = [];
      for (const child of node.children) {
        if (SKIP.has(child.type)) { out.push(child); continue; }
        if (child.type === 'text' && node.type === 'tableCell' && /^\s*\d{1,2}\.\d{1,2}(\s*،\s*\d{1,2}\.\d{1,2})*\s*$/.test(child.value)) {
          // a "section" column in an exercise map: "4.2، 4.3"
          out.push(...split(child.value.replace(/(\d{1,2}\.\d{1,2})/g, 'القسم $1')).map((n) => (n.type === 'link' ? { ...n, children: [{ type: 'text', value: n.children[0].value.replace('القسم ', '') }] } : { ...n, value: n.value.replace(/القسم /g, '') })));
          continue;
        }
        if (child.type === 'text') { out.push(...split(child.value)); continue; }
        walk(child);
        out.push(child);
      }
      node.children = out;
    };

    const split = (value) => {
      const parts = [];
      let last = 0;
      for (const hit of value.matchAll(RE)) {
        let url = null;
        if (hit[1]) {
          const c = +hit[2], s = +hit[3];
          if (SLUGS[c] && s >= 1 && s <= SECTIONS[c] && !(c === curChap && String(s) === curSec)) url = `${BASE}/chapters/${SLUGS[c]}/${c}-${s}/`;
        } else {
          const c = +hit[5];
          if (SLUGS[c] && c !== curChap) url = `${BASE}/chapters/${SLUGS[c]}/`;
        }
        if (!url) continue;
        if (hit.index > last) parts.push({ type: 'text', value: value.slice(last, hit.index) });
        parts.push({ type: 'link', url, data: { hProperties: { className: ['xref'] } }, children: [{ type: 'text', value: hit[0] }] });
        last = hit.index + hit[0].length;
      }
      if (!parts.length) return [{ type: 'text', value }];
      if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
      return parts;
    };

    walk(tree);
  };
}
