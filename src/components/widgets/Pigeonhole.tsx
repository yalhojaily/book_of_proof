import { useState } from 'react';
import { Shell, Tex } from './Shell';

/** n objects into k boxes: some box has ≥ ⌈n/k⌉, some box has ≤ ⌊n/k⌋. */
export function Pigeons() {
  const [n, setN] = useState(10);
  const [k, setK] = useState(4);
  const [boxes, setBoxes] = useState<number[]>(() => deal(10, 4, 'even'));
  function deal(nn: number, kk: number, how: 'even' | 'random' | 'pile') {
    const b = Array(kk).fill(0);
    for (let i = 0; i < nn; i++) b[how === 'even' ? i % kk : how === 'pile' ? 0 : Math.floor(Math.random() * kk)]++;
    return b;
  }
  const update = (nn: number, kk: number) => { setN(nn); setK(kk); setBoxes(deal(nn, kk, 'even')); };
  const max = Math.max(...boxes);
  const min = Math.min(...boxes);
  const ceil = Math.ceil(n / k);
  const floor = Math.floor(n / k);
  const move = (i: number) => {
    // move one object from box i to the next box (cyclic)
    if (boxes[i] === 0) return;
    const b = [...boxes];
    b[i]--;
    b[(i + 1) % k]++;
    setBoxes(b);
  };

  return (
    <Shell title="مبدأ القسمة وأعشاش الحمام" foot="اضغط على صندوق لتنقل منه حمامة إلى الصندوق التالي. مهما وزّعت، سيبقى صندوق فيه ⌈n/k⌉ على الأقل، وصندوق فيه ⌊n/k⌋ على الأكثر.">
      <div className="controls" style={{ gap: 14 }}>
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`n = ${n}`}</Tex>
          <input type="range" min={1} max={24} value={n} onChange={(e) => update(+e.target.value, k)} style={{ width: 110 }} />
        </label>
        <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Tex>{`k = ${k}`}</Tex>
          <input type="range" min={1} max={8} value={k} onChange={(e) => update(n, +e.target.value)} style={{ width: 110 }} />
        </label>
        <button className="btn" onClick={() => setBoxes(deal(n, k, 'even'))}>وزّع بالتساوي</button>
        <button className="btn" onClick={() => setBoxes(deal(n, k, 'random'))}>عشوائياً</button>
        <button className="btn" onClick={() => setBoxes(deal(n, k, 'pile'))}>كلها في صندوق</button>
      </div>
      <div className="ltr" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', minHeight: 150 }}>
        {boxes.map((c, i) => (
          <button
            key={i}
            onClick={() => move(i)}
            style={{
              width: 62,
              minHeight: 70,
              borderRadius: '0 0 10px 10px',
              border: `2px solid ${c === max ? 'var(--red)' : c === min ? 'var(--blue)' : 'var(--line-strong)'}`,
              borderTop: 'none',
              background: 'var(--bg)',
              display: 'flex',
              flexWrap: 'wrap-reverse',
              alignContent: 'flex-start',
              justifyContent: 'center',
              gap: 2,
              padding: 4,
              cursor: 'pointer',
              position: 'relative',
            }}
            aria-label={`صندوق ${i + 1} فيه ${c}`}
          >
            {Array.from({ length: c }, (_, j) => <span key={j} style={{ fontSize: 16, lineHeight: 1 }}>🐦</span>)}
            <span style={{ position: 'absolute', bottom: -20, left: 0, right: 0, fontSize: 12.5, fontWeight: 700, color: c === max ? 'var(--red)' : c === min ? 'var(--blue)' : 'var(--ink-3)' }}>{c}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 28 }}>
        <div className="result-row" style={{ justifyContent: 'center' }}>
          <span>الأكثر امتلاءً:</span>
          <Tex>{`\\color{#d0562f}{${max}} \\ge \\lceil \\tfrac{${n}}{${k}} \\rceil = ${ceil}`}</Tex>
          <span className="muted">·</span>
          <span>الأقل:</span>
          <Tex>{`\\color{#2f5fd0}{${min}} \\le \\lfloor \\tfrac{${n}}{${k}} \\rfloor = ${floor}`}</Tex>
        </div>
        <p className="muted" style={{ margin: '6px 0 0', textAlign: 'center' }}>
          {n > k ? 'الحمام أكثر من الصناديق، فهناك صندوق فيه حمامتان على الأقل.' : n < k ? 'الصناديق أكثر من الحمام، فهناك صندوق فارغ.' : 'العدد متساوٍ: يمكن أن يكون في كل صندوق حمامة واحدة.'}
        </p>
      </div>
    </Shell>
  );
}

/** Pick 6 numbers from 0..9: two of them always sum to 9 (pairs are the boxes). */
export function SumToNine() {
  const [picked, setPicked] = useState<number[]>([0, 1, 3, 5]);
  const pairs = [[0, 9], [1, 8], [2, 7], [3, 6], [4, 5]];
  const toggle = (x: number) => setPicked(picked.includes(x) ? picked.filter((y) => y !== x) : picked.length < 6 ? [...picked, x] : picked);
  const full = pairs.filter(([a, b]) => picked.includes(a) && picked.includes(b));
  return (
    <Shell title="ستة أعداد من 0 إلى 9: اثنان منها مجموعهما 9 دائماً" tag="تحدٍّ" foot="حاول أن تختار ستة أعداد دون أن يكتمل أي زوج. الصناديق الخمسة هي الأزواج التي مجموعها 9، والأعداد الستة هي الحمام.">
      <div className="ltr" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {pairs.map(([a, b]) => {
          const done = picked.includes(a) && picked.includes(b);
          return (
            <div key={a} style={{ display: 'flex', gap: 4, padding: 6, borderRadius: 12, border: `2px solid ${done ? 'var(--green)' : 'var(--line-strong)'}`, background: done ? 'var(--green-soft)' : 'var(--bg)' }}>
              {[a, b].map((x) => (
                <button key={x} className="chip" onClick={() => toggle(x)} aria-pressed={picked.includes(x)} style={picked.includes(x) ? { background: 'var(--set-a)', color: '#fff', borderColor: 'var(--set-a)' } : undefined}>{x}</button>
              ))}
            </div>
          );
        })}
      </div>
      <div className="result-row" style={{ justifyContent: 'center', marginTop: 10 }}>
        <span>اخترت {picked.length} من 6.</span>
        {full.length > 0 ? <span className="pill-ok">زوج مكتمل: {full.map(([a, b]) => `${a} + ${b} = 9`).join('، ')}</span> : picked.length === 5 ? <span className="muted">خمسة أعداد دون زوج ممكنة. لكن السادس سيقع حتماً في صندوق فيه عدد.</span> : null}
      </div>
    </Shell>
  );
}

export default Pigeons;
