import { useState } from 'react';
import { Shell, Tex } from './Shell';

const COLORS = ['var(--set-a)', 'var(--violet)', 'var(--amber)', 'var(--green)', 'var(--set-b)'];

/** 1 + 3 + 5 + … + (2n − 1) = n²: each odd number is an L-shaped layer that turns a k×k square into a (k+1)×(k+1) square. */
export default function OddSquares() {
  const [n, setN] = useState(4);
  const S = 26;
  const size = n * S;
  const cells: { x: number; y: number; layer: number }[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) cells.push({ x: c, y: r, layer: Math.max(r, c) });
  const terms = Array.from({ length: n }, (_, i) => 2 * i + 1);
  return (
    <Shell title="مجموع الأعداد الفردية مربع" foot="كل عدد فردي ⁦2k + 1⁩ طبقة على شكل حرف L. إضافتها إلى مربع ⁦k × k⁩ تعطي مربعاً ⁦(k + 1) × (k + 1)⁩. هذا بالضبط ما تفعله خطوة الاستقراء: ⁦k² + (2k + 1) = (k + 1)²⁩.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={1} max={10} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} style={{ width: '100%', maxWidth: 60 + n * 22, direction: 'ltr' }} role="img" aria-label="مربع من طبقات">
          {cells.map(({ x, y, layer }) => (
            <rect key={`${x}-${y}`} x={x * S} y={(n - 1 - y) * S} width={S - 2} height={S - 2} rx={3} fill={COLORS[layer % COLORS.length]} opacity={layer === n - 1 ? 1 : 0.45} />
          ))}
          <rect x={0} y={0} width={size - 2} height={size - 2} fill="none" stroke="var(--ink)" strokeWidth={1} strokeDasharray="3 3" />
        </svg>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div className="result-row"><Tex>{`${terms.join(' + ')} = ${n * n} = ${n}^2`}</Tex></div>
          {n > 1 && (
            <>
              <p style={{ margin: '10px 0 4px' }}>خطوة الاستقراء من <Tex>{`k = ${n - 1}`}</Tex> إلى <Tex>{`k + 1 = ${n}`}</Tex>:</p>
              <div className="result-row"><Tex>{`\\underbrace{${(n - 1) ** 2}}_{(${n - 1})^2 \\text{ (hyp.)}} + \\underbrace{${2 * n - 1}}_{2(${n - 1}) + 1} = ${n * n} = (${n})^2`}</Tex></div>
              <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>الطبقة الملوّنة بقوة هي الحد الجديد. الباقي هو المربع السابق، أي فرض الاستقراء.</p>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
