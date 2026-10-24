import { useState } from 'react';
import { Shell } from './Shell';
import { Rich } from './QuickCheck';

export interface Frame {
  lines: string[]; // full proof as it stands; use '…' for the gap
  added: number[]; // indices of lines that are new in this frame
  note: string;
}

/** Watch a proof grow: first and last lines first, then fill the gap from both ends. */
export default function ProofFrames({ prop, frames, title = 'كيف يُكتب البرهان: من الطرفين إلى الوسط' }: { prop: string; frames: Frame[]; title?: string }) {
  const [i, setI] = useState(0);
  const f = frames[i];
  return (
    <Shell title={title} foot="هكذا يكتب الرياضيون البرهان فعلاً: يكتبون أول سطر (الفرض) وآخر سطر (المطلوب)، ثم يملؤون الفجوة من الأعلى ومن الأسفل حتى يلتقيا.">
      <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--violet-soft)', marginBottom: 10 }}>
        <b style={{ color: 'var(--violet)' }}>القضية:</b> <Rich text={prop} />
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        {frames.map((_, k) => (
          <button key={k} className="chip" aria-pressed={k === i} onClick={() => setI(k)} style={k === i ? { background: 'var(--ink)', color: 'var(--bg)' } : undefined}>
            {k + 1}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '10px 14px', background: 'var(--bg)' }}>
        <div style={{ fontWeight: 700, fontStyle: 'italic', marginBottom: 4 }}>Proof.</div>
        {f.lines.map((l, k) =>
          l === '…' ? (
            <div key={k} style={{ height: 28, margin: '4px 0', borderRadius: 8, border: '2px dashed var(--line-strong)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', fontSize: 13 }}>فجوة</div>
          ) : (
            <div key={k} style={{ padding: '4px 8px', margin: '3px 0', borderRadius: 8, background: f.added.includes(k) ? 'var(--shade-fill)' : 'transparent', transition: 'background .3s' }}>
              <Rich text={l} />
            </div>
          )
        )}
        {i === frames.length - 1 && <div style={{ textAlign: 'end', fontSize: 18 }}>■</div>}
      </div>
      <p style={{ margin: '10px 0 0' }}><b>الخطوة {i + 1}:</b> {f.note}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
        <button className="btn" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>→ السابق</button>
        <button className="btn active" onClick={() => setI(Math.min(frames.length - 1, i + 1))} disabled={i === frames.length - 1}>التالي ←</button>
      </div>
    </Shell>
  );
}
