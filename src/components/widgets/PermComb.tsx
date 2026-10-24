import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { subsets, permutations, perm, choose, fact, fmt } from '@/lib/comb';

const ALPHA = ['a', 'b', 'c', 'd', 'e', 'f'];

/**
 * k-permutations grouped by the subset they use: each row is one k-element subset and
 * its k! orderings. So P(n,k) = C(n,k) · k!, i.e. C(n,k) = P(n,k) / k!.
 */
export default function PermComb({ mode = 'both' }: { mode?: 'perm' | 'both' }) {
  const [n, setN] = useState(4);
  const [k, setK] = useState(2);
  const [grouped, setGrouped] = useState(mode === 'both');
  const X = ALPHA.slice(0, n);
  const subs = subsets(X, Math.min(k, n));
  const P = perm(n, k);
  const C = choose(n, k);
  const showAll = P <= 120n;

  return (
    <Shell
      title={mode === 'perm' ? 'التباديل: ترتيب k عنصراً من n' : 'من التباديل إلى التوافيق'}
      foot={mode === 'perm' ? 'كل قائمة دون تكرار من k عنصراً هي «k-تبديل». عددها P(n, k).' : 'فعّل التجميع: كل سطر مجموعة جزئية واحدة، ومعها كل ترتيباتها. عدد السطور هو C(n, k)، وفي كل سطر k! ترتيباً.'}
    >
      <div className="controls" style={{ gap: 16 }}>
        <label className="ltr" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={1} max={6} value={n} onChange={(e) => { const v = +e.target.value; setN(v); if (k > v) setK(v); }} />
        </label>
        <label className="ltr" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`k = ${k}`}</Tex>
          <input type="range" min={0} max={n} value={k} onChange={(e) => setK(+e.target.value)} />
        </label>
        {mode === 'both' && (
          <>
            <button className="btn" aria-pressed={grouped} onClick={() => setGrouped(true)}>جمّع حسب المجموعة</button>
            <button className="btn" aria-pressed={!grouped} onClick={() => setGrouped(false)}>قائمة واحدة</button>
          </>
        )}
      </div>
      <p className="ltr" style={{ textAlign: 'center', margin: '0 0 8px' }}><Tex>{`X = \\{${X.join(', ')}\\}`}</Tex></p>
      {showAll ? (
        <div className="ltr" style={{ display: 'grid', gap: 5, fontFamily: 'ui-monospace, monospace', maxHeight: 340, overflowY: 'auto', padding: 4 }}>
          {grouped ? (
            subs.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ minWidth: 92, fontWeight: 700, color: 'var(--set-b)', fontFamily: 'var(--font-ui)' }}><Tex>{s.length ? `\\{${s.join(',')}\\}` : '\\varnothing'}</Tex></span>
                <span style={{ color: 'var(--ink-3)' }}>→</span>
                {permutations(s).map((p, j) => (
                  <span key={j} style={{ padding: '1px 7px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--set-a-fill)' }}>{p.join('') || '( )'}</span>
                ))}
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {subs.flatMap((s) => permutations(s)).map((p, j) => (
                <span key={j} style={{ padding: '1px 7px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--set-a-fill)' }}>{p.join('') || '( )'}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="muted" style={{ textAlign: 'center' }}>العدد كبير للعرض. صغّر n أو k.</p>
      )}
      <div style={{ marginTop: 10 }}>
        <div className="result-row" style={{ justifyContent: 'center' }}>
          <Tex>{`P(${n}, ${k}) = \\frac{${n}!}{(${n}-${k})!} = ${fmt(P)}`}</Tex>
          <span className="muted">قائمة دون تكرار</span>
        </div>
        {mode === 'both' && (
          <div className="result-row" style={{ justifyContent: 'center' }}>
            <Tex>{`\\binom{${n}}{${k}} = \\frac{P(${n},${k})}{${k}!} = \\frac{${fmt(P)}}{${fmt(fact(k))}} = ${fmt(C)}`}</Tex>
            <span className="muted">مجموعة جزئية (الترتيب لا يهم)</span>
          </div>
        )}
      </div>
    </Shell>
  );
}
