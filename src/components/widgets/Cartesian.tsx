import { useState } from 'react';
import { Shell, Tex, fmtSet } from './Shell';

const parseList = (s: string) =>
  [...new Set(s.split(/[,،\s]+/).map((x) => x.trim()).filter(Boolean))].slice(0, 7);

export default function Cartesian() {
  const [aSrc, setASrc] = useState('1, 2, 3');
  const [bSrc, setBSrc] = useState('a, b');
  const [swap, setSwap] = useState(false);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const A = parseList(aSrc);
  const B = parseList(bSrc);
  const [L, R, ln, rn] = swap ? [B, A, 'B', 'A'] : [A, B, 'A', 'B'];
  const texEl = (x: string) => (/^[a-zA-Z]+$/.test(x) ? x : `\\text{${x}}`);

  return (
    <Shell
      title="الضرب الديكارتي: كل زوج مرتب ممكن"
      foot="غيّر عناصر A وB (افصل بينها بفواصل). كل خلية في الجدول زوج مرتب؛ السطر من المجموعة الأولى والعمود من الثانية."
    >
      <div className="controls" style={{ gap: 14 }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <b style={{ color: 'var(--set-a)', fontFamily: 'KaTeX_Math, serif', fontSize: 19 }}>A</b>
          <input type="text" dir="ltr" value={aSrc} onChange={(e) => setASrc(e.target.value)} style={{ width: 130 }} aria-label="عناصر A" />
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <b style={{ color: 'var(--set-b)', fontFamily: 'KaTeX_Math, serif', fontSize: 19 }}>B</b>
          <input type="text" dir="ltr" value={bSrc} onChange={(e) => setBSrc(e.target.value)} style={{ width: 130 }} aria-label="عناصر B" />
        </label>
        <button className="btn" aria-pressed={!swap} onClick={() => setSwap(false)}>
          <Tex>{'A \\times B'}</Tex>
        </button>
        <button className="btn" aria-pressed={swap} onClick={() => setSwap(true)}>
          <Tex>{'B \\times A'}</Tex>
        </button>
      </div>

      <div className="ltr" style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 5, margin: '0 auto' }}>
          <thead>
            <tr>
              <th style={{ fontFamily: 'KaTeX_Main, serif', color: 'var(--ink-3)', fontWeight: 400, padding: '0 8px' }}>×</th>
              {R.map((r, j) => (
                <th
                  key={j}
                  style={{
                    color: swap ? 'var(--set-a)' : 'var(--set-b)',
                    padding: '2px 8px',
                    borderRadius: 8,
                    background: hover?.[1] === j ? (swap ? 'var(--set-a-fill)' : 'var(--set-b-fill)') : undefined,
                  }}
                >
                  <Tex>{texEl(r)}</Tex>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {L.map((l, i) => (
              <tr key={i}>
                <th
                  style={{
                    color: swap ? 'var(--set-b)' : 'var(--set-a)',
                    padding: '2px 10px',
                    borderRadius: 8,
                    background: hover?.[0] === i ? (swap ? 'var(--set-b-fill)' : 'var(--set-a-fill)') : undefined,
                  }}
                >
                  <Tex>{texEl(l)}</Tex>
                </th>
                {R.map((r, j) => {
                  const on = hover?.[0] === i && hover?.[1] === j;
                  return (
                    <td
                      key={j}
                      onMouseEnter={() => setHover([i, j])}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover([i, j])}
                      tabIndex={0}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 9,
                        border: '1px solid var(--line)',
                        background: on ? 'var(--shade-fill)' : 'var(--bg)',
                        textAlign: 'center',
                        transition: 'background .12s',
                        cursor: 'default',
                      }}
                    >
                      <Tex>{`(${texEl(l)}, ${texEl(r)})`}</Tex>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="result-row" style={{ justifyContent: 'center' }}>
          <Tex>{`${ln} \\times ${rn} = ${fmtSet(L.flatMap((l) => R.map((r) => `(${texEl(l)},${texEl(r)})`)))}`}</Tex>
        </div>
        <div className="result-row" style={{ justifyContent: 'center', gap: 16 }}>
          <Tex>{`|${ln} \\times ${rn}| = |${ln}| \\cdot |${rn}| = ${L.length} \\cdot ${R.length} = ${L.length * R.length}`}</Tex>
        </div>
        {hover && (
          <p className="muted" style={{ textAlign: 'center', margin: '6px 0 0' }}>
            الزوج <Tex>{`(${texEl(L[hover[0]])}, ${texEl(R[hover[1]])})`}</Tex>: الإحداثي الأول من <Tex>{ln}</Tex> والثاني من <Tex>{rn}</Tex>.
          </p>
        )}
        {!hover && A.length > 0 && B.length > 0 && A.join() !== B.join() && (
          <p className="muted" style={{ textAlign: 'center', margin: '6px 0 0' }}>
            بدّل بين <Tex>{'A\\times B'}</Tex> و<Tex>{'B\\times A'}</Tex>: العدد نفسه، لكن الأزواج مختلفة، لأن الترتيب داخل الزوج مهم.
          </p>
        )}
      </div>
    </Shell>
  );
}
