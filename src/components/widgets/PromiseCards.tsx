import { useState } from 'react';
import { Shell, Tex } from './Shell';

const CASES = [
  { p: true, q: true, story: 'أمطرت، وحملتُ المظلة.', verdict: true, why: 'وفيتُ بوعدي تماماً.' },
  { p: true, q: false, story: 'أمطرت، ولم أحمل المظلة.', verdict: false, why: 'هذه هي الحالة الوحيدة التي أكون فيها قد كذبت: الشرط تحقق والنتيجة لم تتحقق.' },
  { p: false, q: true, story: 'لم تمطر، لكني حملتُ المظلة.', verdict: true, why: 'لم أعِد بألا أحملها إن لم تمطر. وعدي لم يُنقض، فهو صادق.' },
  { p: false, q: false, story: 'لم تمطر، ولم أحمل المظلة.', verdict: true, why: 'الوعد لم يُختبر أصلاً، فلا يمكن اتهامي بنقضه.' },
];

/** Four scenarios for a promise "if P then Q": guess when the promise was broken. */
export default function PromiseCards() {
  const [guess, setGuess] = useState<Record<number, boolean>>({});
  const done = Object.keys(guess).length;
  const right = CASES.filter((c, i) => guess[i] === c.verdict).length;
  return (
    <Shell
      title="متى يكون الوعد كاذباً؟"
      foot={done === 4 ? <>أصبت في {right} من 4. لاحظ أن الوعد لا يكذب إلا في حالة واحدة، وهذا هو جدول صدق ⇒.</> : 'لكل حالة: هل كان الوعد صادقاً أم كاذباً؟ احكم قبل أن ترى الجواب.'}
    >
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 600 }}>«إذا أمطرت غداً، فسأحمل المظلة.»</div>
        <div style={{ marginTop: 4 }}>
          <Tex>{'\\underbrace{\\text{rains}}_{P} \\Rightarrow \\underbrace{\\text{umbrella}}_{Q}'}</Tex>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {CASES.map((c, i) => {
          const g = guess[i];
          const shown = g !== undefined;
          return (
            <div
              key={i}
              style={{
                border: `2px solid ${shown ? (c.verdict ? 'var(--green)' : 'var(--red)') : 'var(--line)'}`,
                borderRadius: 12,
                padding: 12,
                background: shown ? (c.verdict ? 'var(--green-soft)' : 'var(--red-soft)') : 'var(--bg)',
              }}
            >
              <div className="ltr" style={{ display: 'flex', gap: 10, justifyContent: 'center', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: 6 }}>
                <span>P: <span style={{ color: c.p ? 'var(--green)' : 'var(--red)' }}>{c.p ? 'T' : 'F'}</span></span>
                <span>Q: <span style={{ color: c.q ? 'var(--green)' : 'var(--red)' }}>{c.q ? 'T' : 'F'}</span></span>
              </div>
              <p style={{ margin: '0 0 8px', textAlign: 'center' }}>{c.story}</p>
              {!shown ? (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  <button className="btn" onClick={() => setGuess({ ...guess, [i]: true })}>صادق</button>
                  <button className="btn" onClick={() => setGuess({ ...guess, [i]: false })}>كاذب</button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 14 }}>
                  <span className={g === c.verdict ? 'pill-ok' : 'pill-bad'}>{g === c.verdict ? 'أصبت' : 'ليس تماماً'}</span>{' '}
                  الوعد <b>{c.verdict ? 'صادق' : 'كاذب'}</b>. {c.why}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
