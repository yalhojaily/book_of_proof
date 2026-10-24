// Propositional logic: parse, evaluate, render as TeX, list sub-expressions.
// Notation follows Book of Proof: ∼ (not), ∧, ∨, ⇒, ⇔.
// Precedence (high → low): ∼, ∧, ∨, ⇒ (right-assoc), ⇔.

export type LNode =
  | { t: 'var'; name: string }
  | { t: 'const'; v: boolean }
  | { t: 'not'; x: LNode }
  | { t: 'bin'; op: '∧' | '∨' | '⇒' | '⇔'; l: LNode; r: LNode };

export function normalizeLogic(src: string): string {
  return src
    .replace(/<=>|<->|⟺|↔|\biff\b/g, '⇔')
    .replace(/=>|->|⟹|→|\bimplies\b/g, '⇒')
    .replace(/&&|&|\band\b|\^/g, '∧')
    .replace(/\|\||\||\bor\b/g, '∨')
    .replace(/[~!¬]|\bnot\b/g, '∼')
    .replace(/\s+/g, '')
    .replace(/[pqrs]/g, (c) => c.toUpperCase());
}

export function parseLogic(src: string): LNode {
  const s = normalizeLogic(src);
  let i = 0;
  const fail = (m: string): never => {
    throw new Error(m);
  };
  const peek = () => s[i];

  function atom(): LNode {
    const c = peek();
    if (c === '∼') {
      i++;
      return { t: 'not', x: atom() };
    }
    if (c === '(') {
      i++;
      const e = iff();
      if (peek() !== ')') fail('قوس غير مغلق');
      i++;
      return e;
    }
    if (c && /[A-Z]/.test(c)) {
      i++;
      if (c === 'T') return { t: 'const', v: true };
      if (c === 'F') return { t: 'const', v: false };
      return { t: 'var', name: c };
    }
    return fail(c ? `رمز غير متوقع: ${c}` : 'التعبير ناقص');
  }
  function and(): LNode {
    let n = atom();
    while (peek() === '∧') {
      i++;
      n = { t: 'bin', op: '∧', l: n, r: atom() };
    }
    return n;
  }
  function or(): LNode {
    let n = and();
    while (peek() === '∨') {
      i++;
      n = { t: 'bin', op: '∨', l: n, r: and() };
    }
    return n;
  }
  function imp(): LNode {
    const l = or();
    if (peek() === '⇒') {
      i++;
      return { t: 'bin', op: '⇒', l, r: imp() };
    }
    return l;
  }
  function iff(): LNode {
    let n = imp();
    while (peek() === '⇔') {
      i++;
      n = { t: 'bin', op: '⇔', l: n, r: imp() };
    }
    return n;
  }
  if (!s) fail('اكتب عبارة');
  const tree = iff();
  if (i < s.length) fail(`رمز غير متوقع: ${s[i]}`);
  return tree;
}

export type Env = Record<string, boolean>;

export function evalLogic(n: LNode, env: Env): boolean {
  switch (n.t) {
    case 'var':
      return !!env[n.name];
    case 'const':
      return n.v;
    case 'not':
      return !evalLogic(n.x, env);
    case 'bin': {
      const a = evalLogic(n.l, env);
      const b = evalLogic(n.r, env);
      switch (n.op) {
        case '∧':
          return a && b;
        case '∨':
          return a || b;
        case '⇒':
          return !a || b;
        case '⇔':
          return a === b;
      }
    }
  }
}

export function varsOf(...nodes: LNode[]): string[] {
  const set = new Set<string>();
  const walk = (n: LNode) => {
    if (n.t === 'var') set.add(n.name);
    else if (n.t === 'not') walk(n.x);
    else if (n.t === 'bin') {
      walk(n.l);
      walk(n.r);
    }
  };
  nodes.forEach(walk);
  return [...set].sort((a, b) => 'PQRS'.indexOf(a) - 'PQRS'.indexOf(b) || a.localeCompare(b));
}

const TEX = { '∧': '\\wedge', '∨': '\\vee', '⇒': '\\Rightarrow', '⇔': '\\Leftrightarrow' } as const;

/** TeX with full parentheses around every binary sub-expression (except the outermost). */
export function logicTex(n: LNode, top = true): string {
  switch (n.t) {
    case 'var':
      return n.name;
    case 'const':
      return n.v ? '\\text{T}' : '\\text{F}';
    case 'not':
      return `{\\sim} ${logicTex(n.x, false)}`;
    case 'bin': {
      const inner = `${logicTex(n.l, false)} ${TEX[n.op]} ${logicTex(n.r, false)}`;
      return top ? inner : `(${inner})`;
    }
  }
}

/** All distinct compound sub-expressions, innermost first (helper columns). */
export function subExpressions(n: LNode): LNode[] {
  const out: LNode[] = [];
  const seen = new Set<string>();
  const walk = (m: LNode) => {
    if (m.t === 'not') walk(m.x);
    if (m.t === 'bin') {
      walk(m.l);
      walk(m.r);
    }
    if (m.t === 'not' || m.t === 'bin') {
      const k = logicTex(m);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(m);
      }
    }
  };
  walk(n);
  return out;
}

/** Rows in the book's order: first variable changes slowest, T before F. */
export function rowsFor(vars: string[]): Env[] {
  const n = vars.length;
  return Array.from({ length: 1 << n }, (_, r) => {
    const env: Env = {};
    vars.forEach((v, k) => {
      env[v] = ((r >> (n - 1 - k)) & 1) === 0;
    });
    return env;
  });
}

export const TF = (b: boolean) => (b ? 'T' : 'F');
