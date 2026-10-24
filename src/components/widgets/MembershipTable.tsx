import { useMemo, useState } from 'react';
import { Shell, Tex } from './Shell';
import { parse, evalAtom, toTex, describeAtom, type Node } from '@/lib/setexpr';

export interface IdentityPreset { l: string; r: string; rel?: 'eq' | 'sub'; note?: string }

function tryParse(src: string): Node | null {
  try { return parse(src); } catch { return null; }
}

/**
 * Chase one element through both sides. An element can sit in 8 places relative to A, B, C; if both sides agree
 * on every place, the sets are equal (this is the element-chasing proof in table form). If a row disagrees, it
 * hands you a counterexample.
 */
export default function MembershipTable({ presets, title = 'طارد العنصر: جدول الانتماء' }: { presets: IdentityPreset[]; title?: string }) {
  const [pi, setPi] = useState(0);
  const [l, setL] = useState(presets[0].l);
  const [r, setR] = useState(presets[0].r);
  const [rel, setRel] = useState<'eq' | 'sub'>(presets[0].rel ?? 'eq');
  const L = useMemo(() => tryParse(l), [l]);
  const R = useMemo(() => tryParse(r), [r]);
  const rows = Array.from({ length: 8 }, (_, a) => a);
  const bad = L && R ? rows.filter((a) => (rel === 'eq' ? evalAtom(L, a) !== evalAtom(R, a) : evalAtom(L, a) && !evalAtom(R, a))) : [];
  const TF = (b: boolean) => <b style={{ color: b ? 'var(--green)' : 'var(--ink-3)' }}>{b ? '∈' : '∉'}</b>;
  const ce = bad.map((a, i) => ({ el: i + 1, a }));
  const setOf = (k: number) => `\\{${ce.filter((c) => c.a & (1 << k)).map((c) => c.el).join(', ')}\\}`.replace('\\{\\}', '\\varnothing');
  const pick = (i: number) => { setPi(i); setL(presets[i].l); setR(presets[i].r); setRel(presets[i].rel ?? 'eq'); };
  const inp = (v: string, set: (s: string) => void) => (
    <input dir="ltr" value={v} onChange={(e) => set(e.target.value)} spellCheck={false} style={{ width: 150, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
  );

  return (
    <Shell title={title} foot="كل صف مكان ممكن للعنصر x بالنسبة إلى A وB وC. برهان «طارد العنصر» يمرّ على هذه الأماكن ضمنياً: إن اتفق الطرفان في كل صف فالمجموعتان متساويتان، وإن اختلفا في صف واحد فذلك الصف يعطيك مثالاً مضاداً.">
      <div className="controls">
        {presets.map((p, i) => (
          <button key={i} className="chip" aria-pressed={i === pi} onClick={() => pick(i)}>{i + 1}</button>
        ))}
      </div>
      <div className="controls ltr" style={{ justifyContent: 'center' }}>
        {inp(l, setL)}
        <select value={rel} onChange={(e) => setRel(e.target.value as 'eq' | 'sub')} style={{ font: 'inherit', padding: '4px 6px', borderRadius: 8, background: 'var(--bg-elev)', color: 'var(--ink)', border: '1px solid var(--line-strong)' }}>
          <option value="eq">=</option>
          <option value="sub">⊆</option>
        </select>
        {inp(r, setR)}
      </div>
      {presets[pi].note && l === presets[pi].l && r === presets[pi].r && <p className="muted" style={{ margin: '0 0 8px', fontSize: 14, textAlign: 'center' }}>{presets[pi].note}</p>}
      {!L || !R ? (
        <p className="pill-bad">تعبير غير صالح. استعمل A وB وC و∪ و∩ و− و' للمتممة.</p>
      ) : (
        <>
          <div className="ltr" style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 14 }}>
              <thead>
                <tr>
                  {['A', 'B', 'C'].map((n) => <th key={n} style={{ padding: '4px 10px' }}><Tex>{`x \\,?\\, ${n}`}</Tex></th>)}
                  <th style={{ padding: '4px 10px', background: 'var(--blue-soft)' }}><Tex>{toTex(L)}</Tex></th>
                  <th style={{ padding: '4px 10px', background: 'var(--violet-soft)' }}><Tex>{toTex(R)}</Tex></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => {
                  const isBad = bad.includes(a);
                  return (
                    <tr key={a} style={{ background: isBad ? 'var(--red-soft)' : undefined }} title={describeAtom(a, 3)}>
                      {[0, 1, 2].map((k) => <td key={k} style={{ padding: '3px 10px', textAlign: 'center', borderTop: '1px solid var(--line)' }}>{TF(!!(a & (1 << k)))}</td>)}
                      <td style={{ padding: '3px 10px', textAlign: 'center', borderTop: '1px solid var(--line)' }}>{TF(evalAtom(L, a))}</td>
                      <td style={{ padding: '3px 10px', textAlign: 'center', borderTop: '1px solid var(--line)' }}>{TF(evalAtom(R, a))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: bad.length ? 'var(--red-soft)' : 'var(--green-soft)' }}>
            {bad.length === 0 ? (
              <><b style={{ color: 'var(--green)' }}>صحيحة.</b> الطرفان متفقان في كل الصفوف{rel === 'sub' ? ' التي يكون فيها x في الطرف الأيسر' : ''}، فيمكن برهانها بمطاردة العنصر.</>
            ) : (
              <>
                <b style={{ color: 'var(--red)' }}>خاطئة.</b> الطرفان مختلفان في {bad.length === 1 ? 'صف واحد' : `${bad.length} صفوف`}. ضع عنصراً في كل مكان من هذه الأماكن لتحصل على مثال مضاد:
                <div className="ltr" style={{ marginTop: 6, textAlign: 'center' }}>
                  <Tex>{`A = ${setOf(0)},\\quad B = ${setOf(1)},\\quad C = ${setOf(2)}`}</Tex>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Shell>
  );
}
