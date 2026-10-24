import { useState } from 'react';
import { Shell, Tex } from './Shell';

const ALL = ['a', 'b', 'c', 'd'];
const popcount = (m: number) => m.toString(2).split('1').length - 1;

/** The power set drawn as layers (by size), with edges for "add one element". */
export default function PowerSet() {
  const [n, setN] = useState(3);
  const [hot, setHot] = useState<number | null>(null);
  const E = ALL.slice(0, n);
  const masks = Array.from({ length: 1 << n }, (_, m) => m);
  const layers = Array.from({ length: n + 1 }, (_, k) => masks.filter((m) => popcount(m) === k));
  const W = 640;
  const rowH = 74;
  const H = rowH * n + 56;
  const pos = new Map<number, [number, number]>();
  layers.forEach((row, k) =>
    row.forEach((m, j) => pos.set(m, [((j + 0.5) * W) / row.length, H - 28 - k * rowH]))
  );
  const label = (m: number) => (m === 0 ? '∅' : `{${E.filter((_, i) => m & (1 << i)).join(',')}}`);
  const texLabel = (m: number) => (m === 0 ? '\\varnothing' : `\\{${E.filter((_, i) => m & (1 << i)).join(',')}\\}`);
  const isSub = (s: number, t: number) => (s & t) === s;

  const edges: [number, number][] = [];
  masks.forEach((m) => E.forEach((_, i) => { if (!(m & (1 << i))) edges.push([m, m | (1 << i)]); }));

  return (
    <Shell
      title="مجموعة القوى: كل المجموعات الجزئية في مكان واحد"
      foot="كل نقطة عنصر من عناصر P(A). الصفوف مرتبة حسب عدد العناصر، والخط يعني «أضف عنصراً واحداً». مرّر المؤشر على مجموعة لتضيء كل مجموعاتها الجزئية."
    >
      <div className="controls">
        <span>عدد عناصر A:</span>
        {[1, 2, 3, 4].map((k) => (
          <button key={k} className="btn" aria-pressed={k === n} onClick={() => { setN(k); setHot(null); }}>
            {k}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', direction: 'ltr' }} role="img" aria-label="مخطط مجموعة القوى">
        {edges.map(([s, t]) => {
          const [x1, y1] = pos.get(s)!;
          const [x2, y2] = pos.get(t)!;
          const lit = hot !== null && isSub(t, hot);
          return <line key={`${s}-${t}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lit ? 'var(--amber)' : 'var(--line-strong)'} strokeWidth={lit ? 2.4 : 1.1} />;
        })}
        {masks.map((m) => {
          const [x, y] = pos.get(m)!;
          const lit = hot !== null && isSub(m, hot);
          const lab = label(m);
          const w = Math.max(30, lab.length * 8.4 + 12);
          return (
            <g key={m} onMouseEnter={() => setHot(m)} onClick={() => setHot(m)} style={{ cursor: 'pointer' }}>
              <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={9} fill={lit ? (m === hot ? 'var(--shade)' : 'var(--shade-fill)') : 'var(--bg-elev)'} stroke={lit ? 'var(--amber)' : 'var(--line-strong)'} />
              <text x={x} y={y + 5} fontSize={13.5} textAnchor="middle" fill={m === hot ? '#1d1f24' : 'var(--ink)'} fontWeight={600}>
                {lab}
              </text>
            </g>
          );
        })}
        {layers.map((row, k) => (
          <text key={k} x={W - 4} y={H - 28 - k * rowH - 18} fontSize={11} textAnchor="end" fill="var(--ink-3)">
            {row.length}
          </text>
        ))}
      </svg>
      <div className="result-row" style={{ justifyContent: 'center', fontSize: '0.98em' }}>
        <Tex>{`\\mathscr{P}(A) = \\{${[...masks].sort((x, y) => popcount(x) - popcount(y) || x - y).map(texLabel).join(',\\ ')}\\}`}</Tex>
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        <Tex>{`|\\mathscr{P}(A)| = 2^{|A|} = 2^{${n}} = ${1 << n}`}</Tex>
        <span className="muted">· الأعداد في كل صف: {layers.map((r) => r.length).join('، ')} (ستراها مجدداً في مثلث باسكال، الفصل 3)</span>
      </div>
      {hot !== null && (
        <p className="muted" style={{ textAlign: 'center', margin: '6px 0 0' }}>
          المجموعات الجزئية من <Tex>{texLabel(hot)}</Tex> عددها <Tex>{`2^{${popcount(hot)}} = ${1 << popcount(hot)}`}</Tex>: هذه هي <Tex>{`\\mathscr{P}(${texLabel(hot)})`}</Tex> وهي جزء من <Tex>{'\\mathscr{P}(A)'}</Tex>.
        </p>
      )}
    </Shell>
  );
}
