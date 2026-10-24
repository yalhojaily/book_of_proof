import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { choose, fmt } from '@/lib/comb';

/** Pascal's triangle: hover an entry to see the two entries that add up to it, and the binomial expansion of its row. */
export default function Pascal({ rows = 10 }: { rows?: number }) {
  const [sel, setSel] = useState<[number, number]>([5, 2]);
  const [mod2, setMod2] = useState(false);
  const [n, k] = sel;
  const W = 640;
  const rowH = 34;
  const cellW = Math.min(52, (W - 20) / (rows + 1));
  const H = rowH * (rows + 1) + 10;
  const pos = (r: number, c: number) => [W / 2 + (c - r / 2) * cellW, 22 + r * rowH] as const;
  const isParent = (r: number, c: number) => r === n - 1 && (c === k - 1 || c === k);

  const terms = Array.from({ length: n + 1 }, (_, j) => {
    const co = choose(n, j);
    const xp = n - j;
    const x = xp === 0 ? '' : xp === 1 ? 'x' : `x^{${xp}}`;
    const y = j === 0 ? '' : j === 1 ? 'y' : `y^{${j}}`;
    const c = co === 1n && (x || y) ? '' : fmt(co);
    return `${c}${x}${y}`;
  });

  return (
    <Shell title="مثلث باسكال" foot="مرّر المؤشر على أي عدد: يضيء العددان فوقه اللذان مجموعهما يساويه. وأعداد الصف n هي معاملات مفكوك ذات الحدين للأس n.">
      <div className="controls">
        <button className="btn" aria-pressed={!mod2} onClick={() => setMod2(false)}>الأعداد</button>
        <button className="btn" aria-pressed={mod2} onClick={() => setMod2(true)}>لوّن الأعداد الفردية</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', direction: 'ltr' }} role="img" aria-label="مثلث باسكال">
        {Array.from({ length: rows + 1 }, (_, r) =>
          Array.from({ length: r + 1 }, (_, c) => {
            const [x, y] = pos(r, c);
            const v = choose(r, c);
            const here = r === n && c === k;
            const par = isParent(r, c);
            const odd = v % 2n === 1n;
            const fill = here ? 'var(--shade)' : par ? 'var(--set-a-fill)' : mod2 && odd ? 'var(--violet-soft)' : 'var(--bg-elev)';
            const label = fmt(v);
            return (
              <g key={`${r}-${c}`} onMouseEnter={() => setSel([r, c])} onClick={() => setSel([r, c])} style={{ cursor: 'pointer' }}>
                <rect x={x - cellW / 2 + 2} y={y - 13} width={cellW - 4} height={26} rx={8} fill={fill} stroke={here ? 'var(--amber)' : par ? 'var(--set-a)' : mod2 && odd ? 'var(--violet)' : 'var(--line)'} strokeWidth={here || par ? 2 : 1} />
                <text x={x} y={y + 4.5} fontSize={label.length > 3 ? 10 : 12.5} textAnchor="middle" fill={here ? '#1d1f24' : 'var(--ink)'} fontWeight={here || par ? 700 : 500}>{label}</text>
              </g>
            );
          })
        )}
        {n > 0 && k > 0 && k < n && (() => {
          const [x, y] = pos(n, k);
          const [x1, y1] = pos(n - 1, k - 1);
          const [x2, y2] = pos(n - 1, k);
          return (
            <g stroke="var(--set-a)" strokeWidth={1.8} fill="none" opacity={0.8}>
              <line x1={x1} y1={y1 + 13} x2={x} y2={y - 13} />
              <line x1={x2} y1={y2 + 13} x2={x} y2={y - 13} />
            </g>
          );
        })()}
      </svg>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        <Tex>{`\\binom{${n}}{${k}} = ${fmt(choose(n, k))}${n > 0 && k > 0 && k < n ? ` = \\binom{${n - 1}}{${k - 1}} + \\binom{${n - 1}}{${k}} = ${fmt(choose(n - 1, k - 1))} + ${fmt(choose(n - 1, k))}` : ''}`}</Tex>
      </div>
      <div className="result-row" style={{ justifyContent: 'center', overflowX: 'auto' }}>
        <Tex>{`(x+y)^{${n}} = ${terms.join(' + ')}`}</Tex>
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '4px 0 0' }}>
        مجموع الصف <Tex>{`${n}`}</Tex> يساوي <Tex>{`2^{${n}} = ${fmt(2n ** BigInt(n))}`}</Tex>: عدد كل المجموعات الجزئية لمجموعة من <Tex>{`${n}`}</Tex> عناصر.
      </p>
    </Shell>
  );
}
