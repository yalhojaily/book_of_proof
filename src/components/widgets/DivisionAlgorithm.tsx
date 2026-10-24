import { useState } from 'react';
import { Shell, Tex } from './Shell';

const jumpWord = (n: number) =>
  n === 1 ? 'قفزة واحدة' : n === 2 ? 'قفزتان' : n <= 10 ? `${n} قفزات` : `${n} قفزة`;

/** a = qb + r with 0 ≤ r < b, shown as q jumps of size b followed by a remainder, plus the well-ordering view. */
export default function DivisionAlgorithm() {
  const [a, setA] = useState(17);
  const [b, setB] = useState(3);
  const q = Math.floor(a / b);
  const r = a - q * b;

  const lo = Math.min(0, a, q * b) - 1;
  const hi = Math.max(0, a, q * b) + 1;
  const W = 640;
  const pad = 20;
  const X = (x: number) => pad + ((x - lo) / (hi - lo)) * (W - 2 * pad);
  const jumps = Array.from({ length: Math.abs(q) }, (_, i) => (q >= 0 ? i * b : -i * b));
  const tickEvery = hi - lo > 50 ? 5 : hi - lo > 25 ? 2 : 1;

  // the set {a − xb : x ∈ ℤ, a − xb ≥ 0}
  const Aset = Array.from({ length: 7 }, (_, i) => r + i * b);

  return (
    <Shell title="خوارزمية القسمة: كم مرة يدخل b في a، وكم يتبقى؟" foot="القفزات الزرقاء كل منها بطول b. نقفز من الصفر أكبر عدد ممكن من المرات دون أن نتجاوز a، وما يتبقى هو الباقي r. جرّب قيماً سالبة لـ a.">
      <div className="controls ltr" style={{ justifyContent: 'center', gap: 22 }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`a = ${a}`}</Tex>
          <input type="range" min={-25} max={40} value={a} onChange={(e) => setA(Number(e.target.value))} aria-label="a" />
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`b = ${b}`}</Tex>
          <input type="range" min={1} max={9} value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="b" />
        </label>
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '0 0 2px' }}>
        {q === 0 ? 'لا توجد قفزات كاملة: a أصغر من b.' : <>{jumpWord(Math.abs(q))} بطول <Tex>{`b = ${b}`}</Tex> {q > 0 ? 'إلى اليمين' : 'إلى اليسار'}، ثم الباقي <Tex>{`r = ${r}`}</Tex></>}
      </p>
      <svg viewBox={`0 0 ${W} 110`} style={{ width: '100%', display: 'block', direction: 'ltr' }} role="img" aria-label="القفزات على خط الأعداد">
        <line x1={pad} x2={W - pad} y1={70} y2={70} stroke="var(--line-strong)" strokeWidth={2} />
        {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((t) => (
          <g key={t}>
            <line x1={X(t)} x2={X(t)} y1={66} y2={74} stroke="var(--line-strong)" />
            {t % tickEvery === 0 && (
              <text x={X(t)} y={92} fontSize={10.5} textAnchor="middle" fill={t === 0 || t === a ? 'var(--ink)' : 'var(--ink-3)'} fontWeight={t === 0 || t === a ? 700 : 400}>
                {t}
              </text>
            )}
          </g>
        ))}
        {jumps.map((s, i) => {
          const e = q >= 0 ? s + b : s - b;
          const rx = Math.abs(X(e) - X(s)) / 2;
          return (
            <path key={i} d={`M ${X(s)} 70 A ${rx} ${Math.min(30, rx * 0.9)} 0 0 ${q >= 0 ? 1 : 0} ${X(e)} 70`} fill="none" stroke="var(--set-a)" strokeWidth={2.2}>
              <title>{`قفزة ${i + 1}`}</title>
            </path>
          );
        }).concat(
          r > 0 ? [<line key="r" x1={X(q * b)} x2={X(a)} y1={70} y2={70} stroke="var(--amber)" strokeWidth={7} strokeLinecap="round" />] : []
        )}
        <circle cx={X(0)} cy={70} r={4.5} fill="var(--ink)" />
        <circle cx={X(a)} cy={70} r={6} fill="var(--set-b)" />
        <text x={X(a)} y={54} fontSize={12} textAnchor="middle" fill="var(--set-b)" fontWeight={700} dy={r > 0 && Math.abs(X(a) - X(q * b)) < 26 ? -16 : 0}>a</text>
        {r > 0 && (
          <text x={(X(q * b) + X(a)) / 2} y={60} fontSize={11.5} textAnchor="middle" fill="var(--amber)" fontWeight={700}>r</text>
        )}
      </svg>
      <div className="result-row" style={{ justifyContent: 'center', fontSize: '1.2em' }}>
        <Tex>{`${a} = \\underbrace{(${q})}_{q} \\cdot ${b} + \\underbrace{${r}}_{r}, \\qquad 0 \\le ${r} < ${b}\\ \\checkmark`}</Tex>
      </div>
      {a < 0 && (
        <p className="muted" style={{ textAlign: 'center', margin: '4px 0 0' }}>
          مع a سالب يكون q سالباً، لكن الباقي يبقى غير سالب: نقفز يساراً حتى نصل إلى a أو نتجاوزه، ثم نرجع بالباقي.
        </p>
      )}
      <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg-sunk)', borderRadius: 10 }}>
        <b>لماذا يوجد r أصلاً؟ مبدأ الترتيب الحسن.</b> انظر إلى كل الأعداد غير السالبة التي يمكن كتابتها على الصورة <Tex>{'a - xb'}</Tex>:
        <div className="ltr" style={{ textAlign: 'center', margin: '6px 0' }}>
          <Tex>{`\\{a - xb : x \\in \\mathbb{Z},\\ a - xb \\ge 0\\} = \\{\\colorbox{#f2b705}{$${Aset[0]}$}, ${Aset.slice(1).join(', ')}, \\ldots\\}`}</Tex>
        </div>
        هذه مجموعة غير خالية من الأعداد غير السالبة، فلها أصغر عنصر، وهو بالضبط <Tex>{`r = ${r}`}</Tex>.
      </div>
    </Shell>
  );
}
