import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { subsets, choose, fmt } from '@/lib/comb';

/**
 * Combinatorial proof of Pascal's rule: the k-subsets of {0,…,n} split into those that
 * contain 0 (C(n,k−1) of them) and those that don't (C(n,k)).
 */
export default function SubsetSplit() {
  const [n, setN] = useState(4);
  const [k, setK] = useState(2);
  const S = Array.from({ length: n + 1 }, (_, i) => i);
  const all = subsets(S, k);
  const withZero = all.filter((s) => s.includes(0));
  const without = all.filter((s) => !s.includes(0));
  const Col = ({ title, items, tex, color }: { title: string; items: number[][]; tex: string; color: string }) => (
    <div style={{ flex: '1 1 220px', border: `2px solid ${color}`, borderRadius: 12, padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 }}>
        <b style={{ fontSize: 14.5 }}>{title}</b>
        <span><Tex>{tex}</Tex></span>
      </div>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontFamily: 'ui-monospace, monospace', fontSize: 13.5 }}>
        {items.map((s, i) => (
          <span key={i} style={{ padding: '1px 6px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--bg)' }}>
            {s.map((x, j) => <span key={j} style={{ color: x === 0 ? 'var(--set-b)' : undefined, fontWeight: x === 0 ? 800 : 500 }}>{j ? ',' : '{'}{x}</span>)}{'}'}
          </span>
        ))}
        {items.length === 0 && <span className="muted">لا شيء</span>}
      </div>
    </div>
  );
  return (
    <Shell title="برهان توافقي: عدّ الشيء نفسه بطريقتين" foot="كل مجموعة جزئية من k عناصر إما تحتوي 0 أو لا تحتويه. العدّان معاً يعطيان العدد الكلي، وهذا هو برهان قاعدة باسكال.">
      <div className="controls" style={{ gap: 16 }}>
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={1} max={6} value={n} onChange={(e) => { const v = +e.target.value; setN(v); if (k > v + 1) setK(v + 1); }} />
        </label>
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`k = ${k}`}</Tex>
          <input type="range" min={0} max={n + 1} value={k} onChange={(e) => setK(+e.target.value)} />
        </label>
      </div>
      <p className="ltr" style={{ textAlign: 'center', margin: '0 0 8px' }}>
        <Tex>{`S = \\{${S.join(', ')}\\},\\quad |S| = ${n + 1}`}</Tex>
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Col title="تحتوي 0" items={withZero} tex={`\\binom{${n}}{${k - 1}} = ${fmt(choose(n, k - 1))}`} color="var(--set-b)" />
        <Col title="لا تحتوي 0" items={without} tex={`\\binom{${n}}{${k}} = ${fmt(choose(n, k))}`} color="var(--set-a)" />
      </div>
      <div className="result-row" style={{ justifyContent: 'center', marginTop: 10, fontSize: '1.1em' }}>
        <Tex>{`\\binom{${n + 1}}{${k}} = ${fmt(choose(n + 1, k))} = ${fmt(choose(n, k - 1))} + ${fmt(choose(n, k))} = \\binom{${n}}{${k - 1}} + \\binom{${n}}{${k}}`}</Tex>
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '4px 0 0' }}>
        لنصنع مجموعة تحتوي 0 نختار {k > 0 ? k - 1 : 0} عناصر أخرى من {n}، ولنصنع مجموعة لا تحتويه نختار {k} من {n}.
      </p>
    </Shell>
  );
}
