import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { Venn, LAYOUT2, LAYOUT3 } from './venn';

/** Inclusion–exclusion on multiples: A = multiples of a, B = multiples of b, (C = multiples of c) among 1..N. */
export default function IncExc() {
  const [N, setN] = useState(100);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(5);
  const [three, setThree] = useState(false);
  const xs = Array.from({ length: N }, (_, i) => i + 1);
  const inA = (x: number) => x % a === 0;
  const inB = (x: number) => x % b === 0;
  const inC = (x: number) => three && x % c === 0;
  const atom = (x: number) => (inA(x) ? 1 : 0) | (inB(x) ? 2 : 0) | (inC(x) ? 4 : 0);
  const counts = Array.from({ length: 8 }, (_, m) => xs.filter((x) => atom(x) === m).length);
  const cnt = (f: (x: number) => boolean) => xs.filter(f).length;
  const A = cnt(inA), B = cnt(inB), C = cnt(inC);
  const AB = cnt((x) => inA(x) && inB(x)), AC = cnt((x) => inA(x) && inC(x)), BC = cnt((x) => inB(x) && inC(x)), ABC = cnt((x) => inA(x) && inB(x) && inC(x));
  const U = cnt((x) => inA(x) || inB(x) || inC(x));
  const layout = three ? LAYOUT3 : LAYOUT2;
  const centers2: Record<number, [number, number]> = { 1: [100, 120], 2: [260, 120], 3: [180, 120], 0: [330, 210] };
  const centers3: Record<number, [number, number]> = { 1: [115, 85], 2: [245, 85], 4: [180, 200], 3: [180, 70], 5: [138, 150], 6: [222, 150], 7: [180, 120], 0: [330, 240] };
  const centers = three ? centers3 : centers2;

  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number) => (
    <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Tex>{`${label} = ${v}`}</Tex>
      <input type="range" min={min} max={max} value={v} onChange={(e) => set(+e.target.value)} style={{ width: 90 }} />
    </label>
  );

  return (
    <Shell title="التضمين والاستبعاد: المضاعفات" foot="A مضاعفات a، وB مضاعفات b (وC مضاعفات c) بين 1 وN. الرقم في كل منطقة عدد الأعداد فيها.">
      <div className="controls" style={{ gap: 14 }}>
        {slider('N', N, setN, 10, 300)}
        {slider('a', a, setA, 2, 9)}
        {slider('b', b, setB, 2, 9)}
        {three && slider('c', c, setC, 2, 9)}
        <button className="btn" aria-pressed={!three} onClick={() => setThree(false)}>مجموعتان</button>
        <button className="btn" aria-pressed={three} onClick={() => setThree(true)}>ثلاث مجموعات</button>
      </div>
      <Venn layout={layout} shaded={(m) => m !== 0} ariaLabel="مخطط فن بالأعداد">
        {Object.entries(centers).map(([m, [x, y]]) => (
          <text key={m} x={x} y={y + 6} fontSize={17} fontWeight={700} textAnchor="middle" className="svg-ink">{counts[+m]}</text>
        ))}
      </Venn>
      <div style={{ marginTop: 10 }}>
        {!three ? (
          <div className="result-row" style={{ justifyContent: 'center' }}>
            <Tex>{`|A \\cup B| = |A| + |B| - |A \\cap B| = ${A} + ${B} - ${AB} = ${A + B - AB}`}</Tex>
          </div>
        ) : (
          <div className="result-row" style={{ justifyContent: 'center', overflowX: 'auto' }}>
            <Tex>{`|A \\cup B \\cup C| = ${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${ABC} = ${A + B + C - AB - AC - BC + ABC}`}</Tex>
          </div>
        )}
        <div className="result-row" style={{ justifyContent: 'center' }}>
          <span>العدّ المباشر:</span> <b>{U}</b> {U === (three ? A + B + C - AB - AC - BC + ABC : A + B - AB) && <span className="pill-ok">متطابقان</span>}
          <span className="muted">· وبمبدأ الطرح، ليست في أي منها: <b>{N - U}</b></span>
        </div>
        <p className="muted" style={{ margin: '6px 0 0', textAlign: 'center' }}>
          لو جمعنا <Tex>{three ? '|A| + |B| + |C|' : '|A| + |B|'}</Tex> فقط لحصلنا على <b>{three ? A + B + C : A + B}</b>: الأعداد في التقاطع عُدّت أكثر من مرة.
        </p>
      </div>
    </Shell>
  );
}
