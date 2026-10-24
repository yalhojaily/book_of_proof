import { useState } from 'react';
import { Shell } from './Shell';
import { Rich } from './QuickCheck';

export interface Fix {
  bad: string;
  good: string;
  rule: string;
}

/** A proof written badly, line by line. Fix each line and read why. */
export default function WritingFixer({ prop, fixes, title = 'حسّن كتابة هذا البرهان' }: { prop: string; fixes: Fix[]; title?: string }) {
  const [fixed, setFixed] = useState<boolean[]>(() => fixes.map(() => false));
  const all = fixed.every(Boolean);
  return (
    <Shell title={title} tag="تمرين تفاعلي" foot="البرهان صحيح رياضياً لكنه مكتوب بشكل سيئ. قبل أن تضغط «حسّن»، حاول أن تكتشف بنفسك ما المشكلة في السطر.">
      <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--violet-soft)', marginBottom: 10 }}>
        <b style={{ color: 'var(--violet)' }}>القضية:</b> <Rich text={prop} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {fixes.map((f, i) => (
          <div key={i} style={{ border: `1.5px solid ${fixed[i] ? 'var(--green)' : 'var(--red)'}`, borderRadius: 10, padding: '8px 12px', background: fixed[i] ? 'var(--green-soft)' : 'var(--red-soft)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <span style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, color: fixed[i] ? 'var(--green)' : 'var(--red)', marginInlineEnd: 6 }}>{fixed[i] ? '✓' : '✗'}</span>
                <Rich text={fixed[i] ? f.good : f.bad} />
              </span>
              <button className="btn" style={{ flex: 'none', padding: '2px 10px' }} onClick={() => setFixed(fixed.map((x, k) => (k === i ? !x : x)))}>
                {fixed[i] ? 'الأصل' : 'حسّن'}
              </button>
            </div>
            {fixed[i] && <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}><b>القاعدة:</b> <Rich text={f.rule} /></p>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
        <button className="btn" onClick={() => setFixed(fixes.map(() => true))}>حسّن الكل</button>
        <button className="btn" onClick={() => setFixed(fixes.map(() => false))}>أعد الأصل</button>
        {all && <span className="pill-ok">البرهان الآن واضح ومقروء</span>}
      </div>
    </Shell>
  );
}
