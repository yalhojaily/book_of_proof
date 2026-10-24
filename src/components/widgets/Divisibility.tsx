import { useState, type ReactNode } from 'react';
import { Shell, Tex } from './Shell';

const divisors = (n: number) => {
  const a = Math.abs(n);
  if (a === 0) return null; // every integer divides 0
  const out: number[] = [];
  for (let d = 1; d <= a; d++) if (a % d === 0) out.push(d);
  return out;
};
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Unpack the definitions of 4.2 for concrete numbers: even/odd, a | b, prime, gcd, lcm. */
export default function Divisibility() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(24);
  const dA = divisors(a);
  const dB = divisors(b);
  const g = a === 0 && b === 0 ? null : gcd(a, b);
  const l = a !== 0 && b !== 0 ? Math.abs(a * b) / gcd(a, b) : null;
  const divides = a !== 0 ? b % a === 0 : b === 0;
  const parity = (n: number) => (n % 2 === 0 ? `${n} = 2 \\cdot ${n / 2}` : `${n} = 2 \\cdot ${(n - 1) / 2} + 1`);
  const isPrime = (n: number) => n > 1 && (divisors(n)?.length ?? 0) === 2;
  const num = (label: string, v: number, set: (n: number) => void) => (
    <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Tex>{label}</Tex>
      <input type="number" value={v} min={-60} max={120} onChange={(e) => set(Math.max(-60, Math.min(120, Math.trunc(+e.target.value || 0))))} style={{ width: 80, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
    </label>
  );

  const row = (title: ReactNode, content: ReactNode, ok?: boolean) => (
    <div className="result-row" style={{ alignItems: 'center' }}>
      <b style={{ minWidth: 120 }}>{title}</b>
      {ok !== undefined && <span className={ok ? 'pill-ok' : 'pill-bad'}>{ok ? 'نعم' : 'لا'}</span>}
      {content}
    </div>
  );

  return (
    <Shell title="فكّ التعريفات: أعداد حقيقية في قوالب التعريف" foot="اختر عددين صحيحين، وانظر كيف ينطبق كل تعريف عليهما. لاحظ أن التعريف يعطيك دائماً معادلة تستطيع العمل بها.">
      <div className="controls" style={{ gap: 18 }}>
        {num('a =', a, setA)}
        {num('b =', b, setB)}
      </div>
      {row('زوجي أم فردي؟', <span className="ltr"><Tex>{parity(a)}</Tex>{'   '}<Tex>{parity(b)}</Tex></span>)}
      {row(
        <>هل <Tex>{'a \\mid b'}</Tex>؟</>,
        divides ? (
          a === 0 ? <span><Tex>{'0 \\mid 0'}</Tex> لأن <Tex>{'0 = 0 \\cdot c'}</Tex></span> : <Tex>{`${b} = ${a} \\cdot ${b / a}`}</Tex>
        ) : (
          <span>لا يوجد عدد صحيح <Tex>c</Tex> بحيث <Tex>{`${b} = ${a} \\cdot c`}</Tex>{a !== 0 && <> (<Tex>{`${b} / ${a} = ${(b / a).toFixed(2)}`}</Tex> ليس صحيحاً)</>}</span>
        ),
        divides
      )}
      {row(
        'القواسم الموجبة',
        <div className="ltr" style={{ display: 'grid', gap: 4 }}>
          {[['a', a, dA, dB], ['b', b, dB, dA]].map(([nm, v, d, other]) => (
            <div key={nm as string} style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <Tex>{`${nm} = ${v}:`}</Tex>
              {d === null ? <span className="muted">كل الأعداد الصحيحة تقسم 0</span> : (d as number[]).map((x) => (
                <span key={x} className="chip" style={{ height: 26, minWidth: 28, cursor: 'default', ...((other === null || (other as number[]).includes(x)) ? { background: 'var(--shade-fill)', borderColor: 'var(--amber)' } : {}) }}>{x}</span>
              ))}
            </div>
          ))}
        </div>
      )}
      {row('أولي؟', <span>{[a, b].map((n) => <span key={n} style={{ marginInlineEnd: 12 }}><Tex>{`${n}`}</Tex>: {isPrime(n) ? 'أولي' : n === 1 ? 'ليس أولياً ولا مؤلفاً' : n > 1 ? 'مؤلّف' : 'التعريف للأعداد الطبيعية فقط'}</span>)}</span>)}
      {row('gcd و lcm', <span className="ltr"><Tex>{g === null ? '\\gcd(0,0) \\text{ undefined}' : `\\gcd(${a}, ${b}) = ${g}`}</Tex>{'   '}<Tex>{l === null ? '\\text{lcm needs non-zero}' : `\\operatorname{lcm}(${a}, ${b}) = ${l}`}</Tex></span>)}
      <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>القواسم المشتركة مظللة، وأكبرها هو القاسم المشترك الأكبر.</p>
    </Shell>
  );
}
