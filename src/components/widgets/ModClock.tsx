import { useState } from 'react';
import { Shell, Tex } from './Shell';

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Congruence modulo n as a clock: integers with the same remainder land on the same position. */
export default function ModClock() {
  const [n, setN] = useState(4);
  const [a, setA] = useState(9);
  const [b, setB] = useState(1);
  const [table, setTable] = useState<'none' | 'add' | 'mul'>('none');
  const ra = mod(a, n);
  const rb = mod(b, n);
  const cong = ra === rb;
  const R = 108;
  const cx = 150;
  const cy = 140;
  const pos = (k: number) => {
    const t = (2 * Math.PI * k) / n - Math.PI / 2;
    return [cx + R * Math.cos(t), cy + R * Math.sin(t)];
  };
  const range = Array.from({ length: 25 }, (_, i) => i - 8);
  const num = (label: string, v: number, set: (x: number) => void, color: string) => (
    <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <b style={{ color, fontFamily: 'KaTeX_Math, serif', fontStyle: 'italic', fontSize: 18 }}>{label}</b>
      <input type="number" value={v} onChange={(e) => set(Math.max(-99, Math.min(199, Math.trunc(+e.target.value || 0))))} style={{ width: 70, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
    </label>
  );

  return (
    <Shell title="التطابق بمقياس n: ساعة الأعداد" foot="كل موضع على الساعة باقٍ من بواقي القسمة على n، وتحته الأعداد التي تعطيه. يكون a ≡ b (mod n) إذا وقعا على الموضع نفسه، أي إذا كان n يقسم الفرق a − b.">
      <div className="controls" style={{ gap: 14 }}>
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={2} max={12} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
        {num('a', a, setA, 'var(--set-a)')}
        {num('b', b, setB, 'var(--set-b)')}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 280" style={{ width: '100%', maxWidth: 320, direction: 'ltr' }} role="img" aria-label="ساعة البواقي">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line-strong)" strokeWidth={2} />
          {Array.from({ length: n }, (_, k) => {
            const [x, y] = pos(k);
            const isA = k === ra, isB = k === rb;
            return (
              <g key={k}>
                <circle cx={x} cy={y} r={17} fill={isA && isB ? 'var(--shade)' : isA ? 'var(--set-a-fill)' : isB ? 'var(--set-b-fill)' : 'var(--bg-elev)'} stroke={isA ? 'var(--set-a)' : isB ? 'var(--set-b)' : 'var(--line-strong)'} strokeWidth={isA || isB ? 2.5 : 1.2} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={isA && isB ? '#1d1f24' : 'var(--ink)'}>{k}</text>
              </g>
            );
          })}
          {[[a, ra, 'var(--set-a)'], [b, rb, 'var(--set-b)']].map(([v, r, c], i) => {
            const [x, y] = pos(r as number);
            const dx = (x - cx) * 0.55, dy = (y - cy) * 0.55;
            return <line key={i} x1={cx} y1={cy} x2={cx + dx} y2={cy + dy} stroke={c as string} strokeWidth={i === 0 ? 4 : 2.5} strokeLinecap="round" opacity={0.85} />;
          })}
          <circle cx={cx} cy={cy} r={4} fill="var(--ink)" />
        </svg>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div className="result-row"><Tex>{`${a} = ${Math.floor(a / n)} \\cdot ${n} + ${ra}`}</Tex></div>
          <div className="result-row"><Tex>{`${b} = ${Math.floor(b / n)} \\cdot ${n} + ${rb}`}</Tex></div>
          <div className="result-row"><Tex>{`${a} - ${b < 0 ? `(${b})` : b} = ${a - b}${cong ? ` = ${n} \\cdot ${(a - b) / n < 0 ? `(${(a - b) / n})` : (a - b) / n}` : ''}`}</Tex></div>
          <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 10, background: cong ? 'var(--green-soft)' : 'var(--red-soft)' }}>
            {cong ? (
              <><b style={{ color: 'var(--green)' }}>متطابقان:</b> <Tex>{`${a} \\equiv ${b} \\pmod{${n}}`}</Tex>، لأن <Tex>{`${n} \\mid ${a - b}`}</Tex>، وللعددين الباقي نفسه {ra}.</>
            ) : (
              <><b style={{ color: 'var(--red)' }}>غير متطابقين:</b> <Tex>{`${a} \\not\\equiv ${b} \\pmod{${n}}`}</Tex>، لأن <Tex>{`${n} \\nmid ${a - b}`}</Tex>.</>
            )}
          </div>
        </div>
      </div>
      <div className="ltr" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(n, 6)}, minmax(0, 1fr))`, gap: 6, marginTop: 12 }}>
        {Array.from({ length: n }, (_, k) => (
          <div key={k} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '4px 6px', fontSize: 12.5, background: k === ra || k === rb ? 'var(--bg-sunk)' : 'var(--bg)' }}>
            <b>[{k}]</b> {range.filter((x) => mod(x, n) === k).join(', ')}
          </div>
        ))}
      </div>
      <div className="controls" style={{ marginTop: 12, marginBottom: 6 }}>
        <span>جدول بمقياس <Tex>n</Tex>:</span>
        <button className="btn" aria-pressed={table === 'none'} onClick={() => setTable('none')}>بلا جدول</button>
        <button className="btn" aria-pressed={table === 'add'} onClick={() => setTable('add')}>الجمع</button>
        <button className="btn" aria-pressed={table === 'mul'} onClick={() => setTable('mul')}>الضرب</button>
      </div>
      {table !== 'none' && (
        <div className="ltr" style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '3px 7px', color: 'var(--ink-3)' }}>{table === 'add' ? '+' : '×'}</th>
                {Array.from({ length: n }, (_, j) => <th key={j} style={{ padding: '3px 7px' }}>{j}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: n }, (_, i) => (
                <tr key={i}>
                  <th style={{ padding: '3px 7px' }}>{i}</th>
                  {Array.from({ length: n }, (_, j) => {
                    const v = mod(table === 'add' ? i + j : i * j, n);
                    return <td key={j} style={{ padding: '3px 7px', textAlign: 'center', border: '1px solid var(--line)', background: v === 0 ? 'var(--bg-sunk)' : undefined }}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
