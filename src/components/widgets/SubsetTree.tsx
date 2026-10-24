import { useState, type ReactElement } from 'react';
import { Shell, Tex, fmtSet } from './Shell';

const ALL = ['a', 'b', 'c', 'd'];

/** Decision tree: for each element decide "in" or "out". Leaves = all subsets. */
export default function SubsetTree() {
  const [n, setN] = useState(3);
  const [leaf, setLeaf] = useState<number | null>(5);
  const E = ALL.slice(0, n);
  const leaves = 1 << n;
  const W = 640;
  const levelH = n === 4 ? 62 : 72;
  const top = 26;
  const H = top + n * levelH + (n >= 3 ? 70 : 46);
  const nodeX = (k: number, j: number) => ((j + 0.5) * W) / (1 << k);
  const nodeY = (k: number) => top + k * levelH;

  // bit (n-1-k) of leaf index = decision at level k; 1 = in (left branch), 0 = out
  const decision = (leafIdx: number, k: number) => ((leafIdx >> (n - 1 - k)) & 1) === 0; // left = in
  const subsetOf = (leafIdx: number) => E.filter((_, k) => decision(leafIdx, k));
  const onPath = (k: number, j: number) => leaf !== null && leaf >> (n - k) === j;

  const edges: ReactElement[] = [];
  const nodes: ReactElement[] = [];
  for (let k = 0; k <= n; k++) {
    for (let j = 0; j < 1 << k; j++) {
      const x = nodeX(k, j);
      const y = nodeY(k);
      const hot = onPath(k, j);
      if (k < n) {
        [0, 1].forEach((side) => {
          const cj = j * 2 + side;
          const cx = nodeX(k + 1, cj);
          const cy = nodeY(k + 1);
          const h2 = hot && onPath(k + 1, cj);
          const isIn = side === 0;
          edges.push(
            <g key={`e${k}-${cj}`}>
              <line x1={x} y1={y} x2={cx} y2={cy} stroke={h2 ? (isIn ? 'var(--green)' : 'var(--red)') : 'var(--line-strong)'} strokeWidth={h2 ? 3 : 1.3} />
              {k < 3 && (
                <text x={(x + cx) / 2 + (isIn ? -10 : 10)} y={(y + cy) / 2} fontSize={k === 0 ? 13 : 11.5} textAnchor="middle" fill={isIn ? 'var(--green)' : 'var(--red)'} fontWeight={600}>
                  {isIn ? `${E[k]}✓` : `${E[k]}✗`}
                </text>
              )}
            </g>
          );
        });
      }
      nodes.push(
        <circle
          key={`n${k}-${j}`}
          cx={x}
          cy={y}
          r={k === n ? 7 : 5}
          fill={hot ? 'var(--shade)' : k === n ? 'var(--bg-elev)' : 'var(--ink-3)'}
          stroke={k === n ? 'var(--ink-3)' : 'none'}
          style={{ cursor: k === n ? 'pointer' : 'default' }}
          onMouseEnter={k === n ? () => setLeaf(j) : undefined}
          onClick={k === n ? () => setLeaf(j) : undefined}
        />
      );
    }
  }

  const leafLabels = Array.from({ length: leaves }, (_, j) => {
    const s = subsetOf(j);
    const label = s.length ? `{${s.join(',')}}` : '∅';
    const x = nodeX(n, j);
    const y = nodeY(n) + 16;
    const hot = leaf === j;
    return n >= 3 ? (
      <text key={j} x={x} y={y} transform={`rotate(${n === 4 ? 70 : 45} ${x} ${y})`} fontSize={12.5} fill={hot ? 'var(--ink)' : 'var(--ink-2)'} fontWeight={hot ? 700 : 400} onMouseEnter={() => setLeaf(j)} style={{ cursor: 'pointer' }}>
        {label}
      </text>
    ) : (
      <text key={j} x={x} y={y + 6} fontSize={14} textAnchor="middle" fill={hot ? 'var(--ink)' : 'var(--ink-2)'} fontWeight={hot ? 700 : 400} onMouseEnter={() => setLeaf(j)} style={{ cursor: 'pointer' }}>
        {label}
      </text>
    );
  });

  return (
    <Shell
      title="شجرة القرارات: لماذا يتضاعف عدد المجموعات الجزئية مع كل عنصر؟"
      foot="كل مجموعة جزئية تُبنى بسلسلة قرارات: لكل عنصر، هل يدخل (✓) أم لا (✗)؟ قراران لكل عنصر، فيتضاعف عدد الفروع عند كل مستوى. مرّر المؤشر على أي ورقة لترى مسارها."
    >
      <div className="controls">
        <span>عدد العناصر:</span>
        {[1, 2, 3, 4].map((k) => (
          <button key={k} className="btn" aria-pressed={k === n} onClick={() => { setN(k); setLeaf(null); }}>
            {k}
          </button>
        ))}
        <span style={{ marginInlineStart: 'auto' }}>
          <Tex>{`A = ${fmtSet(E)}`}</Tex>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', direction: 'ltr' }} role="img" aria-label="شجرة القرارات للمجموعات الجزئية">
        {edges}
        {nodes}
        {leafLabels}
      </svg>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        {leaf !== null ? (
          <span>
            {E.map((e, k) => (
              <span key={e} style={{ color: decision(leaf, k) ? 'var(--green)' : 'var(--red)', marginInlineEnd: 10, fontWeight: 600 }}>
                {e}: {decision(leaf, k) ? 'يدخل' : 'لا يدخل'}
              </span>
            ))}
            ⟵ <Tex>{fmtSet(subsetOf(leaf))}</Tex>
          </span>
        ) : (
          <span className="muted">اختر ورقة من أسفل الشجرة</span>
        )}
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        <Tex>{`\\underbrace{${E.map(() => '2').join(' \\cdot ')}}_{${n}\\ \\text{decisions}} = 2^{${n}} = ${leaves}`}</Tex>
        <span className="muted">مجموعة جزئية</span>
      </div>
    </Shell>
  );
}
