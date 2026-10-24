import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { Rich } from './QuickCheck';

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const BEST: [number, number][] = [[3, 2], [7, 5], [17, 12], [41, 29], [99, 70], [239, 169], [577, 408]];

const CHAIN = [
  { t: String.raw`افترض أن $\sqrt{2} = \frac{a}{b}$، والكسر مختزل تماماً: $a$ و$b$ ليسا زوجيين معاً.`, c: 'var(--violet)' },
  { t: String.raw`بالتربيع: $a^2 = 2b^2$، إذن $a^2$ زوجي.`, c: 'var(--ink)' },
  { t: String.raw`إذن $a$ زوجي (تمرين 1 من الفصل 5)، فـ $a = 2c$.`, c: 'var(--ink)' },
  { t: String.raw`وبما أن الكسر مختزل، فإن $b$ فردي.`, c: 'var(--set-b)' },
  { t: String.raw`بالتعويض: $4c^2 = 2b^2$، أي $b^2 = 2c^2$، فـ $b^2$ زوجي.`, c: 'var(--ink)' },
  { t: String.raw`إذن $b$ زوجي.`, c: 'var(--set-b)' },
  { t: String.raw`$b$ زوجي و$b$ فردي معاً: تناقض. إذن الافتراض الأول كاذب، و$\sqrt{2}$ غير نسبي.`, c: 'var(--red)' },
];

/** Try to hit √2 with a fraction; see a² − 2b² never reach 0, then walk the parity contradiction. */
export default function SqrtTwoHunt() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(5);
  const [step, setStep] = useState(0);
  const sa = Math.max(1, Math.min(99999, a));
  const sb = Math.max(1, Math.min(99999, b));
  const diff = sa * sa - 2 * sb * sb;
  const q = sa / sb;
  const g = gcd(sa, sb);
  const field = (v: number, set: (x: number) => void, label: string) => (
    <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Tex>{label}</Tex>
      <input type="number" min={1} value={v} onChange={(e) => set(Math.trunc(+e.target.value || 1))} style={{ width: 90, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
    </label>
  );

  return (
    <Shell title="اصطد ⁦√2⁩ بكسر" foot="الكسور الجيدة تقترب من ⁦√2⁩ كثيراً، لكن الفرق ⁦a² − 2b²⁩ لا يصل إلى الصفر أبداً. التجربة لا تبرهن ذلك، والبرهان بالتناقض أدناه يبرهنه لكل الكسور دفعة واحدة.">
      <div className="controls" style={{ gap: 14 }}>
        {field(a, setA, 'a =')}
        {field(b, setB, 'b =')}
      </div>
      <div className="controls" style={{ marginTop: -4 }}>
        <span className="muted" style={{ fontSize: 14 }}>كسور جيدة:</span>
        {BEST.map(([x, y]) => (
          <button key={x} className="chip ltr" onClick={() => { setA(x); setB(y); }} aria-pressed={x === sa && y === sb}>{x}/{y}</button>
        ))}
      </div>
      <div className="result-row"><Tex>{String.raw`\left(\tfrac{${sa}}{${sb}}\right)^2 = ${(q * q).toFixed(10)}`}</Tex></div>
      <div className="result-row"><Tex>{String.raw`\tfrac{${sa}}{${sb}} - \sqrt{2} = ${(q - Math.SQRT2).toExponential(3).replace('e', String.raw`\times 10^{`) + '}'}`}</Tex></div>
      <div className="result-row"><Tex>{`a^2 - 2b^2 = ${sa * sa} - ${2 * sb * sb} = ${diff}`}</Tex></div>
      <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 10, background: diff === 0 ? 'var(--green-soft)' : 'var(--red-soft)' }}>
        {diff === 0 ? 'وجدته؟! (لن يحدث.)' : <>لم يصل إلى الصفر: <Tex>{`a^2 \\neq 2b^2`}</Tex>{Math.abs(diff) === 1 && '، والفرق ±1 هو أصغر ما يمكن'}.</>}
        {g > 1 && <> والكسر غير مختزل: <Tex>{String.raw`\tfrac{${sa}}{${sb}} = \tfrac{${sa / g}}{${sb / g}}`}</Tex>.</>}
      </div>

      <h5 style={{ margin: '16px 0 6px' }}>لماذا لا يصل أبداً؟ البرهان خطوة خطوة</h5>
      <ol style={{ margin: 0, paddingInlineStart: 22, display: 'grid', gap: 4 }}>
        {CHAIN.slice(0, step + 1).map((s, i) => (
          <li key={i} style={{ color: s.c, fontWeight: i === step ? 600 : 400 }}><Rich text={s.t} /></li>
        ))}
      </ol>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
        <button className="btn" disabled={step >= CHAIN.length - 1} onClick={() => setStep(step + 1)}>الخطوة التالية</button>
        <button className="btn" onClick={() => setStep(0)}>من البداية</button>
      </div>
    </Shell>
  );
}
