import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Preset = {
  label: string;
  tex: string;
  f: (n: number) => number;
  claim: string;
  check: (v: number) => boolean;
  even: string[]; // TeX steps when n = 2k
  odd: string[]; // TeX steps when n = 2k + 1
};

const PRESETS: Preset[] = [
  {
    label: '1 + (−1)ⁿ(2n − 1)',
    tex: '1 + (-1)^n (2n - 1)',
    f: (n) => 1 + (n % 2 === 0 ? 1 : -1) * (2 * n - 1),
    claim: 'multiple of 4',
    check: (v) => v % 4 === 0,
    even: ['(-1)^{2k} = 1', '1 + (2 \\cdot 2k - 1) = 4k'],
    odd: ['(-1)^{2k+1} = -1', '1 - (2(2k+1) - 1) = -4k'],
  },
  {
    label: 'n² + n',
    tex: 'n^2 + n',
    f: (n) => n * n + n,
    claim: 'even',
    check: (v) => v % 2 === 0,
    even: ['(2k)^2 + 2k = 4k^2 + 2k', '= 2(2k^2 + k)'],
    odd: ['(2k+1)^2 + (2k+1) = 4k^2 + 6k + 2', '= 2(2k^2 + 3k + 1)'],
  },
  {
    label: 'n² − 1 (n فردي)',
    tex: 'n^2 - 1',
    f: (n) => n * n - 1,
    claim: 'multiple of 8 when n is odd',
    check: (v) => v % 8 === 0,
    even: ['\\text{not claimed for even } n'],
    odd: ['(2k+1)^2 - 1 = 4k^2 + 4k = 4k(k+1)', 'k(k+1) \\text{ is even, so } 4k(k+1) = 8m'],
  },
  {
    label: 'n³ − n',
    tex: 'n^3 - n',
    f: (n) => n * n * n - n,
    claim: 'even',
    check: (v) => v % 2 === 0,
    even: ['(2k)^3 - 2k = 2(4k^3 - k)'],
    odd: ['(2k+1)^3 - (2k+1) = 8k^3 + 12k^2 + 4k', '= 2(4k^3 + 6k^2 + 2k)'],
  },
];

/** Split a claim about every integer n into the cases n even / n odd. */
export default function CasesExplorer() {
  const [pi, setPi] = useState(0);
  const p = PRESETS[pi];
  const ns = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <Shell title="البرهان بالحالات: زوجي أم فردي؟" foot="الجدول يقنعك بالنمط لكنه لا يبرهنه، فهو يفحص أعداداً قليلة فقط. البرهان يعالج كل عدد زوجي دفعة واحدة بكتابته 2k، وكل عدد فردي بكتابته 2k + 1.">
      <div className="controls">
        {PRESETS.map((q, i) => (
          <button key={i} className="btn" aria-pressed={i === pi} onClick={() => setPi(i)}>
            <span className="ltr">{q.label}</span>
          </button>
        ))}
      </div>
      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 14 }}>
          <tbody>
            <tr>
              <th style={{ padding: '4px 8px', textAlign: 'left' }}><Tex>n</Tex></th>
              {ns.map((n) => <td key={n} style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 700, color: n % 2 ? 'var(--set-b)' : 'var(--set-a)' }}>{n}</td>)}
            </tr>
            <tr>
              <th style={{ padding: '4px 8px', textAlign: 'left' }}><Tex>{p.tex}</Tex></th>
              {ns.map((n) => {
                const v = p.f(n);
                const relevant = !(pi === 2 && n % 2 === 0);
                return <td key={n} style={{ padding: '4px 8px', textAlign: 'center', borderRadius: 6, background: relevant ? (p.check(v) ? 'var(--green-soft)' : 'var(--red-soft)') : undefined, opacity: relevant ? 1 : 0.4 }}>{v}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginTop: 12 }}>
        {([['الحالة 1: n زوجي، n = 2k', p.even, 'var(--set-a)'], ['الحالة 2: n فردي، n = 2k + 1', p.odd, 'var(--set-b)']] as const).map(([t, steps, c]) => (
          <div key={t} style={{ border: `2px solid ${c}`, borderRadius: 12, padding: 10 }}>
            <b style={{ color: c, fontSize: 14.5 }}>{t}</b>
            <div className="ltr" style={{ display: 'grid', gap: 4, marginTop: 6 }}>
              {steps.map((s, i) => <Tex key={i}>{s}</Tex>)}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
