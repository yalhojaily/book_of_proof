import { useState } from 'react';
import { Shell, Tex } from './Shell';

interface Pairing { name: string; tex: string; A: string; B: string; f: (n: number) => number | string; inv?: string; note: string }
const PAIRS: Pairing[] = [
  { name: 'ℕ و ℤ', tex: 'f(n) = \\begin{cases} \\tfrac{n}{2} & n \\text{ even} \\\\ \\tfrac{1-n}{2} & n \\text{ odd} \\end{cases}', A: '\\mathbb{N}', B: '\\mathbb{Z}', f: (n) => (n % 2 === 0 ? n / 2 : (1 - n) / 2), note: 'المثال 14.2: نرتّب ℤ هكذا 0، 1، −1، 2، −2، … فيصيب كل عدد صحيح مرة واحدة بالضبط.' },
  { name: 'ℕ والزوجية', tex: 'f(n) = 2n', A: '\\mathbb{N}', B: '\\{2, 4, 6, \\dots\\}', f: (n) => 2 * n, note: 'مجموعة جزئية حقيقية لها العدد الأصلي نفسه. هذا مستحيل في المجموعات المنتهية.' },
  { name: 'ℕ و ℕ − {1}', tex: 'f(n) = n + 1', A: '\\mathbb{N}', B: '\\{2, 3, 4, \\dots\\}', f: (n) => n + 1, note: 'فندق هيلبرت: كل نزيل ينتقل إلى الغرفة التالية، فتفرغ الغرفة 1 لضيف جديد، ولا يبقى أحد بلا غرفة.' },
  { name: 'ℕ والمربعات', tex: 'f(n) = n^2', A: '\\mathbb{N}', B: '\\{1, 4, 9, \\dots\\}', f: (n) => n * n, note: 'المربعات تزداد ندرة كلما كبرت الأعداد، ومع ذلك عددها الأصلي مثل ℕ تماماً (لاحظ غاليليو هذا قديماً).' },
];

/** Infinite sets can be put in one-to-one correspondence with proper subsets of themselves. */
export default function HilbertPairs() {
  const [pi, setPi] = useState(0);
  const [k, setK] = useState(10);
  const P = PAIRS[pi];
  return (
    <Shell title="تقابلات بين مجموعات لا نهائية" foot="⁦|A| = |B|⁩ تعني وجود تقابل ⁦f : A → B⁩. الجدول يعرض أول الأزواج، والتقابل يستمر إلى ما لا نهاية: كل عنصر من B يظهر في الصف الثاني مرة واحدة بالضبط.">
      <div className="controls">
        {PAIRS.map((p, i) => <button key={p.name} className="chip" aria-pressed={i === pi} onClick={() => setPi(i)}>{p.name}</button>)}
      </div>
      <div style={{ textAlign: 'center', margin: '4px 0 8px' }}><Tex>{`f : ${P.A} \\to ${P.B},\\quad ${P.tex}`}</Tex></div>
      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 14 }}>
          <tbody>
            <tr>
              <th style={{ padding: '4px 8px', color: 'var(--set-a)' }}><Tex>n</Tex></th>
              {Array.from({ length: k }, (_, i) => <td key={i} style={{ padding: '4px 8px', textAlign: 'center', borderBottom: '1px solid var(--line)' }}>{i + 1}</td>)}
              <td style={{ padding: '4px 8px' }}>…</td>
            </tr>
            <tr>
              <th style={{ padding: '4px 8px', color: 'var(--set-b)' }}><Tex>{'f(n)'}</Tex></th>
              {Array.from({ length: k }, (_, i) => <td key={i} style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 700, color: 'var(--set-b)' }}>{P.f(i + 1)}</td>)}
              <td style={{ padding: '4px 8px' }}>…</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="controls" style={{ marginTop: 8 }}>
        <button className="btn" onClick={() => setK(Math.min(16, k + 2))}>أظهر المزيد</button>
        <button className="btn" onClick={() => setK(6)}>أقل</button>
      </div>
      <p style={{ margin: 0 }}>{P.note}</p>
    </Shell>
  );
}
