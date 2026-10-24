import { useState } from 'react';
import { Shell } from './Shell';

const NODES = ['a', 'b', 'c', 'd'];
const POS = [[70, 50], [250, 50], [250, 190], [70, 190]];
type Edge = [number, number];
const key = (e: Edge) => `${e[0]}-${e[1]}`;

const PRESETS: { name: string; edges: Edge[] }[] = [
  { name: 'دائرة', edges: [[0, 1], [1, 2], [2, 3], [3, 0]] },
  { name: 'سلسلة بلا رجوع', edges: [[0, 1], [1, 2], [2, 3]] },
  { name: 'أزواج متبادلة', edges: [[0, 1], [1, 0], [2, 3], [3, 2]] },
  { name: 'نجمة', edges: [[0, 1], [1, 0], [0, 2], [2, 0], [0, 3], [3, 0]] },
];

function reach(edges: Edge[], from: number): Set<number> {
  const seen = new Set([from]);
  const stack = [from];
  while (stack.length) {
    const u = stack.pop()!;
    for (const [x, y] of edges) if (x === u && !seen.has(y)) { seen.add(y); stack.push(y); }
  }
  return seen;
}

/** Prove four statements equivalent: choose which implications you prove and check whether every statement reaches every other. */
export default function ImplicationGraph() {
  const [edges, setEdges] = useState<Edge[]>(PRESETS[0].edges);
  const has = (e: Edge) => edges.some((x) => key(x) === key(e));
  const toggle = (e: Edge) => setEdges(has(e) ? edges.filter((x) => key(x) !== key(e)) : [...edges, e]);
  const missing: string[] = [];
  NODES.forEach((_, i) => {
    const r = reach(edges, i);
    NODES.forEach((_, j) => { if (i !== j && !r.has(j)) missing.push(`(${NODES[i]}) ⇒ (${NODES[j]})`); });
  });
  const ok = missing.length === 0;
  const all: Edge[] = [];
  NODES.forEach((_, i) => NODES.forEach((_, j) => i !== j && all.push([i, j])));

  const arrow = ([i, j]: Edge, k: number) => {
    const [x1, y1] = POS[i], [x2, y2] = POS[j];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const both = has([j, i]);
    const off = both ? 7 : 0; // separate a two-way pair
    const nx = -uy * off, ny = ux * off;
    return <line key={k} x1={x1 + ux * 26 + nx} y1={y1 + uy * 26 + ny} x2={x2 - ux * 30 + nx} y2={y2 - uy * 30 + ny} stroke="var(--violet)" strokeWidth={2.5} markerEnd="url(#ig-head)" />;
  };

  return (
    <Shell title="كم استلزاماً يكفي لتكافؤ أربع عبارات؟" foot="العبارات متكافئة إذا أمكن الوصول من كل عبارة إلى كل عبارة أخرى بسلسلة من الأسهم. الدائرة تحقق ذلك بأقل عدد من الاستلزامات: سهم واحد لكل عبارة.">
      <div className="controls">
        {PRESETS.map((p) => (
          <button key={p.name} className="chip" onClick={() => setEdges(p.edges)}>{p.name}</button>
        ))}
        <button className="chip" onClick={() => setEdges([])}>امسح</button>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 320 240" style={{ width: '100%', maxWidth: 340, direction: 'ltr' }} role="img" aria-label="مخطط الاستلزامات">
          <defs>
            <marker id="ig-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--violet)" />
            </marker>
          </defs>
          {edges.map(arrow)}
          {NODES.map((n, i) => (
            <g key={n}>
              <circle cx={POS[i][0]} cy={POS[i][1]} r={22} fill="var(--bg-elev)" stroke="var(--ink)" strokeWidth={1.5} />
              <text x={POS[i][0]} y={POS[i][1] + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--ink)">({n})</text>
            </g>
          ))}
        </svg>
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <p style={{ margin: '0 0 6px' }}>الاستلزامات التي برهنتها (اضغط لإضافة أو حذف):</p>
          <div className="ltr" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4 }}>
            {all.map((e) => (
              <button key={key(e)} className="chip" aria-pressed={has(e)} onClick={() => toggle(e)} style={has(e) ? { background: 'var(--violet)', color: '#fff', borderColor: 'var(--violet)' } : undefined}>
                ({NODES[e[0]]}) ⇒ ({NODES[e[1]]})
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: ok ? 'var(--green-soft)' : 'var(--red-soft)' }}>
        {ok ? (
          <><b style={{ color: 'var(--green)' }}>متكافئة كلها</b> باستعمال {edges.length} استلزامات.{edges.length > 4 && ' يمكن الاكتفاء بأربعة (دائرة).'}</>
        ) : (
          <><b style={{ color: 'var(--red)' }}>غير كافٍ.</b> لم تثبت بعد مثلاً: <span className="ltr" style={{ display: 'inline-block' }}>{missing.slice(0, 3).join(',  ')}</span>{missing.length > 3 && ' …'}</>
        )}
      </div>
    </Shell>
  );
}
