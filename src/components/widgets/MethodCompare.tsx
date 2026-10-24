import { useState, type ReactNode } from 'react';
import { Shell } from './Shell';
import { Rich } from './QuickCheck';

export interface MethodPreset { name: string; P: string; Q: string; nP: string; nQ: string }

const METHODS = [
  { key: 'direct', ar: 'مباشر', note: 'فرض واحد، وهدف محدد تعرفه من البداية.' },
  { key: 'contra', ar: 'عكس نقيض', note: 'فرض واحد (نفي التالي)، وهدف محدد (نفي المقدَّم).' },
  { key: 'contrad', ar: 'تناقض', note: 'فرضان معاً، فلديك معلومات أكثر، لكن الهدف غير محدد: أي تناقض تصل إليه يكفي، وقد لا تعرفه حتى تجده.' },
] as const;

/** One conditional, three ways to start it: compare what you assume and where you must arrive. */
export default function MethodCompare({ presets }: { presets: MethodPreset[] }) {
  const [pi, setPi] = useState(0);
  const [m, setM] = useState<(typeof METHODS)[number]['key']>('contrad');
  const p = presets[pi];
  const assume = m === 'direct' ? [p.P] : m === 'contra' ? [p.nQ] : [p.P, p.nQ];
  const goal = m === 'direct' ? p.Q : m === 'contra' ? p.nP : 'تناقض: عبارة ونفيها معاً، أو أي عبارة كاذبة بوضوح';
  const meta = METHODS.find((x) => x.key === m)!;
  const box = (label: string, color: string, soft: string, body: ReactNode) => (
    <div style={{ flex: '1 1 240px', border: `1.5px solid ${color}`, background: soft, borderRadius: 12, padding: '8px 12px' }}>
      <div style={{ fontWeight: 700, color, marginBottom: 4 }}>{label}</div>
      {body}
    </div>
  );
  return (
    <Shell title="ثلاث طرق لعبارة شرطية واحدة" foot="جرّب الطرق الثلاث على كل عبارة. لاحظ أن التناقض يعطيك أكثر الفروض، وهذا سر قوته. لكن إن وجدت نفسك تستعمل نفي Q وحده وتصل إلى نفي P، فبرهانك عكس نقيض متنكّر.">
      <div className="controls">
        {presets.map((x, i) => (
          <button key={i} className="chip" aria-pressed={i === pi} onClick={() => setPi(i)}>{x.name}</button>
        ))}
      </div>
      <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--violet-soft)', marginBottom: 10 }}>
        <b style={{ color: 'var(--violet)' }}>القضية:</b> إذا كان <Rich text={p.P} />، فإن <Rich text={p.Q} />.
      </div>
      <div className="controls">
        {METHODS.map((x) => (
          <button key={x.key} className="btn" aria-pressed={m === x.key} onClick={() => setM(x.key)}>{x.ar}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {box('افترض', 'var(--set-a)', 'var(--blue-soft)', <ul style={{ margin: 0, paddingInlineStart: 18 }}>{assume.map((a, i) => <li key={i}><Rich text={a} /></li>)}</ul>)}
        {box('واصل حتى تصل إلى', 'var(--green)', 'var(--green-soft)', <Rich text={goal} />)}
      </div>
      <p style={{ margin: '10px 0 0' }}><b>{meta.ar}:</b> {meta.note}</p>
    </Shell>
  );
}
