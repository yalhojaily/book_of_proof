import { useState } from 'react';
import { Shell, Tex } from './Shell';

interface Case { tex: string; f: (x: number) => number; c: number; L: number; xr: [number, number]; yr: [number, number]; delta?: (e: number) => number; deltaTex?: string; exists: boolean; note: string }
const CASES: Case[] = [
  { tex: '3x + 4', f: (x) => 3 * x + 4, c: 2, L: 10, xr: [0, 4], yr: [3, 17], delta: (e) => e / 3, deltaTex: '\\delta = \\varepsilon / 3', exists: true, note: 'المثال 13.1: لأن ⁦|f(x) − 10| = 3|x − 2|⁩، يكفي ⁦δ = ε/3.⁩' },
  { tex: '5x^2', f: (x) => 5 * x * x, c: 2, L: 20, xr: [0.5, 3.5], yr: [0, 45], delta: (e) => Math.min(1, e / 25), deltaTex: '\\delta = \\min(1, \\varepsilon/25)', exists: true, note: 'المثال 13.2: نحصر ⁦|x + 2| ≤ 5⁩ باشتراط ⁦δ ≤ 1⁩، ثم ⁦δ = ε/25⁩.' },
  { tex: '3x + 4', f: (x) => 3 * x + 4, c: 2, L: 11, xr: [0, 4], yr: [3, 17], exists: false, note: 'نهاية خاطئة: ادّعينا ⁦L = 11⁩. عندما يصغر ε كثيراً لا يوجد δ، لأن قيم f قرب 2 تقترب من 10 لا 11.' },
  { tex: '\\text{jump}', f: (x) => (x < 1 ? x + 1 : x + 2), c: 1, L: 2.5, xr: [-1, 3], yr: [-0.5, 5.5], exists: false, note: 'دالة قافزة: يساراً تقترب من 2 ويميناً من 3. أي L تختاره، عند ⁦ε < 1/2⁩ لا يصلح أي δ.' },
  { tex: '\\sin(1/x)', f: (x) => (x === 0 ? 0 : Math.sin(1 / x)), c: 0, L: 0, xr: [-0.5, 0.5], yr: [-1.5, 1.5], exists: false, note: 'المثال 13.4: قرب الصفر تتذبذب بين −1 و1 بلا توقف. لا يوجد δ لأي ⁦ε < 1.⁩' },
];

/** The ε–δ game: you are given ε; find δ so that the graph over (c − δ, c + δ) stays inside (L − ε, L + ε). */
export default function EpsilonDelta({ only }: { only?: number[] }) {
  const list = only ? only.map((i) => CASES[i]) : CASES;
  const [ci, setCi] = useState(0);
  const K = list[ci];
  const [eps, setEps] = useState(2);
  const [delta, setDelta] = useState(0.5);
  const W = 520, H = 300;
  const [x0, x1] = K.xr, [y0, y1] = K.yr;
  const sx = (x: number) => ((x - x0) / (x1 - x0)) * W;
  const sy = (y: number) => H - ((y - y0) / (y1 - y0)) * H;
  const N = 1200;
  const path: string[] = [];
  let bad = 0, prevY: number | null = null;
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N;
    const y = K.f(x);
    const jump = prevY !== null && Math.abs(y - prevY) > (y1 - y0) / 3;
    path.push(`${i === 0 || jump ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    prevY = y;
    if (x !== K.c && Math.abs(x - K.c) < delta && Math.abs(y - K.L) >= eps) bad++;
  }
  const ok = bad === 0;
  return (
    <Shell title="لعبة ε و δ" foot="الخصم يعطيك ε (الشريط الأفقي). عليك أن تجد δ (الشريط العمودي) بحيث يبقى الرسم داخل المستطيل كلما كان x في الشريط العمودي (عدا ⁦x = c⁩ نفسه). النهاية L صحيحة إذا استطعت الفوز لكل ε مهما صغر.">
      <div className="controls">
        {list.map((k, i) => <button key={i} className="chip" aria-pressed={i === ci} onClick={() => { setCi(i); setEps(Math.min(2, (k.yr[1] - k.yr[0]) / 6)); setDelta(0.5); }}><Tex>{`\\lim_{x \\to ${k.c}} ${k.tex} \\overset{?}{=} ${k.L}`}</Tex></button>)}
      </div>
      <div className="controls ltr" style={{ gap: 16 }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Tex>{`\\varepsilon = ${eps.toFixed(3)}`}</Tex><input type="range" min={0.01} max={(y1 - y0) / 4} step={0.005} value={eps} onChange={(e) => setEps(+e.target.value)} /></label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Tex>{`\\delta = ${delta.toFixed(3)}`}</Tex><input type="range" min={0.002} max={(x1 - x0) / 2} step={0.002} value={delta} onChange={(e) => setDelta(+e.target.value)} /></label>
        {K.delta && <button className="btn" onClick={() => setDelta(K.delta!(eps))}>استعمل <Tex>{K.deltaTex!}</Tex></button>}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 420, direction: 'ltr' }} role="img" aria-label="رسم ε و δ">
          <rect x={0} y={sy(K.L + eps)} width={W} height={sy(K.L - eps) - sy(K.L + eps)} fill="var(--set-b-fill)" />
          <rect x={sx(K.c - delta)} y={0} width={sx(K.c + delta) - sx(K.c - delta)} height={H} fill="var(--set-a-fill)" />
          <rect x={sx(K.c - delta)} y={sy(K.L + eps)} width={sx(K.c + delta) - sx(K.c - delta)} height={sy(K.L - eps) - sy(K.L + eps)} fill="none" stroke={ok ? 'var(--green)' : 'var(--red)'} strokeWidth={2} />
          <line x1={0} y1={sy(K.L)} x2={W} y2={sy(K.L)} stroke="var(--set-b)" strokeDasharray="4 3" />
          <line x1={sx(K.c)} y1={0} x2={sx(K.c)} y2={H} stroke="var(--set-a)" strokeDasharray="4 3" />
          <path d={path.join(' ')} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
          <text x={4} y={sy(K.L) - 4} fontSize={12} fill="var(--set-b)">L = {K.L}</text>
          <text x={sx(K.c) + 4} y={H - 6} fontSize={12} fill="var(--set-a)">c = {K.c}</text>
        </svg>
      </div>
      <div style={{ padding: '8px 12px', borderRadius: 10, background: ok ? 'var(--green-soft)' : 'var(--red-soft)', marginTop: 6 }}>
        <b style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>{ok ? 'فزت بهذه الجولة: ' : 'خسرت هذه الجولة: '}</b>
        {ok ? <>لكل x في الشريط العمودي، <Tex>{`|f(x) - ${K.L}| < \\varepsilon`}</Tex>. صغّر ε وحاول مرة أخرى.</> : <>هناك x في الشريط العمودي يخرج رسمه عن الشريط الأفقي. صغّر δ.</>}
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 14 }}>{K.note}</p>
    </Shell>
  );
}
