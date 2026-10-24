import { useState } from 'react';
import { Shell, Tex } from './Shell';

const BASE: Record<number, [number, number]> = { 8: [1, 1], 9: [3, 0], 10: [0, 2] };

/** Strong induction: n¢ comes from (n − 3)¢ plus one 3¢ stamp, all the way back to 8, 9 or 10. */
export default function StampChain() {
  const [n, setN] = useState(23);
  const chain: number[] = [];
  let m = n;
  while (m > 10) { chain.push(m); m -= 3; }
  chain.push(m);
  const [b3, b5] = BASE[m];
  const threes = b3 + (chain.length - 1);
  const stamp = (v: 3 | 5, k: number, extra = false) => (
    <span key={k} style={{ display: 'inline-grid', placeItems: 'center', width: 30, height: 36, margin: 2, borderRadius: 4, border: `2px dashed ${v === 3 ? 'var(--set-a)' : 'var(--violet)'}`, background: extra ? 'var(--amber-soft)' : 'var(--bg)', fontWeight: 700, fontSize: 13, color: v === 3 ? 'var(--set-a)' : 'var(--violet)' }}>{v}¢</span>
  );
  return (
    <Shell title="طوابع 3¢ و5¢: استقراء قوي" foot="لنصل إلى n نعود ثلاث خطوات إلى ⁦n − 3⁩، لا خطوة واحدة. لهذا نحتاج فرضاً عن عبارة أقدم من ⁦Sₖ⁩ (استقراء قوي)، ونحتاج ثلاث حالات أساس: 8 و9 و10.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={8} max={50} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', justifyContent: 'center', margin: '6px 0 10px' }}>
        {chain.map((c, i) => (
          <span key={c} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <span className="chip" style={{ cursor: 'default', background: i === chain.length - 1 ? 'var(--green-soft)' : undefined, borderColor: i === chain.length - 1 ? 'var(--green)' : undefined }}>{c}¢</span>
            {i < chain.length - 1 && <span className="muted">→ −3 →</span>}
          </span>
        ))}
      </div>
      <p style={{ margin: '0 0 6px' }}>
        <b style={{ color: 'var(--green)' }}>{m}¢</b> حالة أساس. ثم نضيف طابع 3¢ في كل خطوة رجوعاً إلى <b>{n}¢</b>:
      </p>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.from({ length: b5 }, (_, k) => stamp(5, k))}
        {Array.from({ length: b3 }, (_, k) => stamp(3, 100 + k))}
        {Array.from({ length: chain.length - 1 }, (_, k) => stamp(3, 200 + k, true))}
      </div>
      <div className="result-row" style={{ marginTop: 8 }}><Tex>{`${n} = ${threes} \\cdot 3 + ${b5} \\cdot 5`}</Tex></div>
    </Shell>
  );
}
