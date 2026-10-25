import { useState } from 'react';
import { Shell, Tex } from './Shell';

const A = [1, 2, 3, 4];

/** For any f : A → P(A), the set B = {a : a ∉ f(a)} is not f of anything. So no f is onto: ⁦|A| < |P(A)|⁩. */
export default function PowerSetDiag() {
  const [f, setF] = useState<boolean[][]>([
    [true, true, false, false],
    [false, false, true, false],
    [false, true, true, true],
    [false, false, false, false],
  ]);
  const toggle = (a: number, x: number) => setF(f.map((row, i) => (i === a ? row.map((v, j) => (j === x ? !v : v)) : row)));
  const B = A.filter((_, i) => !f[i][i]);
  const setTex = (row: boolean[]) => { const s = A.filter((_, j) => row[j]); return s.length ? `\\{${s.join(', ')}\\}` : '\\varnothing'; };
  const Bt = B.length ? `\\{${B.join(', ')}\\}` : '\\varnothing';
  return (
    <Shell title="لماذا ⁦|A| < |P(A)|⁩؟" foot="اختر لكل عنصر a مجموعة جزئية f(a) بالضغط على الخانات. ثم انظر إلى B: تحوي a إذا لم يكن a في f(a). القطر الأصفر هو ما يقرر B، وB تختلف عن كل f(a) عند العنصر a نفسه. هذه حجة كانتور القطرية مرة أخرى.">
      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ padding: 4 }}></th>
              {A.map((x) => <th key={x} style={{ padding: 4, color: 'var(--ink-3)' }}>{x} ∈ ?</th>)}
              <th style={{ padding: '4px 10px' }}></th>
            </tr>
          </thead>
          <tbody>
            {A.map((a, i) => (
              <tr key={a}>
                <th style={{ padding: '4px 8px' }}><Tex>{`f(${a})`}</Tex></th>
                {A.map((x, j) => (
                  <td key={x} style={{ padding: 2 }}>
                    <button onClick={() => toggle(i, j)} aria-pressed={f[i][j]} style={{ width: 40, height: 32, borderRadius: 6, cursor: 'pointer', border: i === j ? '2.5px solid var(--shade)' : '1px solid var(--line-strong)', background: f[i][j] ? 'var(--set-a)' : 'var(--bg-elev)', color: f[i][j] ? '#fff' : 'var(--ink-3)', fontWeight: 700 }}>{f[i][j] ? '∈' : '∉'}</button>
                  </td>
                ))}
                <td style={{ padding: '4px 10px' }}><Tex>{`= ${setTex(f[i])}`}</Tex></td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid var(--ink)' }}>
              <th style={{ padding: '6px 8px', color: 'var(--violet)' }}>B</th>
              {A.map((x, j) => <td key={x} style={{ textAlign: 'center', fontWeight: 700, color: 'var(--violet)' }}>{!f[j][j] ? '∈' : '∉'}</td>)}
              <td style={{ padding: '4px 10px', color: 'var(--violet)' }}><Tex>{`= ${Bt}`}</Tex></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ display: 'grid', gap: 4, marginTop: 10 }}>
        {A.map((a, i) => (
          <div key={a} style={{ fontSize: 14 }}>
            <Tex>{`B \\neq f(${a})`}</Tex>: لأن <Tex>{`${a} ${f[i][i] ? '\\in' : '\\notin'} f(${a})`}</Tex> بينما <Tex>{`${a} ${f[i][i] ? '\\notin' : '\\in'} B`}</Tex>.
          </div>
        ))}
      </div>
      <p style={{ margin: '8px 0 0', fontWeight: 600 }}>إذن B مجموعة جزئية من A ليست صورة لأي عنصر: f ليست غامرة، مهما اخترت.</p>
    </Shell>
  );
}
