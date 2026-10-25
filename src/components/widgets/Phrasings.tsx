import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Ans = 'pq' | 'qp' | 'iff';
const LABEL: Record<Ans, string> = { pq: 'P \\Rightarrow Q', qp: 'Q \\Rightarrow P', iff: 'P \\Leftrightarrow Q' };

const DEFAULT: { s: string; a: Ans; why: string }[] = [
  { s: 'Q if P', a: 'pq', why: '«Q إذا P»: الشرط بعد كلمة if هو المقدَّم دائماً، أينما وقع في الجملة.' },
  { s: 'P only if Q', a: 'pq', why: '«P فقط إذا Q»: لا يمكن أن تصدق P إلا وQ صادقة، أي ⁦P ⇒ Q⁩. هذه أكثر صيغة خادعة.' },
  { s: 'P is sufficient for Q', a: 'pq', why: 'تحقق P يكفي لتحقق Q.' },
  { s: 'P is necessary for Q', a: 'qp', why: 'لا تتحقق Q دون P، أي ⁦Q ⇒ P⁩.' },
  { s: 'Q whenever P', a: 'pq', why: 'كلما صدقت P صدقت Q.' },
  { s: 'Q only if P', a: 'qp', why: 'بالقاعدة نفسها: «Q فقط إذا P» تعني ⁦Q ⇒ P⁩.' },
  { s: 'P provided that Q', a: 'qp', why: '«P بشرط Q»: الشرط هنا Q، أي ⁦Q ⇒ P⁩.' },
  { s: 'P is necessary and sufficient for Q', a: 'iff', why: 'ضروري ⁦(Q ⇒ P)⁩ وكافٍ ⁦(P ⇒ Q)⁩ معاً.' },
  { s: 'If P, then Q, and conversely', a: 'iff', why: '«والعكس صحيح» تضيف ⁦Q ⇒ P⁩.' },
  { s: 'For Q, it is sufficient that P', a: 'pq', why: 'P تكفي لـ Q.' },
];

/** Drill: which conditional does each English phrasing mean? */
export default function Phrasings({ items = DEFAULT }: { items?: { s: string; a: Ans; why: string }[] }) {
  const [picks, setPicks] = useState<Record<number, Ans>>({});
  const score = items.filter((it, i) => picks[i] === it.a).length;
  return (
    <Shell title="ماذا تعني هذه الصياغة؟" tag="تدريب" foot={<>صحيحة {score} من {items.length}. الصياغات بالإنجليزية كما ستقرؤها في الكتاب وفي الكتب الرياضية.</>}>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, i) => {
          const pick = picks[i];
          return (
            <div key={i} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)', background: pick ? (pick === it.a ? 'var(--green-soft)' : 'var(--red-soft)') : 'var(--bg)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="ltr" style={{ fontWeight: 600, fontFamily: 'Georgia, serif', fontSize: 16.5 }}>
                  {it.s.split(/\b(P|Q)\b/).map((part, k) => (part === 'P' || part === 'Q' ? <i key={k}>{part}</i> : <span key={k}>{part}</span>))}
                </span>
                <span style={{ display: 'flex', gap: 5 }}>
                  {(['pq', 'qp', 'iff'] as Ans[]).map((a) => (
                    <button
                      key={a}
                      className="btn"
                      onClick={() => setPicks({ ...picks, [i]: a })}
                      style={{
                        borderRadius: 9,
                        padding: '2px 9px',
                        borderColor: pick && (a === it.a ? 'var(--green)' : a === pick ? 'var(--red)' : undefined),
                        borderWidth: pick && (a === it.a || a === pick) ? 2 : 1,
                      }}
                    >
                      <Tex>{LABEL[a]}</Tex>
                    </button>
                  ))}
                </span>
              </div>
              {pick && <p style={{ margin: '6px 0 0', fontSize: 14 }}>{it.why}</p>}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
