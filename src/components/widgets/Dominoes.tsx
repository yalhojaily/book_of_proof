import { useEffect, useState } from 'react';
import { Shell } from './Shell';

const N = 12;

/** The domino picture of induction: the basis knocks over S₁, the inductive step passes the fall along. Break either and see what happens. */
export default function Dominoes() {
  const [basis, setBasis] = useState(true);
  const [step, setStep] = useState(true);
  const [gap, setGap] = useState(6); // when step is broken: S_gap does not knock S_gap+1
  const [fallen, setFallen] = useState(0);
  const [run, setRun] = useState(0);

  const limit = !basis ? 0 : step ? N : gap;
  useEffect(() => {
    setFallen(0);
    if (!run) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i > limit) { clearInterval(t); return; }
      setFallen(i);
    }, 160);
    return () => clearInterval(t);
  }, [run, limit]);

  const done = run > 0 && fallen >= limit;
  return (
    <Shell title="أحجار الدومينو" foot="الأساس يُسقط الحجر الأول. خطوة الاستقراء تضمن أن كل حجر يسقط يُسقط الذي بعده. إذا اختل أحد الشرطين، لا يسقط الجميع.">
      <div className="controls">
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={basis} onChange={(e) => { setBasis(e.target.checked); setRun(0); }} />
          الأساس: برهنّا <span className="ltr">S₁</span>
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={step} onChange={(e) => { setStep(e.target.checked); setRun(0); }} />
          الخطوة: <span className="ltr">Sₖ ⇒ Sₖ₊₁</span> لكل k
        </label>
        {!step && (
          <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span>fails at k = {gap}</span>
            <input type="range" min={1} max={N - 1} value={gap} onChange={(e) => { setGap(+e.target.value); setRun(0); }} />
          </label>
        )}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${N * 46 + 30} 120`} style={{ width: '100%', minWidth: 460, direction: 'ltr' }} role="img" aria-label="أحجار الدومينو">
          <line x1={0} y1={100} x2={N * 46 + 30} y2={100} stroke="var(--line-strong)" />
          {Array.from({ length: N }, (_, i) => {
            const x = 20 + i * 46;
            const down = i < fallen;
            const isGap = !step && i === gap - 1;
            return (
              <g key={i} transform={`rotate(${down ? 62 : 0} ${x + 16} 100)`} style={{ transition: 'transform .25s ease-in' }}>
                <rect x={x} y={30} width={16} height={70} rx={3} fill={down ? 'var(--violet)' : 'var(--bg-elev)'} stroke={isGap ? 'var(--red)' : 'var(--ink)'} strokeWidth={isGap ? 2.5 : 1.3} />
                <text x={x + 8} y={down ? 70 : 22} textAnchor="middle" fontSize={11} fill={down ? '#fff' : 'var(--ink-2)'} transform={down ? `rotate(-62 ${x + 8} 70)` : undefined}>S{i + 1}</text>
              </g>
            );
          })}
          <text x={N * 46 + 12} y={70} fontSize={18} fill="var(--ink-3)">⋯</text>
        </svg>
      </div>
      <div className="controls" style={{ marginTop: 8 }}>
        <button className="btn" onClick={() => setRun(run + 1)}>ادفع الحجر الأول</button>
      </div>
      {run > 0 && done && (
        <div style={{ padding: '8px 12px', borderRadius: 10, background: limit === N ? 'var(--green-soft)' : 'var(--red-soft)' }}>
          {!basis
            ? 'لم يسقط شيء: الخطوة وحدها لا تكفي، فلا شيء يبدأ السلسلة. (يمكن أن تكون كل العبارات كاذبة، والخطوة صحيحة!)'
            : step
              ? 'سقطت كلها، وستسقط كل الأحجار مهما امتد الصف: كل العبارات صادقة.'
              : `توقف السقوط عند S${gap}: من دون الخطوة عند k = ${gap} لا نعرف شيئاً عن S${gap + 1} وما بعدها.`}
        </div>
      )}
    </Shell>
  );
}
