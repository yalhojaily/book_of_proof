import { useState } from 'react';
import { Shell, Tex } from './Shell';

/** |x − y| ≤ |x − z| + |z − y|: going from x to y through z is never shorter than going directly. */
export default function TriangleIneq() {
  const [x, setX] = useState(-3);
  const [y, setY] = useState(4);
  const [z, setZ] = useState(6);
  const W = 520, lo = -10, hi = 10;
  const sx = (v: number) => 20 + ((v - lo) / (hi - lo)) * (W - 40);
  const d = Math.abs(x - y), via = Math.abs(x - z) + Math.abs(z - y);
  const between = (z - x) * (z - y) <= 0;
  const sl = (label: string, v: number, set: (n: number) => void, color: string) => (
    <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <b style={{ color, fontStyle: 'italic', fontFamily: 'KaTeX_Math, serif' }}>{label} = {v}</b>
      <input type="range" min={lo} max={hi} step={0.5} value={v} onChange={(e) => set(+e.target.value)} />
    </label>
  );
  return (
    <Shell title="متباينة المثلث على خط الأعداد" foot="⁦|a − b|⁩ هي المسافة بين a وb. الطريق من x إلى y مروراً بـ z لا يكون أقصر من الطريق المباشر، ويتساويان فقط حين تقع z بين x وy.">
      <div className="controls ltr" style={{ gap: 14 }}>
        {sl('x', x, setX, 'var(--set-a)')}
        {sl('y', y, setY, 'var(--set-b)')}
        {sl('z', z, setZ, 'var(--violet)')}
      </div>
      <svg viewBox={`0 0 ${W} 110`} style={{ width: '100%', direction: 'ltr' }} role="img" aria-label="خط الأعداد">
        <line x1={20} y1={70} x2={W - 20} y2={70} stroke="var(--line-strong)" />
        {Array.from({ length: 21 }, (_, i) => i - 10).map((v) => <text key={v} x={sx(v)} y={92} fontSize={10} textAnchor="middle" fill="var(--ink-3)">{v % 5 === 0 ? v : ''}</text>)}
        <line x1={sx(x)} y1={62} x2={sx(y)} y2={62} stroke="var(--set-b)" strokeWidth={4} opacity={0.6} />
        <path d={`M${sx(x)},58 Q${(sx(x) + sx(z)) / 2},${20} ${sx(z)},58`} fill="none" stroke="var(--violet)" strokeWidth={2} />
        <path d={`M${sx(z)},58 Q${(sx(z) + sx(y)) / 2},${30} ${sx(y)},58`} fill="none" stroke="var(--violet)" strokeWidth={2} strokeDasharray="5 3" />
        {[[x, 'x', 'var(--set-a)'], [y, 'y', 'var(--set-b)'], [z, 'z', 'var(--violet)']].map(([v, n, c]) => (
          <g key={n as string}><circle cx={sx(v as number)} cy={70} r={6} fill={c as string} /><text x={sx(v as number)} y={108} textAnchor="middle" fontSize={13} fontStyle="italic" fill={c as string}>{n}</text></g>
        ))}
      </svg>
      <div className="result-row" style={{ justifyContent: 'center' }}><Tex>{`|x - y| = ${d} \\;${d === via ? '=' : '<'}\\; ${Math.abs(x - z)} + ${Math.abs(z - y)} = |x - z| + |z - y|`}</Tex></div>
      <p style={{ margin: '4px 0 0', textAlign: 'center' }}>{between ? 'z بين x وy: تساوٍ.' : 'z خارج الفترة بين x وy: الطريق غير المباشر أطول.'}</p>
    </Shell>
  );
}
