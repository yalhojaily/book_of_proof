import { useState } from 'react';
import { Shell, Tex } from './Shell';

interface Fn { tex: string; f: (x: number) => number; dom: string; cod: string; codOk: (y: number) => boolean; inj: boolean; sur: boolean; hole?: number; note: string }
const FNS: Fn[] = [
  { tex: 'x^2', f: (x) => x * x, dom: '\\mathbb{R}', cod: '\\mathbb{R}', codOk: () => true, inj: false, sur: false, note: 'كل خط فوق المحور يقطع مرتين، وكل خط تحته لا يقطع أبداً.' },
  { tex: 'x^3', f: (x) => x ** 3, dom: '\\mathbb{R}', cod: '\\mathbb{R}', codOk: () => true, inj: true, sur: true, note: 'كل خط أفقي يقطع مرة واحدة بالضبط: تقابل.' },
  { tex: 'e^x', f: (x) => Math.exp(x), dom: '\\mathbb{R}', cod: '\\mathbb{R}', codOk: () => true, inj: true, sur: false, note: 'متباينة، لكن القيم السالبة والصفر في المجال المقابل لا تُصاب.' },
  { tex: 'e^x', f: (x) => Math.exp(x), dom: '\\mathbb{R}', cod: '(0, \\infty)', codOk: (y) => y > 0, inj: true, sur: true, note: 'الدالة نفسها، لكن بتصغير المجال المقابل إلى (0, ∞) صارت غامرة. المجال المقابل جزء من تعريف الدالة.' },
  { tex: '\\tfrac{1}{x} + 1', f: (x) => 1 / x + 1, dom: '\\mathbb{R} - \\{0\\}', cod: '\\mathbb{R}', codOk: () => true, inj: true, sur: false, hole: 1, note: 'المثال 12.4: القيمة 1 لا تُصاب أبداً.' },
  { tex: '\\sin x', f: Math.sin, dom: '\\mathbb{R}', cod: '\\mathbb{R}', codOk: () => true, inj: false, sur: false, note: 'تتكرر القيم بلا نهاية، والقيم خارج [−1, 1] لا تُصاب.' },
];

/** The horizontal line test: count how often y = c meets the graph. */
export default function HorizontalLine() {
  const [fi, setFi] = useState(0);
  const [c, setC] = useState(1.5);
  const F = FNS[fi];
  const W = 520, H = 280, X0 = -3, X1 = 3, Y0 = -3, Y1 = 4;
  const sx = (x: number) => ((x - X0) / (X1 - X0)) * W;
  const sy = (y: number) => H - ((y - Y0) / (Y1 - Y0)) * H;
  const pts: string[] = [];
  const cross: number[] = [];
  let prev: number | null = null;
  for (let i = 0; i <= 600; i++) {
    const x = X0 + ((X1 - X0) * i) / 600;
    const y = F.f(x);
    if (!Number.isFinite(y) || Math.abs(y) > 50) { prev = null; pts.push(''); continue; }
    pts.push(`${pts.length && pts[pts.length - 1] !== '' ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.max(Y0 - 2, Math.min(Y1 + 2, y))).toFixed(1)}`);
    if (prev !== null && (prev - c) * (y - c) <= 0 && Math.abs(prev - y) < 5) cross.push(x);
    prev = y;
  }
  const hits = [...new Set(cross.map((x) => x.toFixed(1)))].length;
  const inCod = F.codOk(c);
  return (
    <Shell title="اختبار الخط الأفقي" foot="الخط ⁦y = c⁩ يقطع الرسم في النقاط x التي تحقق ⁦f(x) = c⁩. متباينة: لا يقطع أي خط أكثر من مرة. غامرة: كل خط عند قيمة c من المجال المقابل يقطع مرة على الأقل.">
      <div className="controls">
        {FNS.map((g, i) => (
          <button key={i} className="chip" aria-pressed={i === fi} onClick={() => setFi(i)}><Tex>{`${g.tex} : ${g.dom} \\to ${g.cod}`}</Tex></button>
        ))}
      </div>
      <label className="ltr controls" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tex>{`c = ${c.toFixed(2)}`}</Tex>
        <input type="range" min={-2.5} max={3.5} step={0.05} value={c} onChange={(e) => setC(+e.target.value)} style={{ flex: 1 }} />
      </label>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 420, direction: 'ltr' }} role="img" aria-label="رسم الدالة">
          <line x1={0} y1={sy(0)} x2={W} y2={sy(0)} stroke="var(--line-strong)" />
          <line x1={sx(0)} y1={0} x2={sx(0)} y2={H} stroke="var(--line-strong)" />
          {!F.codOk(-1) && <rect x={0} y={sy(0)} width={W} height={H - sy(0)} fill="var(--bg-sunk)" opacity={0.8} />}
          <path d={pts.join(' ')} fill="none" stroke="var(--set-a)" strokeWidth={2.5} />
          {F.hole !== undefined && <line x1={0} y1={sy(F.hole)} x2={W} y2={sy(F.hole)} stroke="var(--set-a)" strokeDasharray="2 5" opacity={0.6} />}
          <line x1={0} y1={sy(c)} x2={W} y2={sy(c)} stroke={inCod ? 'var(--amber)' : 'var(--ink-3)'} strokeWidth={2} strokeDasharray={inCod ? undefined : '6 4'} />
          {[...new Set(cross.map((x) => x.toFixed(1)))].map((x) => <circle key={x} cx={sx(+x)} cy={sy(c)} r={5} fill="var(--amber)" />)}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', margin: '6px 0' }}>
        <span className="pill-ok" style={{ background: 'var(--bg-sunk)', color: 'var(--ink)' }}>عدد نقاط التقاطع: {hits}</span>
        {!inCod && <span className="pill-bad">c خارج المجال المقابل</span>}
        <span className={F.inj ? 'pill-ok' : 'pill-bad'}>{F.inj ? 'متباينة' : 'ليست متباينة'}</span>
        <span className={F.sur ? 'pill-ok' : 'pill-bad'}>{F.sur ? 'غامرة' : 'ليست غامرة'}</span>
      </div>
      <p style={{ margin: 0, textAlign: 'center' }}>{F.note}</p>
    </Shell>
  );
}
