import { useState, type ReactNode } from 'react';
import { Shell, Tex } from './Shell';

type Pair = [number, number];
const key = ([a, b]: Pair) => `${a},${b}`;

const PRESETS: { name: string; tex: string; rel: (a: number, b: number) => boolean }[] = [
  { name: '=', tex: '=', rel: (a, b) => a === b },
  { name: '<', tex: '<', rel: (a, b) => a < b },
  { name: '≤', tex: '\\le', rel: (a, b) => a <= b },
  { name: '|', tex: '\\mid', rel: (a, b) => b % a === 0 },
  { name: '≡ (mod 2)', tex: '\\equiv \\pmod 2', rel: (a, b) => (a - b) % 2 === 0 },
  { name: '≠', tex: '\\neq', rel: (a, b) => a !== b },
  { name: '∅', tex: '\\varnothing', rel: () => false },
];

/** Click cells of A × A to build a relation; see its diagram and test reflexive, symmetric, transitive. */
export default function RelationLab({ size = 5, initial = 4 }: { size?: number; initial?: number }) {
  const A = Array.from({ length: size }, (_, i) => i + 1);
  const fromPreset = (i: number) => {
    const s = new Set<string>();
    A.forEach((a) => A.forEach((b) => PRESETS[i].rel(a, b) && s.add(key([a, b]))));
    return s;
  };
  const [R, setR] = useState<Set<string>>(() => fromPreset(initial));
  const [pi, setPi] = useState<number | null>(initial);
  const has = (a: number, b: number) => R.has(key([a, b]));
  const toggle = (a: number, b: number) => {
    const s = new Set(R);
    s.has(key([a, b])) ? s.delete(key([a, b])) : s.add(key([a, b]));
    setR(s);
    setPi(null);
  };

  const notRefl = A.filter((a) => !has(a, a));
  const notSym: Pair[] = [];
  A.forEach((a) => A.forEach((b) => has(a, b) && !has(b, a) && notSym.push([a, b])));
  let notTrans: [number, number, number] | null = null;
  outer: for (const a of A) for (const b of A) for (const c of A) if (has(a, b) && has(b, c) && !has(a, c)) { notTrans = [a, b, c]; break outer; }
  const equiv = !notRefl.length && !notSym.length && !notTrans;
  const classes: number[][] = [];
  if (equiv) A.forEach((a) => { if (!classes.some((c) => c.includes(a))) classes.push(A.filter((b) => has(a, b))); });

  // diagram
  const R0 = 92, cx = 120, cy = 112;
  const P = (i: number) => [cx + R0 * Math.cos((2 * Math.PI * i) / size - Math.PI / 2), cy + R0 * Math.sin((2 * Math.PI * i) / size - Math.PI / 2)];
  const pairs = [...R].map((s) => s.split(',').map(Number) as Pair);

  const verdict = (ok: boolean, label: string, why: ReactNode) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', padding: '5px 10px', borderRadius: 8, background: ok ? 'var(--green-soft)' : 'var(--red-soft)' }}>
      <b style={{ color: ok ? 'var(--green)' : 'var(--red)', minWidth: 70 }}>{ok ? '✓' : '✗'} {label}</b>
      <span style={{ fontSize: 14 }}>{why}</span>
    </div>
  );

  return (
    <Shell title="مختبر العلاقات" foot="العلاقة على A مجموعة جزئية من A × A. اضغط أي خانة في الجدول لتضيف الزوج أو تحذفه. السهم من x إلى y يعني xRy، والحلقة عند x تعني xRx.">
      <div className="controls">
        {PRESETS.map((p, i) => (
          <button key={p.name} className="chip ltr" aria-pressed={pi === i} onClick={() => { setR(fromPreset(i)); setPi(i); }}>{p.name}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <table className="ltr" style={{ borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ padding: 4, color: 'var(--ink-3)', fontSize: 11 }}>x \ y</th>
              {A.map((b) => <th key={b} style={{ padding: 4 }}>{b}</th>)}
            </tr>
          </thead>
          <tbody>
            {A.map((a) => (
              <tr key={a}>
                <th style={{ padding: 4 }}>{a}</th>
                {A.map((b) => (
                  <td key={b} style={{ padding: 2 }}>
                    <button onClick={() => toggle(a, b)} aria-label={`(${a}, ${b})`} aria-pressed={has(a, b)} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid var(--line-strong)', background: has(a, b) ? 'var(--violet)' : 'var(--bg-elev)', color: '#fff', cursor: 'pointer', fontSize: 12 }}>{has(a, b) ? '●' : ''}</button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <svg viewBox="0 0 240 224" style={{ width: '100%', maxWidth: 250, direction: 'ltr' }} role="img" aria-label="مخطط العلاقة">
          <defs>
            <marker id="rl-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--violet)" /></marker>
          </defs>
          {pairs.map(([a, b]) => {
            const [x1, y1] = P(a - 1), [x2, y2] = P(b - 1);
            if (a === b) {
              const dx = (x1 - cx) / R0, dy = (y1 - cy) / R0;
              return <circle key={`${a}-${b}`} cx={x1 + dx * 22} cy={y1 + dy * 22} r={10} fill="none" stroke="var(--violet)" strokeWidth={1.8} />;
            }
            const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
            const off = has(b, a) ? 5 : 0, nx = -uy * off, ny = ux * off;
            return <line key={`${a}-${b}`} x1={x1 + ux * 15 + nx} y1={y1 + uy * 15 + ny} x2={x2 - ux * 16 + nx} y2={y2 - uy * 16 + ny} stroke="var(--violet)" strokeWidth={1.8} markerEnd="url(#rl-head)" />;
          })}
          {A.map((a) => {
            const [x, y] = P(a - 1);
            return (
              <g key={a}>
                <circle cx={x} cy={y} r={13} fill="var(--bg-elev)" stroke="var(--ink)" strokeWidth={1.4} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--ink)">{a}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="ltr" style={{ fontSize: 13, margin: '8px 0', overflowWrap: 'anywhere', textAlign: 'center' }}>
        <Tex>{`R = \\{${pairs.sort((p, q) => p[0] - q[0] || p[1] - q[1]).map(([a, b]) => `(${a},${b})`).join(', ')}\\}`}</Tex>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {verdict(!notRefl.length, 'انعكاسية', notRefl.length ? <>ينقص <Tex>{`(${notRefl[0]},${notRefl[0]})`}</Tex></> : <>كل <Tex>{'(x,x)'}</Tex> موجود</>)}
        {verdict(!notSym.length, 'تماثلية', notSym.length ? <><Tex>{`(${notSym[0][0]},${notSym[0][1]}) \\in R`}</Tex> لكن <Tex>{`(${notSym[0][1]},${notSym[0][0]}) \\notin R`}</Tex></> : 'كل سهم له سهم معاكس')}
        {verdict(!notTrans, 'متعدية', notTrans ? <><Tex>{`${notTrans[0]}R${notTrans[1]}`}</Tex> و<Tex>{`${notTrans[1]}R${notTrans[2]}`}</Tex> لكن ليس <Tex>{`${notTrans[0]}R${notTrans[2]}`}</Tex></> : 'كل مسار من سهمين له اختصار')}
      </div>
      {equiv && (
        <p style={{ margin: '10px 0 0' }}>
          <b style={{ color: 'var(--green)' }}>علاقة تكافؤ.</b> فصول التكافؤ:{' '}
          <span className="ltr" style={{ display: 'inline-block' }}><Tex>{classes.map((c) => `\\{${c.join(',')}\\}`).join(',\\ ')}</Tex></span>
        </p>
      )}
    </Shell>
  );
}
