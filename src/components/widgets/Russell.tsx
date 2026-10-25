import { useState } from 'react';
import { Shell, Tex } from './Shell';

const SAMPLES = [
  { tex: '\\mathbb{Z}', self: false, why: 'مجموعة الأعداد الصحيحة ليست عدداً صحيحاً.' },
  { tex: '\\varnothing', self: false, why: 'المجموعة الخالية لا تحتوي أي شيء، ولا نفسها.' },
  { tex: '\\{1, \\{1\\}\\}', self: false, why: 'عنصراها 1 و{1}، وليس بينهما المجموعة نفسها.' },
  { tex: 'B = \\{\\{\\{\\{\\cdots\\}\\}\\}\\}', self: true, why: 'عنصرها الوحيد صندوق مطابق لها تماماً، أي B نفسها. (نظرية المجموعات الحديثة تمنع هذا.)' },
];

/** Step through the two branches of Russell's paradox. */
export default function Russell() {
  const [assume, setAssume] = useState<null | boolean>(null); // true = assume A ∈ A
  const [steps, setSteps] = useState(0);
  const [sample, setSample] = useState<number | null>(null);

  const flip = () => {
    setAssume((a) => (a === null ? true : !a));
    setSteps((s) => s + 1);
  };

  return (
    <Shell title="مفارقة راسل: هل ⁦A ∈ A⁩؟" foot="عرّف A مجموعةَ كل المجموعات التي لا تنتمي إلى نفسها. ابدأ بأي افتراض واتبع التعريف، وراقب ما يحدث.">
      <div style={{ textAlign: 'center', fontSize: '1.25em', margin: '0 0 10px' }}>
        <Tex>{'A = \\{X : X \\text{ is a set and } X \\notin X\\}'}</Tex>
      </div>

      <p style={{ margin: '0 0 6px', fontWeight: 600 }}>أولاً: أي هذه المجموعات تنتمي إلى A؟</p>
      <div className="controls ltr" style={{ justifyContent: 'center' }}>
        {SAMPLES.map((s, i) => (
          <button key={i} className="btn" aria-pressed={sample === i} onClick={() => setSample(i)} style={{ borderRadius: 10 }}>
            <Tex>{s.tex}</Tex>
          </button>
        ))}
      </div>
      {sample !== null && (
        <p style={{ textAlign: 'center', margin: '0 0 14px' }}>
          {SAMPLES[sample].self ? (
            <>
              <Tex>{'B \\in B'}</Tex>، إذن <b style={{ color: 'var(--red)' }}>لا تنتمي</b> إلى A. {SAMPLES[sample].why}
            </>
          ) : (
            <>
              لا تنتمي إلى نفسها، إذن <b style={{ color: 'var(--green)' }}>تنتمي</b> إلى A. {SAMPLES[sample].why}
            </>
          )}
        </p>
      )}

      <p style={{ margin: '8px 0 6px', fontWeight: 600 }}>ثانياً: والآن A نفسها؟</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center', maxWidth: 560, margin: '0 auto' }}>
        {[true, false].map((v, idx) => {
          const on = assume === v;
          return (
            <div
              key={String(v)}
              style={{
                gridColumn: idx === 0 ? 1 : 3,
                gridRow: 1,
                padding: '14px 10px',
                borderRadius: 14,
                textAlign: 'center',
                border: `2px solid ${on ? 'var(--red)' : 'var(--line)'}`,
                background: on ? 'var(--red-soft)' : 'var(--bg)',
                transition: 'all .25s',
                transform: on ? 'scale(1.04)' : 'none',
              }}
            >
              <div style={{ fontSize: '1.3em' }}>
                <Tex>{v ? 'A \\in A' : 'A \\notin A'}</Tex>
              </div>
              <div className="muted" style={{ fontSize: 13.5 }}>
                {v ? 'إذن A تنتمي إلى نفسها، فلا تحقق شرط A' : 'إذن A تحقق شرط A، فيجب أن تنتمي إليها'}
              </div>
            </div>
          );
        })}
        <div style={{ gridColumn: 2, gridRow: 1, fontSize: 26, color: assume === null ? 'var(--ink-3)' : 'var(--red)', textAlign: 'center', lineHeight: 1 }}>
          {assume === null ? '⇄' : assume ? '←' : '→'}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14 }}>
        <button className="btn active" onClick={flip}>{assume === null ? 'افترض أن ⁦A ∈ A⁩' : 'اتبع التعريف'}</button>
        <button className="btn" onClick={() => { setAssume(null); setSteps(0); }}>من جديد</button>
      </div>
      {steps >= 3 && (
        <p style={{ textAlign: 'center', margin: '12px 0 0', color: 'var(--red)', fontWeight: 600 }}>
          كل افتراض يقودك إلى عكسه، إلى ما لا نهاية: إن كانت A ∈ A صحيحة فهي خاطئة، وإن كانت خاطئة فهي صحيحة. هذه هي المفارقة.
        </p>
      )}
    </Shell>
  );
}
