// Tiny parser/evaluator for set expressions over A, B, C and the universe U.
// Precedence: complement (postfix ')  >  ∩  >  ∪ and − (left-associative).

export type Node =
  | { t: 'set'; name: 'A' | 'B' | 'C' | 'U' | '∅' }
  | { t: 'comp'; x: Node }
  | { t: 'bin'; op: '∪' | '∩' | '−'; l: Node; r: Node };

export function normalize(src: string): string {
  return src
    .replace(/\s+/g, '')
    .replace(/[|+]/g, '∪')
    .replace(/u/g, '∪')
    .replace(/[&n^]/g, '∩')
    .replace(/[-\\–]/g, '−')
    .replace(/[ᶜ’`′]/g, "'")
    .replace(/[a-c]/g, (c) => c.toUpperCase())
    .replace(/Ø|ø|∅|\{\}/g, '∅');
}

export function parse(src: string): Node {
  const s = normalize(src);
  let i = 0;
  const peek = () => s[i];
  const fail = (msg: string): never => {
    throw new Error(msg);
  };

  function primary(): Node {
    const c = peek();
    if (c === '(') {
      i++;
      const e = expr();
      if (peek() !== ')') fail('قوس غير مغلق');
      i++;
      return e;
    }
    if (c === 'A' || c === 'B' || c === 'C' || c === 'U' || c === '∅') {
      i++;
      return { t: 'set', name: c };
    }
    return fail(c ? `رمز غير متوقع: ${c}` : 'التعبير ناقص');
  }
  function factor(): Node {
    let n = primary();
    while (peek() === "'") {
      i++;
      n = { t: 'comp', x: n };
    }
    return n;
  }
  function term(): Node {
    let n = factor();
    while (peek() === '∩') {
      i++;
      n = { t: 'bin', op: '∩', l: n, r: factor() };
    }
    return n;
  }
  function expr(): Node {
    let n = term();
    while (peek() === '∪' || peek() === '−') {
      const op = s[i++] as '∪' | '−';
      n = { t: 'bin', op, l: n, r: term() };
    }
    return n;
  }
  if (!s) fail('اكتب تعبيراً');
  const tree = expr();
  if (i < s.length) fail(`رمز غير متوقع: ${s[i]}`);
  return tree;
}

/** Evaluate on an atom (bit0 = A, bit1 = B, bit2 = C). */
export function evalAtom(n: Node, atom: number): boolean {
  switch (n.t) {
    case 'set':
      return n.name === 'U' ? true : n.name === '∅' ? false : !!(atom & (1 << 'ABC'.indexOf(n.name)));
    case 'comp':
      return !evalAtom(n.x, atom);
    case 'bin': {
      const l = evalAtom(n.l, atom);
      const r = evalAtom(n.r, atom);
      return n.op === '∪' ? l || r : n.op === '∩' ? l && r : l && !r;
    }
  }
}

const TEXOP = { '∪': '\\cup', '∩': '\\cap', '−': '-' } as const;

export function toTex(n: Node, parentOp?: string): string {
  switch (n.t) {
    case 'set':
      return n.name === '∅' ? '\\varnothing' : n.name;
    case 'comp':
      return `\\overline{${toTex(n.x)}}`;
    case 'bin': {
      const inner = `${toTex(n.l, n.op)} ${TEXOP[n.op]} ${toTex(n.r, n.op)}`;
      return parentOp ? `(${inner})` : inner;
    }
  }
}

export function atomsOf(n: Node, count: number): number[] {
  return Array.from({ length: 1 << count }, (_, a) => a).filter((a) => evalAtom(n, a));
}

export function usesC(src: string) {
  return /C/.test(normalize(src));
}

/** Arabic description of an atom, e.g. "في A وB وليس في C". */
export function describeAtom(atom: number, count: number): string {
  const names = ['A', 'B', 'C'].slice(0, count);
  const ins = names.filter((_, i) => atom & (1 << i));
  const outs = names.filter((_, i) => !(atom & (1 << i)));
  if (!ins.length) return 'خارج كل المجموعات';
  return `في ${ins.join(' و')}${outs.length ? ` وليس في ${outs.join(' ولا ')}` : ''}`;
}
