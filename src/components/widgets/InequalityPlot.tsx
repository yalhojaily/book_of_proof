import { useState } from 'react';
import { Shell, Tex } from './Shell';

/** Search for x with x⁴ < x < x²: the region where x⁴ < x and the region where x < x² never meet. */
export default function InequalityPlot() {
  const [x, setX] = useState(0.5);
  const W = 560, H = 300, X0 = -1.6, X1 = 2.2, Y0 = -1.8, Y1 = 4;
  const sx = (v: number) => ((v - X0) / (X1 - X0)) * W;
  const sy = (v: number) => H - ((v - Y0) / (Y1 - Y0)) * H;
  const path = (f: (t: number) => number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) { const t = X0 + ((X1 - X0) * i) / 200; const y = f(t); pts.push(`${i ? 'L' : 'M'}${sx(t).toFixed(1)},${sy(Math.max(Y0 - 1, Math.min(Y1 + 1, y))).toFixed(1)}`); }
    return pts.join(' ');
  };
  const a = x ** 4 < x, b = x < x * x;
  const band = (lo: number, hi: number, y: number, color: string, label: string) => (
    <g>
      <rect x={sx(lo)} y={y} width={sx(hi) - sx(lo)} height={10} rx={5} fill={color} opacity={0.75} />
      <text x={sx(hi) + 4} y={y + 9} fontSize={11} fill="var(--ink-2)">{label}</text>
    </g>
  );
  return (
    <Shell title="ابحث عن x يحقق ⁦x⁴ < x < x²⁩" foot="الشريط الأزرق: حيث ⁦x⁴ < x⁩، أي ⁦0 < x < 1⁩. الشريط البنفسجي: حيث ⁦x < x²⁩، أي ⁦x < 0⁩ أو ⁦x > 1⁩. لا تقاطع بينهما، فلا يوجد x. لكن الرسم يقنع ولا يبرهن: البرهان يأتي في الكتاب بالتناقض.">
      <label className="ltr controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tex>{`x = ${x.toFixed(2)}`}</Tex>
        <input type="range" min={X0 + 0.1} max={X1 - 0.1} step={0.01} value={x} onChange={(e) => setX(+e.target.value)} style={{ flex: 1 }} />
      </label>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H + 40}`} style={{ width: '100%', minWidth: 420, direction: 'ltr' }} role="img" aria-label="رسم الدوال الثلاث">
          <line x1={0} y1={sy(0)} x2={W} y2={sy(0)} stroke="var(--line-strong)" />
          <line x1={sx(0)} y1={0} x2={sx(0)} y2={H} stroke="var(--line-strong)" />
          {[-1, 1, 2].map((t) => <text key={t} x={sx(t)} y={sy(0) + 14} fontSize={11} textAnchor="middle" fill="var(--ink-3)">{t}</text>)}
          <path d={path((t) => t ** 4)} fill="none" stroke="var(--set-a)" strokeWidth={2.5} />
          <path d={path((t) => t)} fill="none" stroke="var(--ink)" strokeWidth={2} />
          <path d={path((t) => t * t)} fill="none" stroke="var(--violet)" strokeWidth={2.5} />
          <text x={sx(1.45)} y={sy(3.6)} fontSize={13} fill="var(--set-a)">x⁴</text>
          <text x={sx(1.95)} y={sy(3.6)} fontSize={13} fill="var(--violet)">x²</text>
          <text x={sx(2.05)} y={sy(2.2)} fontSize={13} fill="var(--ink)">x</text>
          <line x1={sx(x)} y1={0} x2={sx(x)} y2={H} stroke="var(--amber)" strokeDasharray="4 3" />
          {[x ** 4, x, x * x].map((v, i) => v < Y1 && <circle key={i} cx={sx(x)} cy={sy(v)} r={4.5} fill={['var(--set-a)', 'var(--ink)', 'var(--violet)'][i]} />)}
          {band(0, 1, H + 6, 'var(--set-a)', 'x⁴ < x')}
          {band(X0, 0, H + 22, 'var(--violet)', '')}
          {band(1, X1 - 0.35, H + 22, 'var(--violet)', 'x < x²')}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span className={a ? 'pill-ok' : 'pill-bad'}><Tex>{`x^4 ${a ? '<' : '\\not<'} x`}</Tex></span>
        <span className={b ? 'pill-ok' : 'pill-bad'}><Tex>{`x ${b ? '<' : '\\not<'} x^2`}</Tex></span>
      </div>
      <p style={{ margin: '8px 0 0', textAlign: 'center' }}>{a && b ? 'وجدته؟!' : 'شرط واحد على الأكثر يتحقق. حرّك x إلى أي مكان.'}</p>
    </Shell>
  );
}
