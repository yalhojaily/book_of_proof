import { useState } from 'react';
import { Shell, Tex } from './Shell';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const SIZE = 6;

/** Walk the grid of fractions p/q along diagonals, skipping repeats: every positive rational gets a number. */
export default function RationalsGrid() {
  const [k, setK] = useState(12);
  // order: diagonals p + q = s, alternating direction
  const order: [number, number][] = [];
  for (let s = 2; s <= 2 * SIZE; s++) {
    const diag: [number, number][] = [];
    for (let p = 1; p < s; p++) { const q = s - p; if (p <= SIZE && q <= SIZE) diag.push([p, q]); }
    if (s % 2 === 0) diag.reverse();
    order.push(...diag);
  }
  const listed: [number, number][] = [];
  const idx = new Map<string, number>();
  for (const [p, q] of order) if (gcd(p, q) === 1) { listed.push([p, q]); idx.set(`${p}/${q}`, listed.length); }
  const shown = listed.slice(0, k);
  const C = 52;
  const pos = (p: number, q: number) => [30 + (q - 1) * C, 30 + (p - 1) * C];
  return (
    <Shell title="ℚ قابلة للعدّ: المسار القطري" foot="الصف p والعمود q فيه الكسر p/q. نمشي على الأقطار، ونتخطى الكسور المكررة (مثل ⁦2/4 = 1/2⁩). كل كسر موجب في الجدول اللانهائي يصله المسار بعد عدد منته من الخطوات، فيأخذ رقماً طبيعياً.">
      <label className="ltr controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tex>{`k = ${k}`}</Tex>
        <input type="range" min={1} max={listed.length} value={k} onChange={(e) => setK(+e.target.value)} style={{ flex: 1, maxWidth: 300 }} />
      </label>
      <svg viewBox={`0 0 ${30 + SIZE * C} ${30 + SIZE * C}`} style={{ width: '100%', maxWidth: 360, display: 'block', margin: '0 auto', direction: 'ltr' }} role="img" aria-label="جدول الكسور">
        <polyline fill="none" stroke="var(--violet)" strokeWidth={2} opacity={0.7} points={shown.map(([p, q]) => pos(p, q).join(',')).join(' ')} />
        {Array.from({ length: SIZE }, (_, i) => Array.from({ length: SIZE }, (_, j) => {
          const p = i + 1, q = j + 1;
          const [x, y] = pos(p, q);
          const reduced = gcd(p, q) === 1;
          const n = idx.get(`${p}/${q}`);
          const on = n !== undefined && n <= k;
          return (
            <g key={`${p}/${q}`}>
              <rect x={x - 20} y={y - 15} width={40} height={30} rx={6} fill={on ? 'var(--violet-soft)' : 'var(--bg-elev)'} stroke={on ? 'var(--violet)' : 'var(--line)'} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fill={reduced ? 'var(--ink)' : 'var(--ink-3)'} textDecoration={reduced ? undefined : 'line-through'}>{p}/{q}</text>
              {on && <text x={x + 17} y={y - 8} textAnchor="end" fontSize={9} fill="var(--violet)" fontWeight={700}>{n}</text>}
            </g>
          );
        }))}
      </svg>
      <div className="ltr" style={{ fontSize: 13.5, textAlign: 'center', marginTop: 6, overflowWrap: 'anywhere' }}>
        {shown.map(([p, q], i) => <span key={i}>{i ? ', ' : ''}<span style={{ color: 'var(--violet)' }}>{p}/{q}</span></span>)}, …
      </div>
      <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>بإضافة 0 والكسور السالبة بالتناوب (0، 1، −1، 1/2، −1/2، …) نحصل على قائمة لكل ℚ، كما في المبرهنة 14.4.</p>
    </Shell>
  );
}
