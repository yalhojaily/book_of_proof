import { useState } from 'react';
import { Shell, Tex } from './Shell';

const A = ['a', 'b', 'c'];
const B = ['0', '1', '2'];
const C = ['1', '2', '3', '4'];

/** f : A → B and g : B → C; follow each element through both arrows to get g ∘ f : A → C. */
export default function CompositionLab() {
  const [f, setF] = useState([0, 1, 1]);
  const [g, setG] = useState([2, 0, 3]);
  const [show, setShow] = useState(true);
  const gf = f.map((b) => g[b]);
  const xA = 40, xB = 170, xC = 300;
  const y = (i: number, n: number) => 40 + i * 50 + (4 - n) * 25;
  const cyc = (arr: number[], i: number, n: number) => arr.map((v, k) => (k === i ? (v + 1) % n : v));
  const injF = new Set(f).size === f.length, injG = new Set(g).size === g.length, injGF = new Set(gf).size === gf.length;
  return (
    <Shell title="تركيب دالتين" foot="⁦(g ∘ f)(x) = g(f(x))⁩: نطبّق f أولاً ثم g. اضغط أي عنصر من A أو B لتغيّر صورته. لاحظ أن ⁦g ∘ f⁩ معرّفة لأن المجال المقابل لـ f هو مجال g، أما ⁦f ∘ g⁩ فليست معرّفة هنا.">
      <svg viewBox="0 0 340 240" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', direction: 'ltr' }} role="img" aria-label="تركيب الدوال">
        <defs>
          <marker id="cl-f" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--set-a)" /></marker>
          <marker id="cl-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--set-b)" /></marker>
          <marker id="cl-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--violet)" /></marker>
        </defs>
        {[['A', xA], ['B', xB], ['C', xC]].map(([n, x]) => <text key={n as string} x={x as number} y={16} textAnchor="middle" fontWeight={700} fill="var(--ink)">{n}</text>)}
        <text x={(xA + xB) / 2} y={16} textAnchor="middle" fill="var(--set-a)" fontStyle="italic">f</text>
        <text x={(xB + xC) / 2} y={16} textAnchor="middle" fill="var(--set-b)" fontStyle="italic">g</text>
        {f.map((b, i) => <line key={`f${i}`} x1={xA + 14} y1={y(i, 3)} x2={xB - 16} y2={y(b, 3)} stroke="var(--set-a)" strokeWidth={2} markerEnd="url(#cl-f)" />)}
        {g.map((c, j) => <line key={`g${j}`} x1={xB + 14} y1={y(j, 3)} x2={xC - 16} y2={y(c, 4)} stroke="var(--set-b)" strokeWidth={2} markerEnd="url(#cl-g)" />)}
        {show && gf.map((c, i) => <path key={`h${i}`} d={`M${xA},${y(i, 3) + 14} C${xA + 60},235 ${xC - 60},235 ${xC - 4},${y(c, 4) + 15}`} fill="none" stroke="var(--violet)" strokeWidth={1.6} strokeDasharray="5 3" markerEnd="url(#cl-h)" opacity={0.85} />)}
        {A.map((n, i) => <g key={n} onClick={() => setF(cyc(f, i, 3))} style={{ cursor: 'pointer' }}><circle cx={xA} cy={y(i, 3)} r={13} fill="var(--bg-elev)" stroke="var(--ink)" /><text x={xA} y={y(i, 3) + 5} textAnchor="middle" fontWeight={700} fill="var(--ink)">{n}</text></g>)}
        {B.map((n, j) => <g key={n} onClick={() => setG(cyc(g, j, 4))} style={{ cursor: 'pointer' }}><circle cx={xB} cy={y(j, 3)} r={13} fill="var(--bg-elev)" stroke="var(--ink)" /><text x={xB} y={y(j, 3) + 5} textAnchor="middle" fontWeight={700} fill="var(--ink)">{n}</text></g>)}
        {C.map((n, k) => <g key={n}><circle cx={xC} cy={y(k, 4)} r={13} fill="var(--bg-elev)" stroke="var(--ink)" /><text x={xC} y={y(k, 4) + 5} textAnchor="middle" fontWeight={700} fill="var(--ink)">{n}</text></g>)}
      </svg>
      <div className="controls"><button className="btn" onClick={() => setShow(!show)}>{show ? 'أخفِ g ∘ f' : 'أظهر g ∘ f'}</button></div>
      <div className="result-row ltr" style={{ justifyContent: 'center' }}><Tex>{`g \\circ f = \\{${A.map((a, i) => `(${a}, ${C[gf[i]]})`).join(', ')}\\}`}</Tex></div>
      <p style={{ margin: '6px 0 0', fontSize: 14 }}>
        f {injF ? 'متباينة' : 'ليست متباينة'}، وg {injG ? 'متباينة' : 'ليست متباينة'}، وg ∘ f {injGF ? 'متباينة' : 'ليست متباينة'}.
        {injF && injG && ' تركيب متباينتين متباين دائماً (المبرهنة 12.2).'}
        {!injF && ' إذا لم تكن f متباينة فلا يمكن أن تكون g ∘ f متباينة: عنصران التقيا عند f سيبقيان معاً.'}
      </p>
    </Shell>
  );
}
