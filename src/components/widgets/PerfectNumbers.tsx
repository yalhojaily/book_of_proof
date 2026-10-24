import { useState } from 'react';
import { Shell, Tex } from './Shell';

const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const fmt = (n: number) => n.toLocaleString('en-US');
function divisors(n: number): number[] {
  const small: number[] = [], big: number[] = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) { small.push(d); if (d * d !== n) big.unshift(n / d); }
  return [...small, ...big];
}

/** Euclid's recipe 2^(n−1)(2^n − 1) and a checker for any number. */
export default function PerfectNumbers() {
  const [n, setN] = useState(3);
  const [m, setM] = useState(28);
  const mer = 2 ** n - 1;
  const prime = isPrime(mer);
  const p = 2 ** (n - 1) * mer;
  const ds = prime ? divisors(p) : [];
  const proper = ds.filter((d) => d < p);
  const sm = Math.max(1, Math.min(10_000_000, Math.trunc(m) || 1));
  const dm = divisors(sm).filter((d) => d < sm);
  const sum = dm.reduce((x, y) => x + y, 0);
  const kind = sum === sm ? 'تام' : sum > sm ? 'زائد (مجموع قواسمه أكبر منه)' : 'ناقص (مجموع قواسمه أقل منه)';

  return (
    <Shell title="الأعداد التامة: وصفة إقليدس" foot="إذا كان ⁦2ⁿ − 1⁩ أولياً فإن ⁦2ⁿ⁻¹(2ⁿ − 1)⁩ عدد تام (المبرهنة 8.1)، وكل عدد تام زوجي على هذه الصورة (المبرهنة 8.2). أما الأعداد التامة الفردية فلا يعرف أحد إن كانت موجودة.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={1} max={13} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <div className="result-row"><Tex>{`2^{${n}} - 1 = ${mer}`}</Tex> {prime ? <span className="pill-ok">أولي</span> : <span className="pill-bad">ليس أولياً{mer > 1 ? `: ${divisors(mer)[1]} يقسمه` : ''}</span>}</div>
      {prime ? (
        <>
          <div className="result-row"><Tex>{`p = 2^{${n - 1}}\\,(2^{${n}} - 1) = ${2 ** (n - 1)} \\cdot ${mer} = ${fmt(p).replace(/,/g, '{,}')}`}</Tex></div>
          <p style={{ margin: '8px 0 4px' }}>قواسم <Tex>p</Tex> الأصغر منه: صف قوى 2، وصف قوى 2 مضروبة في <Tex>{String(mer)}</Tex>:</p>
          <div className="ltr" style={{ fontSize: 13.5, lineHeight: 1.9 }}>
            <div>{proper.filter((d) => mer === 1 || d % mer !== 0).map(fmt).join(' + ')}</div>
            <div style={{ color: 'var(--violet)' }}>{proper.filter((d) => mer > 1 && d % mer === 0).map(fmt).join(' + ') || '—'}</div>
          </div>
          <div className="result-row" style={{ marginTop: 6 }}><Tex>{`\\text{sum} = ${fmt(proper.reduce((x, y) => x + y, 0)).replace(/,/g, '{,}')} = p`}</Tex> <span className="pill-ok">تام</span></div>
        </>
      ) : (
        <p className="muted" style={{ margin: '8px 0 0' }}>الوصفة لا تعمل هنا لأن <Tex>{`2^{${n}} - 1`}</Tex> ليس أولياً. جرّب n = 2، 3، 5، 7، 13.</p>
      )}
      <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '14px 0' }} />
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>افحص أي عدد:</span>
        <input type="number" min={1} dir="ltr" value={m} onChange={(e) => setM(+e.target.value)} style={{ width: 130, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
      </label>
      <div className="ltr" style={{ fontSize: 13.5, margin: '6px 0', overflowWrap: 'anywhere' }}>{dm.length > 40 ? `${dm.slice(0, 40).join(' + ')} + …` : dm.join(' + ') || '—'} = {fmt(sum)}</div>
      <p style={{ margin: 0 }}>العدد <b className="ltr" style={{ display: 'inline-block' }}>{fmt(sm)}</b> {kind}.</p>
    </Shell>
  );
}
