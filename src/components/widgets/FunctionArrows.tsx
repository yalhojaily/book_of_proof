import { useState } from 'react';
import { Shell, Tex } from './Shell';

const AN = ['a', 'b', 'c', 'd', 'e'];

const PRESETS: { name: string; na: number; nb: number; map: (number | null)[] }[] = [
  { name: 'ليست دالة', na: 4, nb: 3, map: [0, null, 2, 1] },
  { name: 'لا متباينة ولا غامرة', na: 4, nb: 3, map: [0, 0, 1, 1] },
  { name: 'متباينة فقط', na: 3, nb: 4, map: [0, 2, 3] },
  { name: 'غامرة فقط', na: 4, nb: 3, map: [0, 1, 2, 2] },
  { name: 'تقابل', na: 4, nb: 4, map: [2, 0, 3, 1] },
];

/** Draw a function between two finite sets by clicking: pick an element of A, then its image in B. */
export default function FunctionArrows({ showInverse = false }: { showInverse?: boolean }) {
  const [na, setNa] = useState(4);
  const [nb, setNb] = useState(4);
  const [map, setMap] = useState<(number | null)[]>([2, 0, 3, 1]);
  const [sel, setSel] = useState<number | null>(null);
  const [inv, setInv] = useState(false);
  const m = map.slice(0, na).concat(Array(Math.max(0, na - map.length)).fill(null));
  const isFn = m.every((x) => x !== null && x < nb);
  const imgs = m.filter((x): x is number => x !== null && x < nb);
  const inj = isFn && new Set(imgs).size === imgs.length;
  const sur = isFn && new Set(imgs).size === nb;
  const bij = inj && sur;
  const W = 300, H = 40 + 46 * Math.max(na, nb);
  const ya = (i: number) => 40 + i * 46 + (Math.max(na, nb) - na) * 23;
  const yb = (j: number) => 40 + j * 46 + (Math.max(na, nb) - nb) * 23;
  const hitB = (j: number) => imgs.filter((x) => x === j).length;
  const pickA = (i: number) => setSel(sel === i ? null : i);
  const pickB = (j: number) => {
    if (sel === null) return;
    const nm = [...m];
    nm[sel] = nm[sel] === j ? null : j;
    setMap(nm);
    setSel(sel + 1 < na ? sel + 1 : null);
  };
  const row = (ok: boolean, label: string, why: string) => (
    <div style={{ padding: '5px 10px', borderRadius: 8, background: ok ? 'var(--green-soft)' : 'var(--red-soft)', fontSize: 14 }}>
      <b style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>{ok ? '✓' : '✗'} {label}</b> <span>{why}</span>
    </div>
  );
  const flip = showInverse && inv && bij;
  return (
    <Shell title="ارسم دالة" foot="الدالة ⁦f : A → B⁩ تربط كل عنصر من A بعنصر واحد بالضبط من B. متباينة: لا يصل سهمان إلى العنصر نفسه. غامرة: يصل سهم واحد على الأقل إلى كل عنصر من B. تقابل: الاثنان معاً.">
      <div className="controls">
        {PRESETS.map((p) => <button key={p.name} className="chip" onClick={() => { setNa(p.na); setNb(p.nb); setMap(p.map); setSel(null); setInv(false); }}>{p.name}</button>)}
      </div>
      <div className="controls ltr" style={{ gap: 14 }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Tex>{`|A| = ${na}`}</Tex><input type="range" min={1} max={5} value={na} onChange={(e) => { setNa(+e.target.value); setSel(null); }} /></label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Tex>{`|B| = ${nb}`}</Tex><input type="range" min={1} max={5} value={nb} onChange={(e) => { setNb(+e.target.value); setSel(null); }} /></label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto', direction: 'ltr' }} role="img" aria-label="مخطط الدالة">
        <defs><marker id="fa-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--violet)" /></marker></defs>
        <text x={60} y={18} textAnchor="middle" fontWeight={700} fill="var(--set-a)">{flip ? 'B' : 'A'}</text>
        <text x={240} y={18} textAnchor="middle" fontWeight={700} fill="var(--set-b)">{flip ? 'A' : 'B'}</text>
        <rect x={30} y={24} width={60} height={H - 30} rx={28} fill="var(--set-a-fill)" stroke="var(--set-a)" />
        <rect x={210} y={24} width={60} height={H - 30} rx={28} fill="var(--set-b-fill)" stroke="var(--set-b)" />
        {m.map((j, i) => j !== null && j < nb && (
          flip
            ? <line key={i} x1={78} y1={yb(j)} x2={222} y2={ya(i)} stroke="var(--violet)" strokeWidth={2} markerEnd="url(#fa-head)" />
            : <line key={i} x1={78} y1={ya(i)} x2={222} y2={yb(j)} stroke="var(--violet)" strokeWidth={2} markerEnd="url(#fa-head)" />
        ))}
        {Array.from({ length: na }, (_, i) => (
          <g key={`a${i}`} onClick={() => !flip && pickA(i)} style={{ cursor: 'pointer' }}>
            <circle cx={flip ? 240 : 60} cy={ya(i)} r={14} fill={sel === i ? 'var(--shade)' : 'var(--bg-elev)'} stroke="var(--ink)" />
            <text x={flip ? 240 : 60} y={ya(i) + 5} textAnchor="middle" fontWeight={700} fill="var(--ink)">{AN[i]}</text>
          </g>
        ))}
        {Array.from({ length: nb }, (_, j) => (
          <g key={`b${j}`} onClick={() => !flip && pickB(j)} style={{ cursor: sel !== null ? 'pointer' : 'default' }}>
            <circle cx={flip ? 60 : 240} cy={yb(j)} r={14} fill={hitB(j) > 1 ? 'var(--red-soft)' : hitB(j) === 0 ? 'var(--bg-sunk)' : 'var(--bg-elev)'} stroke="var(--ink)" />
            <text x={flip ? 60 : 240} y={yb(j) + 5} textAnchor="middle" fontWeight={700} fill="var(--ink)">{j + 1}</text>
          </g>
        ))}
      </svg>
      <p className="muted" style={{ textAlign: 'center', margin: '4px 0 8px', fontSize: 14 }}>{sel === null ? 'اضغط عنصراً من A، ثم صورته في B.' : `اختر صورة ${AN[sel]} في B.`}</p>
      <div style={{ display: 'grid', gap: 6 }}>
        {row(isFn, 'دالة', isFn ? 'كل عنصر من A له صورة واحدة.' : 'عنصر من A بلا سهم.')}
        {isFn && row(inj, 'متباينة', inj ? 'لا يلتقي سهمان.' : 'عنصران مختلفان لهما الصورة نفسها (العنصر الأحمر في B).')}
        {isFn && row(sur, 'غامرة', sur ? 'كل عنصر من B صورة لشيء.' : 'عنصر من B لا يصله سهم (الرمادي).')}
      </div>
      {showInverse && (
        <div className="controls" style={{ marginTop: 10 }}>
          <button className="btn" disabled={!bij} onClick={() => setInv(!inv)}>{inv ? 'أعد f' : 'اعكس الأسهم'}</button>
          <span className="muted" style={{ fontSize: 14 }}>{bij ? (inv ? <>هذه <Tex>{'f^{-1} : B \\to A'}</Tex>، وهي دالة لأن f تقابل.</> : 'f تقابل، فعكس أسهمها يعطي دالة.') : 'عكس الأسهم يعطي دالة فقط إذا كانت f تقابلاً (المبرهنة 12.3).'}</span>
        </div>
      )}
    </Shell>
  );
}
