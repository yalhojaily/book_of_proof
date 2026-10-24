import { useMemo, useState } from 'react';
import { Shell, Tex } from './Shell';
import { parseLogic, evalLogic, varsOf, logicTex, rowsFor, TF, type LNode } from '@/lib/logic';

const PRESETS: { name: string; prem: string[]; concl: string; note: string }[] = [
  { name: 'Modus ponens', prem: ['P ⇒ Q', 'P'], concl: 'Q', note: 'صحيح: إذا صدق الشرط ومقدَّمه، صدقت النتيجة.' },
  { name: 'Modus tollens', prem: ['P ⇒ Q', '∼Q'], concl: '∼P', note: 'صحيح: لو صدقت P لصدقت Q، لكن Q كاذبة، إذن P كاذبة.' },
  { name: 'الحذف', prem: ['P ∨ Q', '∼P'], concl: 'Q', note: 'صحيح: إحداهما صادقة، وليست P، إذن Q.' },
  { name: 'تسلسل الشروط', prem: ['P ⇒ Q', 'Q ⇒ R'], concl: 'P ⇒ R', note: 'صحيح: الشروط تتسلسل. ستستخدمه في كل برهان طويل.' },
  { name: 'مغالطة: تأكيد التالي', prem: ['P ⇒ Q', 'Q'], concl: 'P', note: 'خطأ شائع: صدق النتيجة لا يعني صدق الشرط. «إذا أمطرت ابتلّ الشارع؛ الشارع مبتلّ؛ إذن أمطرت». ربما رشّه أحد.' },
  { name: 'مغالطة: نفي المقدَّم', prem: ['P ⇒ Q', '∼P'], concl: '∼Q', note: 'خطأ شائع: إذا لم يتحقق الشرط فلا نعرف شيئاً عن النتيجة.' },
];

function tryParse(s: string): LNode | null {
  try {
    return parseLogic(s);
  } catch {
    return null;
  }
}

/** Is an argument valid? Valid ⇔ in every row where all premises are true, the conclusion is true. */
export default function InferenceChecker() {
  const [pi, setPi] = useState(0);
  const [prem, setPrem] = useState<string[]>(PRESETS[0].prem);
  const [concl, setConcl] = useState(PRESETS[0].concl);
  const P = useMemo(() => prem.map(tryParse), [prem]);
  const C = useMemo(() => tryParse(concl), [concl]);
  const ok = P.every(Boolean) && C;
  const vars = ok ? varsOf(...(P as LNode[]), C!) : [];
  const rows = rowsFor(vars);
  const allPrem = (env: Record<string, boolean>) => (P as LNode[]).every((p) => evalLogic(p, env));
  const bad = ok ? rows.findIndex((env) => allPrem(env) && !evalLogic(C!, env)) : -1;
  const valid = ok && bad === -1;
  const note = pi >= 0 && PRESETS[pi].prem.join() === prem.join() && PRESETS[pi].concl === concl ? PRESETS[pi].note : '';

  const th = { padding: '5px 10px', borderBottom: '2px solid var(--line-strong)', fontWeight: 600, whiteSpace: 'nowrap' as const };
  const td = (v: boolean, strong = false) => ({ textAlign: 'center' as const, padding: '3px 10px', fontFamily: 'ui-monospace, monospace', fontWeight: strong ? 700 : 500, color: v ? 'var(--green)' : 'var(--red)', borderBottom: '1px solid var(--line)' });

  return (
    <Shell title="هل الاستدلال صحيح؟" foot="الاستدلال صحيح إذا كانت النتيجة صادقة في كل صف تكون فيه كل المقدمات صادقة. الصفوف المظللة هي التي تصدق فيها المقدمات كلها.">
      <div className="controls">
        {PRESETS.map((p, i) => (
          <button key={i} className="btn" aria-pressed={i === pi && note !== ''} onClick={() => { setPi(i); setPrem(p.prem); setConcl(p.concl); }}>
            {p.name}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="ltr" style={{ flex: 'none', padding: '8px 14px', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--bg)', minWidth: 170 }}>
          {prem.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              <input type="text" dir="ltr" value={s} onChange={(e) => setPrem(prem.map((x, k) => (k === i ? e.target.value : x)))} style={{ width: 130, borderColor: P[i] ? undefined : 'var(--red)' }} aria-label={`المقدمة ${i + 1}`} />
              {prem.length > 1 && <button className="chip" style={{ height: 30, minWidth: 30 }} onClick={() => setPrem(prem.filter((_, k) => k !== i))} aria-label="احذف">×</button>}
            </div>
          ))}
          {prem.length < 4 && <button className="btn" style={{ fontSize: 13, padding: '1px 10px' }} onClick={() => setPrem([...prem, 'P'])}>+ مقدمة</button>}
          <div style={{ borderTop: '2px solid var(--ink)', margin: '8px 0 6px' }} />
          <input type="text" dir="ltr" value={concl} onChange={(e) => setConcl(e.target.value)} style={{ width: 130, borderColor: C ? undefined : 'var(--red)' }} aria-label="النتيجة" />
        </div>
        {ok && (
          <div className="ltr" style={{ overflowX: 'auto', flex: '1 1 300px' }}>
            <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 14.5 }}>
              <thead>
                <tr>
                  {vars.map((v) => <th key={v} style={{ ...th, fontStyle: 'italic' }}>{v}</th>)}
                  {(P as LNode[]).map((p, i) => <th key={i} style={{ ...th, background: 'var(--blue-soft)' }}><Tex>{logicTex(p)}</Tex></th>)}
                  <th style={{ ...th, background: 'var(--amber-soft)' }}><Tex>{logicTex(C!)}</Tex></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((env, r) => {
                  const all = allPrem(env);
                  const c = evalLogic(C!, env);
                  return (
                    <tr key={r} style={{ background: all ? (c ? 'var(--green-soft)' : 'var(--red-soft)') : undefined, opacity: all ? 1 : 0.55 }}>
                      {vars.map((v) => <td key={v} style={{ ...td(env[v]), color: 'var(--ink-2)' }}>{TF(env[v])}</td>)}
                      {(P as LNode[]).map((p, i) => <td key={i} style={td(evalLogic(p, env))}>{TF(evalLogic(p, env))}</td>)}
                      <td style={td(c, true)}>{TF(c)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {ok && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: valid ? 'var(--green-soft)' : 'var(--red-soft)' }}>
          {valid ? <b style={{ color: 'var(--green)' }}>✓ استدلال صحيح.</b> : <><b style={{ color: 'var(--red)' }}>✗ استدلال غير صحيح.</b> في الصف {bad + 1} كل المقدمات صادقة والنتيجة كاذبة.</>}
          {note && <div className="muted" style={{ marginTop: 4 }}>{note}</div>}
        </div>
      )}
    </Shell>
  );
}
