import { useState } from 'react';
import { Shell, Tex } from './Shell';

const PHI = (1 + Math.sqrt(5)) / 2;

/** Fibonacci numbers, the identity F²ₙ₊₁ − Fₙ₊₁Fₙ − F²ₙ = (−1)ⁿ, and the ratio closing in on the golden ratio. */
export default function FibonacciLab() {
  const [n, setN] = useState(10);
  const F = [0, 1, 1];
  for (let i = 3; i <= 41; i++) F.push(F[i - 1] + F[i - 2]);
  const rows = Array.from({ length: n }, (_, i) => i + 1);
  const W = 520, H = 140;
  const ratio = (k: number) => F[k + 1] / F[k];
  const sx = (k: number) => 30 + ((k - 1) / Math.max(1, n - 1)) * (W - 50);
  const sy = (v: number) => H - 20 - ((v - 0.9) / (2.1 - 0.9)) * (H - 40);
  return (
    <Shell title="أعداد فيبوناتشي والنسبة الذهبية" foot="كل حد مجموع الحدين قبله، ولهذا تعتمد براهين فيبوناتشي على الاستقراء دائماً: تستعمل ⁦Fₖ₊₂ = Fₖ₊₁ + Fₖ⁩ لترجع إلى حدود أصغر. والنسبة بين حدين متتاليين تقترب من Φ.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={2} max={20} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 13.5 }}>
          <thead>
            <tr>
              <th style={{ padding: '3px 10px' }}><Tex>n</Tex></th>
              <th style={{ padding: '3px 10px' }}><Tex>F_n</Tex></th>
              <th style={{ padding: '3px 10px' }}><Tex>{'F_{n+1}^2 - F_{n+1}F_n - F_n^2'}</Tex></th>
              <th style={{ padding: '3px 10px' }}><Tex>{'F_{n+1}/F_n'}</Tex></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => {
              const v = F[k + 1] ** 2 - F[k + 1] * F[k] - F[k] ** 2;
              return (
                <tr key={k} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '2px 10px', textAlign: 'center' }}>{k}</td>
                  <td style={{ padding: '2px 10px', textAlign: 'right' }}>{F[k].toLocaleString('en-US')}</td>
                  <td style={{ padding: '2px 10px', textAlign: 'center', color: v < 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>{v}</td>
                  <td style={{ padding: '2px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{ratio(k).toFixed(7)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', marginTop: 10, direction: 'ltr' }} role="img" aria-label="النسبة تقترب من النسبة الذهبية">
        <line x1={20} y1={sy(PHI)} x2={W - 10} y2={sy(PHI)} stroke="var(--amber)" strokeDasharray="5 4" />
        <text x={W - 12} y={sy(PHI) - 6} fontSize={12} textAnchor="end" fill="var(--amber)">Φ ≈ 1.6180340</text>
        <polyline fill="none" stroke="var(--violet)" strokeWidth={2} points={rows.map((k) => `${sx(k)},${sy(ratio(k))}`).join(' ')} />
        {rows.map((k) => <circle key={k} cx={sx(k)} cy={sy(ratio(k))} r={3.5} fill="var(--violet)" />)}
      </svg>
      <p style={{ margin: '6px 0 0' }}>العمود الثالث يتناوب بين <Tex>-1</Tex> و<Tex>1</Tex>، أي <Tex>{'(-1)^n'}</Tex>، وهو ما يبرهنه الكتاب بالاستقراء.</p>
    </Shell>
  );
}
