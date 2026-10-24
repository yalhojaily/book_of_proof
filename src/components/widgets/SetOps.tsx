import { useState } from 'react';
import { Shell, Tex, fmtSet } from './Shell';
import { Venn, LAYOUT2, SLOTS2 } from './venn';

type OpKey = 'union' | 'inter' | 'aminusb' | 'bminusa' | 'compA' | 'compB' | 'compUnion' | 'symdiff';

const OPS: Record<OpKey, { tex: string; ar: string; f: (a: boolean, b: boolean) => boolean; say: string }> = {
  union: { tex: 'A \\cup B', ar: 'الاتحاد', f: (a, b) => a || b, say: 'كل عنصر في A أو في B (أو في كليهما).' },
  inter: { tex: 'A \\cap B', ar: 'التقاطع', f: (a, b) => a && b, say: 'العناصر المشتركة فقط: في A وفي B معاً.' },
  aminusb: { tex: 'A - B', ar: 'الفرق', f: (a, b) => a && !b, say: 'عناصر A بعد حذف كل ما ينتمي إلى B.' },
  bminusa: { tex: 'B - A', ar: 'الفرق', f: (a, b) => b && !a, say: 'عناصر B بعد حذف كل ما ينتمي إلى A. لاحظ أن B − A ≠ A − B عادةً.' },
  compA: { tex: '\\overline{A}', ar: 'متممة A', f: (a) => !a, say: 'كل عنصر في المجموعة الشاملة U ليس في A.' },
  compB: { tex: '\\overline{B}', ar: 'متممة B', f: (_a, b) => !b, say: 'كل عنصر في U ليس في B.' },
  compUnion: { tex: '\\overline{A \\cup B}', ar: 'متممة الاتحاد', f: (a, b) => !(a || b), say: 'ما ليس في A ولا في B. قارنها بـ Ā ∩ B̄.' },
  symdiff: { tex: '(A - B) \\cup (B - A)', ar: 'الفرق التماثلي', f: (a, b) => a !== b, say: 'ما ينتمي إلى إحدى المجموعتين دون الأخرى.' },
};

export default function SetOps({
  ops = ['union', 'inter', 'aminusb', 'bminusa'],
  universe = 10,
  initialA = [1, 2, 3, 4, 5],
  initialB = [4, 5, 6, 7],
  title = 'ملعب العمليات على المجموعات',
}: {
  ops?: OpKey[];
  universe?: number;
  initialA?: number[];
  initialB?: number[];
  title?: string;
}) {
  const U = Array.from({ length: universe }, (_, i) => i + 1);
  const [A, setA] = useState<Set<number>>(new Set(initialA));
  const [B, setB] = useState<Set<number>>(new Set(initialB));
  const [op, setOp] = useState<OpKey>(ops[0]);
  const cur = OPS[op];

  const toggle = (which: 'A' | 'B', x: number) => {
    const [s, set] = which === 'A' ? [A, setA] : [B, setB];
    const n = new Set(s);
    n.has(x) ? n.delete(x) : n.add(x);
    set(n);
  };

  const result = U.filter((x) => cur.f(A.has(x), B.has(x)));
  const sorted = (s: Set<number>) => [...s].sort((p, q) => p - q);

  // place each element in a slot of its atom
  const used: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const dots = U.map((x) => {
    const atom = (A.has(x) ? 1 : 0) | (B.has(x) ? 2 : 0);
    const slot = SLOTS2[atom][used[atom]++ % SLOTS2[atom].length];
    return { x, atom, pos: slot };
  });

  return (
    <Shell
      title={title}
      foot={<>اضغط الأعداد لتضيفها إلى <b style={{ color: 'var(--set-a)' }}>A</b> أو <b style={{ color: 'var(--set-b)' }}>B</b> أو تحذفها، ثم اختر العملية. المنطقة الصفراء هي الناتج.</>}
    >
      <div className="controls" role="group" aria-label="العملية">
        {ops.map((k) => (
          <button key={k} className="btn" aria-pressed={k === op} onClick={() => setOp(k)}>
            <Tex>{OPS[k].tex}</Tex>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
        {(['A', 'B'] as const).map((w) => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <b style={{ width: 22, color: w === 'A' ? 'var(--set-a)' : 'var(--set-b)', fontFamily: 'KaTeX_Math, serif', fontSize: 19 }}>{w}</b>
            <div className="ltr" style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {U.map((x) => {
                const on = (w === 'A' ? A : B).has(x);
                return (
                  <button key={x} className={`chip ${on ? (w === 'A' ? 'in-a' : 'in-b') : ''}`} aria-pressed={on} onClick={() => toggle(w, x)}>
                    {x}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Venn layout={LAYOUT2} shaded={(a) => cur.f(!!(a & 1), !!(a & 2))} ariaLabel={`مخطط فن يظلل ${cur.ar}`}>
        {dots.map(({ x, pos, atom }) => {
          const hit = cur.f(!!(atom & 1), !!(atom & 2));
          return (
            <g key={x}>
              <circle cx={pos[0]} cy={pos[1]} r={11} fill={hit ? 'var(--shade)' : 'var(--bg-elev)'} stroke="var(--ink-3)" strokeWidth={1} />
              <text x={pos[0]} y={pos[1] + 4.5} fontSize={12.5} fontWeight={700} textAnchor="middle" fill={hit ? '#1d1f24' : 'var(--ink)'}>
                {x}
              </text>
            </g>
          );
        })}
      </Venn>

      <div style={{ marginTop: 12 }}>
        <div className="result-row">
          <Tex>{`U = ${fmtSet(U)}`}</Tex>
        </div>
        <div className="result-row">
          <Tex>{`A = ${fmtSet(sorted(A))}`}</Tex>
          <span className="muted">·</span>
          <Tex>{`B = ${fmtSet(sorted(B))}`}</Tex>
        </div>
        <div className="result-row" style={{ fontSize: '1.08em' }}>
          <b>{cur.ar}:</b>
          <Tex>{`${cur.tex} = ${fmtSet(result)}`}</Tex>
          <span className="muted"><Tex>{`\\left|${cur.tex}\\right| = ${result.length}`}</Tex></span>
        </div>
        <p className="muted" style={{ margin: '6px 0 0' }}>{cur.say}</p>
      </div>
    </Shell>
  );
}
