import { useState } from 'react';
import { Shell, Tex } from './Shell';

/** Renders a string where $...$ segments are TeX and **…** is bold. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('$') && p.endsWith('$') ? (
          <Tex key={i}>{p.slice(1, -1)}</Tex>
        ) : (
          <span key={i}>{p.split(/(\*\*[^*]+\*\*)/g).map((q, j) => (q.startsWith('**') && q.endsWith('**') && q.length > 4 ? <b key={j}>{q.slice(2, -2)}</b> : q))}</span>
        )
      )}
    </>
  );
}

export interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

/** A short multiple-choice self-check. Questions may contain $TeX$. */
export default function QuickCheck({ questions, title = 'تحقّق من فهمك' }: { questions: Question[]; title?: string }) {
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const done = picks.filter((p, i) => p === questions[i].answer).length;
  return (
    <Shell title={title} tag="اختبار سريع" foot={<>أجبت إجابة صحيحة عن {done} من {questions.length}.</>}>
      <ol style={{ margin: 0, paddingInlineStart: '1.3em', display: 'grid', gap: 16 }}>
        {questions.map((q, i) => {
          const pick = picks[i];
          const answered = pick !== null;
          const right = pick === q.answer;
          return (
            <li key={i}>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>
                <Rich text={q.q} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {q.options.map((o, j) => {
                  const isPick = pick === j;
                  const show = answered && (isPick || j === q.answer);
                  return (
                    <button
                      key={j}
                      className="btn"
                      onClick={() => setPicks(picks.map((x, k) => (k === i ? j : x)))}
                      style={{
                        borderRadius: 10,
                        borderColor: show ? (j === q.answer ? 'var(--green)' : 'var(--red)') : undefined,
                        background: show ? (j === q.answer ? 'var(--green-soft)' : 'var(--red-soft)') : undefined,
                      }}
                    >
                      <Rich text={o} />
                    </button>
                  );
                })}
              </div>
              {answered && (
                <p style={{ margin: '8px 0 0', fontSize: 14.5 }}>
                  <span className={right ? 'pill-ok' : 'pill-bad'}>{right ? 'صحيح' : 'ليس تماماً'}</span>{' '}
                  <Rich text={q.why} />
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}
