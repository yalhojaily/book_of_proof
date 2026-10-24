import { useState } from 'react';
import { Shell, Tex } from './Shell';

function egcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}

/** The set {ax + by}: its smallest positive element is gcd(a, b), and it is exactly the multiples of gcd(a, b). */
export default function BezoutLab() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(18);
  const [g, k, l] = egcd(a, b);
  const R = 30;
  const span = Array.from({ length: 2 * R + 1 }, (_, i) => i - R);
  // which values in range are ax + by for some small x, y?
  const hit = new Set<number>();
  for (let x = -40; x <= 40; x++) for (let y = -40; y <= 40; y++) { const v = a * x + b * y; if (Math.abs(v) <= R) hit.add(v); }
  const W = 620, x0 = 16, step = (W - 2 * x0) / (2 * R);
  const slider = (label: string, v: number, set: (x: number) => void) => (
    <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Tex>{`${label} = ${v}`}</Tex>
      <input type="range" min={1} max={30} value={v} onChange={(e) => set(+e.target.value)} />
    </label>
  );
  return (
    <Shell title="قيم ⁦ax + by⁩: أين يختبئ القاسم المشترك الأكبر؟" foot="النقاط الملوّنة هي القيم ⁦ax + by⁩ بأعداد صحيحة x وy. لاحظ أنها مضاعفات عدد واحد بالضبط، وأن أصغرها الموجب هو ⁦gcd(a, b)⁩. هذا ما يبرهنه الكتاب في القضية 7.1 وما بعدها.">
      <div className="controls" style={{ gap: 14 }}>
        {slider('a', a, setA)}
        {slider('b', b, setB)}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} 70`} style={{ width: '100%', minWidth: 480, direction: 'ltr' }} role="img" aria-label="خط الأعداد">
          <line x1={x0} y1={30} x2={W - x0} y2={30} stroke="var(--line-strong)" />
          {span.map((v) => {
            const cx = x0 + (v + R) * step;
            const on = hit.has(v);
            const isG = v === g;
            return (
              <g key={v}>
                <circle cx={cx} cy={30} r={on ? (isG ? 7 : 5) : 2} fill={isG ? 'var(--amber)' : on ? 'var(--violet)' : 'var(--line-strong)'} />
                {(v % 5 === 0 || isG) && <text x={cx} y={isG ? 14 : 55} textAnchor="middle" fontSize={11} fill={isG ? 'var(--amber)' : 'var(--ink-3)'} fontWeight={isG ? 700 : 400}>{v}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="result-row"><Tex>{`\\gcd(${a}, ${b}) = ${g}`}</Tex></div>
      <div className="result-row"><Tex>{`${g} = ${a}\\cdot(${k}) + ${b}\\cdot(${l})`}</Tex></div>
      <p style={{ margin: '8px 0 0' }}>
        القيم في المدى المعروض: <span className="ltr" style={{ display: 'inline-block' }}>{[...hit].filter((v) => v > 0).sort((p, q) => p - q).slice(0, 8).join(', ')}, …</span> كلها مضاعفات <Tex>{String(g)}</Tex>.
        {g === 1 && ' وبما أن القاسم المشترك 1، فكل عدد صحيح يمكن كتابته على هذه الصورة.'}
      </p>
    </Shell>
  );
}
