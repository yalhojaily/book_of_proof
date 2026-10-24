import { useState } from 'react';
import { Shell, Tex } from './Shell';

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
function factor(n: number): number[] {
  const out: number[] = [];
  for (let d = 2; d * d <= n; d++) while (n % d === 0) { out.push(d); n /= d; }
  if (n > 1) out.push(n);
  return out;
}

/** Euclid: pretend the list is all the primes, build N = product + 1, and find a prime outside the list. */
export default function EuclidPrimes() {
  const [n, setN] = useState(4);
  const list = PRIMES.slice(0, n);
  const N = list.reduce((x, y) => x * y, 1) + 1;
  const fs = factor(N);
  const isPrime = fs.length === 1;

  return (
    <Shell title="إقليدس: قائمة الأعداد الأولية لا تكتمل أبداً" foot="افترض أن القائمة هي كل الأعداد الأولية. العدد N يبقى منه 1 عند القسمة على كل عدد فيها، فلا يقسمه أي منها. لكن لـ N قاسماً أولياً، فهذا القاسم خارج القائمة: تناقض.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={1} max={10} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <p style={{ margin: '0 0 6px' }}>«كل» الأعداد الأولية (افتراضاً):</p>
      <div className="ltr" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {list.map((p) => <span key={p} className="chip" style={{ cursor: 'default' }}>{p}</span>)}
      </div>
      <div className="result-row"><Tex>{`N = ${list.join(' \\cdot ')} + 1 = ${N.toLocaleString('en-US').replace(/,/g, '{,}')}`}</Tex></div>
      <div className="ltr" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))', gap: 6, margin: '10px 0' }}>
        {list.map((p) => (
          <div key={p} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '4px 8px', fontSize: 14, background: 'var(--bg)' }}>
            <Tex>{`N \\bmod ${p} = ${N % p}`}</Tex>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--red-soft)' }}>
        <b style={{ color: 'var(--red)' }}>التناقض:</b> لا يقسم <Tex>N</Tex> أي عدد في القائمة، لكن{' '}
        {isPrime ? (
          <><Tex>N</Tex> نفسه أولي، وهو ليس في القائمة.</>
        ) : (
          <><Tex>{`N = ${fs.join(' \\cdot ')}`}</Tex>، وقواسمه الأولية {[...new Set(fs)].map((f, i) => <span key={f}>{i > 0 && ' و'}<Tex>{String(f)}</Tex></span>)} ليست في القائمة.</>
        )}
      </div>
      {!isPrime && (
        <p className="muted" style={{ margin: '8px 0 0', fontSize: 14 }}>
          لاحظ: <Tex>N</Tex> ليس أولياً هنا. البرهان لا يقول إن <Tex>N</Tex> أولي، بل إن له قاسماً أولياً خارج القائمة. هذا خطأ شائع في فهم البرهان.
        </p>
      )}
    </Shell>
  );
}
