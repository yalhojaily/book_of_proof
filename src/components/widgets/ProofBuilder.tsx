import { useMemo, useState } from 'react';
import { Shell } from './Shell';
import { Rich } from './QuickCheck';

export interface Puzzle {
  title: string;
  prop: string; // proposition, may contain $TeX$
  steps: string[]; // correct order
  distractors?: { text: string; why: string }[];
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tap the lines in the right order to build the proof. Distractor lines must be left out. */
export default function ProofBuilder({ puzzles, title = 'رتّب البرهان' }: { puzzles: Puzzle[]; title?: string }) {
  const [pi, setPi] = useState(0);
  const [seed, setSeed] = useState(7);
  const [picked, setPicked] = useState<number[]>([]); // indices into pool
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const P = puzzles[pi];
  const pool = useMemo(() => {
    const items = [
      ...P.steps.map((t, i) => ({ t, correct: i as number | null, why: '' })),
      ...(P.distractors ?? []).map((d) => ({ t: d.text, correct: null, why: d.why })),
    ];
    return shuffle(items, seed + pi * 13);
  }, [pi, seed, P]);

  const reset = (i = pi) => {
    setPi(i);
    setPicked([]);
    setChecked(false);
  };
  const add = (k: number) => {
    if (picked.includes(k)) return;
    setPicked([...picked, k]);
    setChecked(false);
  };
  const remove = (k: number) => {
    setPicked(picked.filter((x) => x !== k));
    setChecked(false);
  };
  const firstWrong = picked.findIndex((k, pos) => pool[k].correct !== pos);
  const complete = picked.length === P.steps.length && firstWrong === -1;
  const check = () => {
    setChecked(true);
    if (complete) setSolved({ ...solved, [pi]: true });
  };

  return (
    <Shell title={title} tag="تمرين تفاعلي" foot="اضغط السطور بالترتيب الصحيح لتبني البرهان، واضغط سطراً في البرهان لتعيده. بعض السطور فخاخ لا مكان لها في برهان صحيح.">
      <div className="controls">
        {puzzles.map((p, i) => (
          <button key={i} className="btn" aria-pressed={i === pi} onClick={() => reset(i)} style={solved[i] ? { borderColor: 'var(--green)' } : undefined}>
            {solved[i] ? '✓ ' : ''}{p.title}
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--violet-soft)', marginBottom: 12 }}>
        <b style={{ color: 'var(--violet)' }}>القضية:</b> <Rich text={P.prop} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <div>
          <div className="muted" style={{ fontSize: 13.5, marginBottom: 6 }}>البرهان</div>
          <ol style={{ margin: 0, padding: '8px 10px', listStyle: 'none', minHeight: 120, border: '2px dashed var(--line-strong)', borderRadius: 12, display: 'grid', gap: 6, background: 'var(--bg)' }}>
            <li style={{ fontWeight: 700, fontStyle: 'italic', color: 'var(--ink-2)' }}>Proof.</li>
            {picked.map((k, pos) => {
              const bad = checked && firstWrong !== -1 && pos >= firstWrong;
              const isFirstBad = checked && pos === firstWrong;
              return (
                <li key={k}>
                  <button
                    onClick={() => remove(k)}
                    style={{
                      width: '100%',
                      textAlign: 'start',
                      padding: '6px 10px',
                      borderRadius: 9,
                      cursor: 'pointer',
                      border: `1.5px solid ${checked ? (bad ? 'var(--red)' : 'var(--green)') : 'var(--line-strong)'}`,
                      background: checked ? (bad ? 'var(--red-soft)' : 'var(--green-soft)') : 'var(--bg-elev)',
                      opacity: bad && !isFirstBad ? 0.6 : 1,
                    }}
                  >
                    <span className="muted" style={{ marginInlineEnd: 6 }}>{pos + 1}.</span>
                    <Rich text={pool[k].t} />
                  </button>
                  {isFirstBad && (
                    <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--red)' }}>
                      {pool[k].correct === null ? <Rich text={pool[k].why} /> : 'هذا السطر صحيح لكن مكانه ليس هنا: ما الذي يلزم قبله؟'}
                    </p>
                  )}
                </li>
              );
            })}
            {complete && checked && <li style={{ textAlign: 'end', fontSize: 20 }}>■</li>}
          </ol>
        </div>
        <div>
          <div className="muted" style={{ fontSize: 13.5, marginBottom: 6 }}>السطور المتاحة</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {pool.map((it, k) =>
              picked.includes(k) ? null : (
                <button key={k} onClick={() => add(k)} style={{ textAlign: 'start', padding: '6px 10px', borderRadius: 9, cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--bg-elev)' }}>
                  <Rich text={it.t} />
                </button>
              )
            )}
            {pool.every((_, k) => picked.includes(k)) && <span className="muted">لا سطور متبقية.</span>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        <button className="btn active" onClick={check} disabled={picked.length === 0}>تحقّق</button>
        <button className="btn" onClick={() => reset()}>امسح</button>
        <button className="btn" onClick={() => { setSeed(seed + 1); reset(); }}>اخلط</button>
        {checked && (complete ? <span className="pill-ok">✓ برهان صحيح ومكتمل</span> : firstWrong === -1 ? <span className="pill-bad">صحيح حتى الآن، لكنه لم يكتمل</span> : <span className="pill-bad">راجع السطر {firstWrong + 1}</span>)}
      </div>
    </Shell>
  );
}
