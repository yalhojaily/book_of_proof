import { useState } from 'react';
import { Shell, Tex } from './Shell';

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Z_n: arithmetic on classes. Tables, zero divisors, and why the operations are well-defined. */
export default function ZnLab() {
  const [n, setN] = useState(6);
  const [op, setOp] = useState<'+' | '·'>('·');
  const [a, setA] = useState(2), [a2, setA2] = useState(8);
  const [b, setB] = useState(3), [b2, setB2] = useState(-3);
  const f = (x: number, y: number) => mod(op === '+' ? x + y : x * y, n);
  const zeroDiv = op === '·' ? Array.from({ length: n }, (_, i) => i).filter((i) => i > 0 && Array.from({ length: n }, (_, j) => j).some((j) => j > 0 && (i * j) % n === 0)) : [];
  const num = (v: number, set: (x: number) => void, label: string) => (
    <label className="ltr" style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <Tex>{label}</Tex>
      <input type="number" value={v} onChange={(e) => set(Math.trunc(+e.target.value || 0))} style={{ width: 58, font: 'inherit', padding: '2px 6px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
    </label>
  );
  const okA = mod(a, n) === mod(a2, n), okB = mod(b, n) === mod(b2, n);
  return (
    <Shell title="الحساب في Zₙ" foot="عناصر Zₙ فصول تكافؤ، لا أعداد. نجمع ونضرب الفصول بممثلين: ⁦[a] + [b] = [a + b]⁩. السؤال المهم: هل يتغير الجواب إذا اخترنا ممثلين آخرين للفصلين؟ الجزء السفلي يجيب: لا.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={2} max={12} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
        <button className="btn" aria-pressed={op === '+'} onClick={() => setOp('+')}>الجمع</button>
        <button className="btn" aria-pressed={op === '·'} onClick={() => setOp('·')}>الضرب</button>
      </div>
      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ padding: '3px 6px', color: 'var(--ink-3)' }}>{op}</th>
              {Array.from({ length: n }, (_, j) => <th key={j} style={{ padding: '3px 6px' }}>[{j}]</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: n }, (_, i) => (
              <tr key={i}>
                <th style={{ padding: '3px 6px' }}>[{i}]</th>
                {Array.from({ length: n }, (_, j) => {
                  const v = f(i, j);
                  const zd = op === '·' && v === 0 && i > 0 && j > 0;
                  return <td key={j} style={{ padding: '3px 6px', textAlign: 'center', border: '1px solid var(--line)', background: zd ? 'var(--red-soft)' : v === 0 ? 'var(--bg-sunk)' : undefined, fontWeight: zd ? 700 : 400 }}>[{v}]</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {op === '·' && (
        <p style={{ margin: '8px 0 0', fontSize: 14 }}>
          {zeroDiv.length ? <>الخانات الحمراء: حاصل ضرب فصلين غير صفريين يساوي <Tex>[0]</Tex>، مثل <Tex>{`[${zeroDiv[0]}]\\cdot[${n / gcdN(zeroDiv[0], n)}] = [0]`}</Tex>. يحدث هذا لأن {n} ليس أولياً.</> : <>لا توجد خانات حمراء: {n} أولي، فإذا كان <Tex>{'[a][b] = [0]'}</Tex> فأحدهما <Tex>[0]</Tex>.</>}
        </p>
      )}
      <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '12px 0' }} />
      <p style={{ margin: '0 0 6px' }}>اختر ممثلين مختلفين للفصل نفسه:</p>
      <div className="controls" style={{ gap: 12 }}>
        {num(a, setA, 'a =')}{num(a2, setA2, "a' =")}
        {num(b, setB, 'b =')}{num(b2, setB2, "b' =")}
      </div>
      <div className="result-row"><Tex>{`[${a}] ${okA ? '=' : '\\neq'} [${a2}],\\quad [${b}] ${okB ? '=' : '\\neq'} [${b2}] \\ \\text{in } \\mathbb{Z}_{${n}}`}</Tex></div>
      <div className="result-row"><Tex>{`[${a} ${op === '+' ? '+' : '\\cdot'} ${b < 0 ? `(${b})` : b}] = [${mod(op === '+' ? a + b : a * b, n)}],\\qquad [${a2} ${op === '+' ? '+' : '\\cdot'} ${b2 < 0 ? `(${b2})` : b2}] = [${mod(op === '+' ? a2 + b2 : a2 * b2, n)}]`}</Tex></div>
      <p style={{ margin: '6px 0 0', fontWeight: 600, color: okA && okB ? 'var(--green)' : 'var(--ink-3)' }}>
        {okA && okB ? 'ممثلان مختلفان للفصلين، والجواب نفسه: العملية معرّفة جيداً.' : 'اجعل a وa′ من الفصل نفسه، وb وb′ من الفصل نفسه، لترى أن الجوابين يتطابقان.'}
      </p>
    </Shell>
  );
}

function gcdN(a: number, b: number): number { return b === 0 ? a : gcdN(b, a % b); }
