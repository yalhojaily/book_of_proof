import { useState } from 'react';
import { Shell, Tex } from './Shell';

interface Seq { tex: string; a: (n: number) => number; L: number | null; N?: (e: number) => number; Ntex?: string; series?: boolean; note: string }
const SEQS: Seq[] = [
  { tex: 'a_n = 1 - \\tfrac{1}{n}', a: (n) => 1 - 1 / n, L: 1, N: (e) => Math.ceil(1 / e), Ntex: 'N = \\lceil 1/\\varepsilon \\rceil', note: 'المثال 13.8: ⁦|a_n − 1| = 1/n < ε⁩ متى كان ⁦n > 1/ε⁩.' },
  { tex: 'a_n = \\tfrac{(-1)^n}{n}', a: (n) => (-1) ** n / n, L: 0, N: (e) => Math.ceil(1 / e), Ntex: 'N = \\lceil 1/\\varepsilon \\rceil', note: 'تتذبذب حول 0، لكن السعة تصغر، فتتقارب إلى 0.' },
  { tex: 'a_n = (-1)^n', a: (n) => (-1) ** n, L: null, note: 'تقفز بين −1 و1. لا يوجد L يبقى قريباً من كل الحدود المتأخرة: متباعدة.' },
  { tex: 'S_n = \\sum_{k=1}^{n} \\tfrac{1}{2^k}', a: (n) => 1 - 2 ** -n, L: 1, N: (e) => Math.max(1, Math.ceil(Math.log2(1 / e))), Ntex: 'N = \\lceil \\log_2(1/\\varepsilon) \\rceil', series: true, note: 'المثال 13.10: المجاميع الجزئية ⁦1 − 1/2ⁿ⁩ تتقارب إلى 1، فالمتسلسلة مجموعها 1.' },
  { tex: 'S_n = \\sum_{k=1}^{n} \\tfrac{1}{k}', a: (n) => { let s = 0; for (let k = 1; k <= n; k++) s += 1 / k; return s; }, L: null, series: true, note: 'المتسلسلة التوافقية: حدودها تصغر إلى 0، لكن مجاميعها الجزئية تكبر بلا حد (تمرين 21 في الفصل 10). متباعدة.' },
];

/** A sequence converges to L if, for every ⁦ε > 0⁩, all terms after some N stay within ε of L. */
export default function SequenceLab({ only }: { only?: number[] }) {
  const list = only ? only.map((i) => SEQS[i]) : SEQS;
  const [si, setSi] = useState(0);
  const S = list[si];
  const [eps, setEps] = useState(0.2);
  const [count, setCount] = useState(30);
  const vals = Array.from({ length: count }, (_, i) => S.a(i + 1));
  const L = S.L ?? 0;
  const lo = Math.min(...vals, S.L ?? Infinity) - 0.2, hi = Math.max(...vals, S.L ?? -Infinity) + 0.2;
  const W = 520, H = 240;
  const sx = (n: number) => 20 + ((n - 1) / Math.max(1, count - 1)) * (W - 40);
  const sy = (y: number) => H - 20 - ((y - lo) / (hi - lo)) * (H - 40);
  const N = S.N ? S.N(eps) : null;
  const firstOk = S.L === null ? null : (() => { let last = 0; vals.forEach((v, i) => { if (Math.abs(v - L) >= eps) last = i + 1; }); return last; })();
  return (
    <Shell title={S.series ? 'المجاميع الجزئية لمتسلسلة' : 'تقارب متتالية'} foot="المتتالية تتقارب إلى L إذا وُجد، لكل ⁦ε > 0⁩، عدد N بحيث تقع كل الحدود بعد N داخل الشريط ⁦(L − ε, L + ε)⁩. والمتسلسلة تتقارب إذا تقاربت متتالية مجاميعها الجزئية.">
      <div className="controls">
        {list.map((q, i) => <button key={i} className="chip" aria-pressed={i === si} onClick={() => setSi(i)}><Tex>{q.tex}</Tex></button>)}
      </div>
      <div className="controls ltr" style={{ gap: 16 }}>
        {S.L !== null && <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Tex>{`\\varepsilon = ${eps.toFixed(3)}`}</Tex><input type="range" min={0.01} max={0.6} step={0.005} value={eps} onChange={(e) => setEps(+e.target.value)} /></label>}
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Tex>{`n \\le ${count}`}</Tex><input type="range" min={10} max={120} value={count} onChange={(e) => setCount(+e.target.value)} /></label>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 420, direction: 'ltr' }} role="img" aria-label="حدود المتتالية">
          {S.L !== null && <rect x={0} y={sy(L + eps)} width={W} height={sy(L - eps) - sy(L + eps)} fill="var(--set-b-fill)" />}
          {S.L !== null && <line x1={0} y1={sy(L)} x2={W} y2={sy(L)} stroke="var(--set-b)" strokeDasharray="4 3" />}
          {N !== null && N <= count && <line x1={sx(N)} y1={0} x2={sx(N)} y2={H} stroke="var(--green)" strokeDasharray="5 3" />}
          <line x1={0} y1={sy(0)} x2={W} y2={sy(0)} stroke="var(--line-strong)" />
          {vals.map((v, i) => {
            const inside = S.L !== null && Math.abs(v - L) < eps;
            return <circle key={i} cx={sx(i + 1)} cy={sy(v)} r={count > 60 ? 2.5 : 3.5} fill={S.L === null ? 'var(--violet)' : inside ? 'var(--set-a)' : 'var(--red)'} />;
          })}
          {N !== null && N <= count && <text x={sx(N) + 4} y={14} fontSize={12} fill="var(--green)">N = {N}</text>}
        </svg>
      </div>
      {S.L !== null ? (
        <p style={{ margin: '6px 0 0' }}>
          {N !== null && <>من البرهان: <Tex>{`${S.Ntex!} = ${N}`}</Tex>. </>}
          {firstOk !== null && <>في الرسم: كل الحدود بعد <Tex>{`n = ${firstOk}`}</Tex> داخل الشريط.</>}
        </p>
      ) : (
        <p style={{ margin: '6px 0 0' }}><Tex>{`a_{${count}} \\approx ${vals[count - 1].toFixed(4)}`}</Tex></p>
      )}
      <p className="muted" style={{ margin: '4px 0 0', fontSize: 14 }}>{S.note}</p>
    </Shell>
  );
}
