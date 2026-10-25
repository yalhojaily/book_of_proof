import { useMemo, useState } from 'react';
import { Shell, Tex } from './Shell';

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}
const ROWS = 8;

/** Any list of numbers in ⁦(0, 1)⁩ misses the number built by changing the n-th digit of the n-th number. */
export default function CantorDiagonal() {
  const [seed, setSeed] = useState(3);
  const [step, setStep] = useState(ROWS);
  const digits = useMemo(() => {
    const r = rng(seed * 7919 + 1);
    return Array.from({ length: ROWS }, () => Array.from({ length: ROWS + 2 }, () => Math.floor(r() * 10)));
  }, [seed]);
  const diag = digits.map((row, i) => row[i]);
  const change = (d: number) => (d === 1 ? 2 : 1); // the book's rule avoids 0s and 9s
  const b = diag.map(change);
  return (
    <Shell title="حجة كانتور القطرية" foot="افترض أن كل أعداد الفترة ⁦(0, 1)⁩ مرتبة في قائمة f(1)، f(2)، …. نبني عدداً b يختلف عن f(n) في الخانة رقم n: إذا كانت الخانة 1 نكتب 2، وإلا نكتب 1. إذن b يختلف عن كل عدد في القائمة، فالقائمة ناقصة دائماً.">
      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontFamily: 'monospace', fontSize: 15 }}>
          <tbody>
            {digits.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: '2px 8px', color: 'var(--ink-3)', fontFamily: 'inherit' }}>f({i + 1}) =</td>
                <td style={{ padding: '2px 0' }}>0.</td>
                {row.map((d, j) => (
                  <td key={j} style={{ padding: '2px 3px', textAlign: 'center', background: i === j && i < step ? 'var(--shade-fill)' : undefined, fontWeight: i === j ? 700 : 400, color: j > ROWS - 1 ? 'var(--ink-3)' : undefined }}>{d}</td>
                ))}
                <td style={{ padding: '2px 4px', color: 'var(--ink-3)' }}>…</td>
              </tr>
            ))}
            <tr><td colSpan={ROWS + 4} style={{ padding: '2px 8px', color: 'var(--ink-3)' }}>⋮</td></tr>
            <tr style={{ borderTop: '2px solid var(--ink)' }}>
              <td style={{ padding: '4px 8px', color: 'var(--violet)', fontWeight: 700, fontFamily: 'inherit' }}>b =</td>
              <td>0.</td>
              {b.map((d, j) => <td key={j} style={{ padding: '4px 3px', textAlign: 'center', color: 'var(--violet)', fontWeight: 700 }}>{j < step ? d : '?'}</td>)}
              <td colSpan={3} style={{ padding: '2px 4px', color: 'var(--ink-3)' }}>…</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="controls" style={{ marginTop: 8 }}>
        <button className="btn" onClick={() => setStep(0)}>من البداية</button>
        <button className="btn" disabled={step >= ROWS} onClick={() => setStep(step + 1)}>الخانة التالية</button>
        <button className="btn" onClick={() => { setSeed(seed + 1); setStep(ROWS); }}>قائمة أخرى</button>
      </div>
      {step > 0 && (
        <p style={{ margin: 0 }}>
          الخانة {step} من <Tex>{`f(${step})`}</Tex> هي <b>{diag[step - 1]}</b>، فنكتب في <Tex>b</Tex> الرقم <b style={{ color: 'var(--violet)' }}>{b[step - 1]}</b>. إذن <Tex>{`b \\neq f(${step})`}</Tex>.
        </p>
      )}
    </Shell>
  );
}
