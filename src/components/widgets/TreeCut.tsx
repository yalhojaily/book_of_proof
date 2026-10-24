import { useMemo, useState } from 'react';
import { Shell, Tex } from './Shell';

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}

/** A random tree with n vertices. Cut any edge: the two pieces are smaller trees, and edges add up as (x − 1) + (y − 1) + 1. */
export default function TreeCut() {
  const [n, setN] = useState(9);
  const [seed, setSeed] = useState(7);
  const [cut, setCut] = useState<number | null>(null);

  const { parent, pos } = useMemo(() => {
    const r = rng(seed * 97 + n);
    const parent = [-1];
    for (let v = 1; v < n; v++) parent.push(Math.floor(r() * v));
    // tidy layout: leaves get consecutive x, parents sit above the middle of their children
    const kids: number[][] = parent.map(() => []);
    for (let v = 1; v < n; v++) kids[parent[v]].push(v);
    const depth = parent.map(() => 0);
    for (let v = 1; v < n; v++) depth[v] = depth[parent[v]] + 1;
    const xs: number[] = [];
    let next = 0;
    const place = (v: number): number => {
      if (!kids[v].length) return (xs[v] = next++);
      const c = kids[v].map(place);
      return (xs[v] = (c[0] + c[c.length - 1]) / 2);
    };
    place(0);
    const span = Math.max(1, next - 1);
    const pos: [number, number][] = parent.map((_, v) => [next === 1 ? 170 : 25 + (xs[v] / span) * 290, 30 + depth[v] * 52]);
    return { parent, pos };
  }, [n, seed]);

  // component of each vertex after cutting edge (cut, parent[cut])
  const side = parent.map((_, v) => {
    if (cut === null) return 0;
    let u = v;
    while (u !== -1) { if (u === cut) return 1; u = parent[u]; }
    return 0;
  });
  const x = side.filter((s) => s === 0).length;
  const y = n - x;
  const H = Math.max(...pos.map((p) => p[1])) + 30;
  return (
    <Shell title="اقطع ضلعاً من الشجرة" foot="الشجرة رسم متصل بلا دورات. بعد قطع ضلع نحصل على شجرتين أصغر، ولا يلزم أن يكون حجم أي منهما k بالضبط. لهذا يحتاج البرهان إلى الاستقراء القوي: نفترض صحة العبارة لكل الأحجام الأصغر.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={2} max={16} value={n} onChange={(e) => { setN(+e.target.value); setCut(null); }} />
        </label>
        <button className="btn" onClick={() => { setSeed(seed + 1); setCut(null); }}>شجرة أخرى</button>
      </div>
      <svg viewBox={`0 0 340 ${H}`} style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', direction: 'ltr' }} role="img" aria-label="شجرة">
        {parent.map((p, v) => p >= 0 && (
          <g key={v} onClick={() => setCut(cut === v ? null : v)} style={{ cursor: 'pointer' }}>
            <line x1={pos[p][0]} y1={pos[p][1]} x2={pos[v][0]} y2={pos[v][1]} stroke="transparent" strokeWidth={14} />
            <line x1={pos[p][0]} y1={pos[p][1]} x2={pos[v][0]} y2={pos[v][1]} stroke={cut === v ? 'var(--red)' : 'var(--ink-2)'} strokeWidth={cut === v ? 3 : 2} strokeDasharray={cut === v ? '5 4' : undefined} />
          </g>
        ))}
        {pos.map(([px, py], v) => (
          <circle key={v} cx={px} cy={py} r={9} fill={cut === null ? 'var(--bg-elev)' : side[v] ? 'var(--violet)' : 'var(--set-a)'} stroke="var(--ink)" strokeWidth={1.3} />
        ))}
      </svg>
      <div className="result-row"><Tex>{`\\text{vertices} = ${n},\\quad \\text{edges} = ${n - 1}`}</Tex></div>
      {cut === null ? (
        <p className="muted" style={{ margin: '6px 0 0' }}>اضغط على أي ضلع لتقطعه.</p>
      ) : (
        <div className="result-row"><Tex>{`T_1: ${x} \\text{ vertices}, ${x - 1} \\text{ edges};\\ \\ T_2: ${y} \\text{ vertices}, ${y - 1} \\text{ edges};\\ \\ (${x} - 1) + (${y} - 1) + 1 = ${n - 1}`}</Tex></div>
      )}
    </Shell>
  );
}
