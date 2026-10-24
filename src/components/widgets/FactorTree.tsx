import { useState } from 'react';
import { Shell, Tex } from './Shell';

const smallest = (n: number) => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
const pairs = (n: number) => { const out: [number, number][] = []; for (let d = 2; d * d <= n; d++) if (n % d === 0) out.push([d, n / d]); return out; };
type T = { v: number; kids?: [T, T] };
function build(n: number, first?: [number, number]): T {
  const p = first ?? (smallest(n) === n ? null : ([smallest(n), n / smallest(n)] as [number, number]));
  if (!p) return { v: n };
  return { v: n, kids: [build(p[0]), build(p[1])] };
}
const leaves = (t: T): number[] => (t.kids ? [...leaves(t.kids[0]), ...leaves(t.kids[1])] : [t.v]);

function Node({ t }: { t: T }) {
  const prime = !t.kids;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span className="chip" style={{ cursor: 'default', background: prime ? 'var(--green-soft)' : undefined, borderColor: prime ? 'var(--green)' : undefined, fontWeight: 700 }}>{t.v}</span>
      {t.kids && (
        <div style={{ display: 'flex', gap: 10, marginTop: 4, paddingTop: 10, borderTop: '1.5px solid var(--line-strong)' }}>
          <Node t={t.kids[0]} />
          <Node t={t.kids[1]} />
        </div>
      )}
    </div>
  );
}

/** Existence by strong induction: n is prime, or n = ab with smaller a, b that already factor. Uniqueness: every way of splitting ends with the same primes. */
export default function FactorTree() {
  const [n, setN] = useState(360);
  const [pi, setPi] = useState(0);
  const sn = Math.max(2, Math.min(100000, Math.trunc(n) || 2));
  const ps = pairs(sn);
  const first = ps[Math.min(pi, ps.length - 1)];
  const tree = build(sn, first);
  const ls = leaves(tree).sort((a, b) => a - b);
  return (
    <Shell title="شجرة العوامل: الوجود والوحدانية" foot="الوجود (استقراء قوي): إما أن يكون n أولياً، أو ⁦n = ab⁩ مع a وb أصغر منه، ولكل منهما تحليل بالفرض. الوحدانية: غيّر أول تقسيم كما تشاء، فالأعداد الأولية في الأوراق هي نفسها دائماً.">
      <div className="controls">
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>العدد:</span>
          <input type="number" dir="ltr" min={2} value={n} onChange={(e) => { setN(+e.target.value); setPi(0); }} style={{ width: 110, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
        </label>
      </div>
      {ps.length > 0 ? (
        <div className="controls">
          <span>أول تقسيم:</span>
          {ps.map(([a, b], i) => (
            <button key={a} className="chip ltr" aria-pressed={i === Math.min(pi, ps.length - 1)} onClick={() => setPi(i)}>{a} × {b}</button>
          ))}
        </div>
      ) : (
        <p className="muted">{sn} عدد أولي: هو نفسه تحليله.</p>
      )}
      <div className="ltr" style={{ overflowX: 'auto', padding: '6px 0' }}>
        <div style={{ display: 'inline-flex', minWidth: '100%', justifyContent: 'center' }}><Node t={tree} /></div>
      </div>
      <div className="result-row"><Tex>{`${sn} = ${ls.join(' \\cdot ')}`}</Tex></div>
    </Shell>
  );
}
