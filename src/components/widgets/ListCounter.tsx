import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { lists, fmt } from '@/lib/comb';

const ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

/**
 * Multiplication principle with boxes: choose alphabet size, list length, repetition.
 * Each box shows how many choices it has; small cases are listed in full.
 */
export default function ListCounter() {
  const [n, setN] = useState(4);
  const [k, setK] = useState(3);
  const [rep, setRep] = useState(false);
  const symbols = ALPHA.slice(0, n);
  const choices = Array.from({ length: k }, (_, i) => (rep ? n : Math.max(0, n - i)));
  const total = choices.reduce((a, b) => a * b, 1);
  const all = total <= 120 ? lists(symbols, k, rep) : [];

  return (
    <Shell title="مبدأ الضرب: كم قائمة يمكن أن نصنع؟" foot="كل صندوق موضع في القائمة، والرقم تحته عدد الخيارات المتاحة له. دون تكرار، كل صندوق يأخذ خياراً أقل من الذي قبله لأن رمزاً قد استُهلك.">
      <div className="controls" style={{ gap: 16 }}>
        <label className="ltr" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`\\text{symbols} = ${n}`}</Tex>
          <input type="range" min={1} max={7} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
        <label className="ltr" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`\\text{length} = ${k}`}</Tex>
          <input type="range" min={1} max={6} value={k} onChange={(e) => setK(+e.target.value)} />
        </label>
        <button className="btn" aria-pressed={rep} onClick={() => setRep(true)}>التكرار مسموح</button>
        <button className="btn" aria-pressed={!rep} onClick={() => setRep(false)}>دون تكرار</button>
      </div>
      <p className="ltr" style={{ textAlign: 'center', margin: '0 0 8px' }}>
        <Tex>{`\\{${symbols.join(', ')}\\}`}</Tex>
      </p>
      <div className="ltr" style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', margin: '6px 0 10px' }}>
        <span style={{ fontSize: 34, color: 'var(--ink-3)', lineHeight: '52px' }}>(</span>
        {choices.map((c, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, border: '2px solid var(--set-a)', background: 'var(--set-a-fill)', display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--set-a)' }}>{i + 1}</div>
            <div style={{ fontSize: 13, marginTop: 4, fontWeight: 700, color: c === 0 ? 'var(--red)' : 'var(--ink)' }}>{c}</div>
          </div>
        ))}
        <span style={{ fontSize: 34, color: 'var(--ink-3)', lineHeight: '52px' }}>)</span>
      </div>
      <div className="result-row" style={{ justifyContent: 'center', fontSize: '1.15em' }}>
        <Tex>{`${choices.join(' \\cdot ')} = ${fmt(total)}${!rep && k <= n ? ` = P(${n}, ${k})` : ''}${rep ? ` = ${n}^{${k}}` : ''}`}</Tex>
      </div>
      {!rep && k > n && <p style={{ textAlign: 'center', color: 'var(--red)', margin: '4px 0' }}>لا يمكن صنع قائمة دون تكرار أطول من عدد الرموز: نفدت الخيارات.</p>}
      {all.length > 0 && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>اعرض كل القوائم ({fmt(total)})</summary>
          <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8, fontFamily: 'ui-monospace, monospace' }}>
            {all.map((l, i) => (
              <span key={i} style={{ padding: '2px 7px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--bg)' }}>{l.join('')}</span>
            ))}
          </div>
        </details>
      )}
      {total > 120 && <p className="muted" style={{ textAlign: 'center', margin: '6px 0 0' }}>العدد كبير لعرض القوائم كلها، وهذا بالضبط سبب حاجتنا إلى مبدأ الضرب.</p>}
    </Shell>
  );
}
