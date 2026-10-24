import { useState } from 'react';
import { Shell, Tex } from './Shell';

const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const smallest = (n: number) => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };

interface Conj { tex: string; f: (n: number) => number; from: number; label: string; ftex: (n: number) => string; note: string }
const CONJ: Conj[] = [
  { tex: String.raw`\forall n \in \mathbb{Z},\ n^2 - n + 11 \text{ is prime}`, f: (n) => n * n - n + 11, from: 0, label: 'n² − n + 11', ftex: (n) => `${n}^2 - ${n} + 11`, note: 'مثال الكتاب (9.1).' },
  { tex: String.raw`\forall n \in \mathbb{N},\ n^2 + n + 41 \text{ is prime}`, f: (n) => n * n + n + 41, from: 1, label: 'n² + n + 41', ftex: (n) => `${n}^2 + ${n} + 41`, note: 'كثيرة حدود أويلر: تصمد طويلاً جداً.' },
  { tex: String.raw`n \text{ prime} \Rightarrow 2^n - 1 \text{ is prime}`, f: (n) => 2 ** n - 1, from: 2, label: '2ⁿ − 1 (n أولي)', ftex: (n) => `2^{${n}} - 1`, note: 'نجرّب الأعداد الأولية n فقط، فالمقدَّم يجب أن يصدق.' },
  { tex: String.raw`\forall n \ge 0,\ 2^{2^n} + 1 \text{ is prime}`, f: (n) => 2 ** (2 ** n) + 1, from: 0, label: '2^(2ⁿ) + 1', ftex: (n) => `2^{2^{${n}}} + 1`, note: 'خمّن فيرما أنها صحيحة. احتاج العالم نحو مئة سنة حتى وجد أويلر المثال المضاد.' },
];

/** Values look prime again and again… until they don't. One failure disproves a universal claim. */
export default function CounterexampleHunter() {
  const [ci, setCi] = useState(0);
  const [upto, setUpto] = useState(6);
  const c = CONJ[ci];
  const domain: number[] = [];
  for (let n = c.from; domain.length < upto + 1 && n < 200; n++) if (ci !== 2 || isPrime(n)) domain.push(n);
  const vals = domain.map((n) => ({ n, v: c.f(n) })).filter((x) => Number.isSafeInteger(x.v));
  const firstBad = vals.find((x) => !isPrime(x.v));
  const findIt = () => {
    for (let k = 1; k < 80; k++) {
      const ds: number[] = [];
      for (let n = c.from; ds.length < k + 1 && n < 200; n++) if (ci !== 2 || isPrime(n)) ds.push(n);
      const last = ds[ds.length - 1];
      if (!Number.isSafeInteger(c.f(last))) break;
      if (!isPrime(c.f(last))) { setUpto(k); return; }
    }
  };
  return (
    <Shell title="صيّاد الأمثلة المضادة" foot="مهما كثرت الأمثلة الصحيحة فهي لا تبرهن عبارة «لكل». لكن مثالاً واحداً يفشل يدحضها، بشرط أن تبيّن بوضوح لماذا يفشل (هنا: بإظهار قاسم).">
      <div className="controls">
        {CONJ.map((x, i) => (
          <button key={i} className="chip ltr" aria-pressed={i === ci} onClick={() => { setCi(i); setUpto(5); }}>{x.label}</button>
        ))}
      </div>
      <div style={{ textAlign: 'center', overflowX: 'auto' }}><Tex>{c.tex}</Tex></div>
      <p className="muted" style={{ textAlign: 'center', margin: '4px 0 8px', fontSize: 14 }}>{c.note}</p>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {vals.map(({ n, v }) => {
          const p = isPrime(v);
          return (
            <div key={n} style={{ border: `1.5px solid ${p ? 'var(--line)' : 'var(--red)'}`, background: p ? 'var(--bg)' : 'var(--red-soft)', borderRadius: 8, padding: '3px 8px', fontSize: 13, textAlign: 'center', minWidth: 54 }}>
              <div className="muted">n = {n}</div>
              <b style={{ color: p ? 'var(--ink)' : 'var(--red)' }}>{v.toLocaleString('en-US')}</b>
            </div>
          );
        })}
      </div>
      <div className="controls" style={{ marginTop: 10 }}>
        <button className="btn" onClick={() => setUpto(upto + 1)}>جرّب قيمة أخرى</button>
        <button className="btn" onClick={findIt}>ابحث عن مثال مضاد</button>
      </div>
      <div style={{ padding: '8px 12px', borderRadius: 10, background: firstBad ? 'var(--red-soft)' : 'var(--green-soft)' }}>
        {firstBad ? (
          <><b style={{ color: 'var(--red)' }}>دُحضت.</b> عند <Tex>{`n = ${firstBad.n}`}</Tex>: <Tex>{`${c.ftex(firstBad.n)} = ${firstBad.v} = ${smallest(firstBad.v)} \\cdot ${firstBad.v / smallest(firstBad.v)}`}</Tex>، وهو ليس أولياً.</>
        ) : (
          <>كل القيم حتى الآن أولية ({vals.length}). هل هذا يبرهن العبارة؟ <b>لا.</b> واصل.</>
        )}
      </div>
    </Shell>
  );
}
