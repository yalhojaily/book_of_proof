import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { Venn, LAYOUT2, LAYOUT3 } from './venn';
import { parse, atomsOf, toTex } from '@/lib/setexpr';

const DEFAULT = ["A∩B'", '(A∪B)−C', "A∩B∩C'", "(A∩B)∪C'", "A'∩B'∩C", '(A−B)∪(B−A)'];

/** Click regions to shade the given expression, then check. */
export default function VennChallenge({ items = DEFAULT, sets = 3 }: { items?: string[]; sets?: 2 | 3 }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<Record<number, boolean>>({});
  const node = parse(items[idx]);
  const target = new Set(atomsOf(node, sets));
  const layout = sets === 2 ? LAYOUT2 : LAYOUT3;
  const correct = checked && target.size === picked.size && [...target].every((a) => picked.has(a));

  const go = (i: number) => {
    setIdx(i);
    setPicked(new Set());
    setChecked(false);
  };
  const toggle = (a: number) => {
    const n = new Set(picked);
    n.has(a) ? n.delete(a) : n.add(a);
    setPicked(n);
    setChecked(false);
  };
  const check = () => {
    setChecked(true);
    const ok = target.size === picked.size && [...target].every((a) => picked.has(a));
    setScore((s) => ({ ...s, [idx]: ok }));
  };
  const solved = Object.values(score).filter(Boolean).length;

  return (
    <Shell title="تحدٍّ: ظلّل المنطقة بنفسك" tag="تمرين تفاعلي" foot={<>اضغط داخل أي منطقة لتظليلها أو إزالة تظليلها، ثم اضغط «تحقّق». حللت {solved} من {items.length}.</>}>
      <div className="controls">
        {items.map((_, i) => (
          <button
            key={i}
            className="chip"
            onClick={() => go(i)}
            aria-pressed={i === idx}
            style={{
              background: i === idx ? 'var(--ink)' : score[i] === true ? 'var(--green-soft)' : score[i] === false ? 'var(--red-soft)' : undefined,
              color: i === idx ? 'var(--bg)' : score[i] === true ? 'var(--green)' : score[i] === false ? 'var(--red)' : undefined,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: '1.35em', margin: '4px 0 10px' }}>
        <Tex>{toTex(node)}</Tex>
      </div>
      <Venn
        layout={layout}
        shaded={(a) => picked.has(a)}
        highlight={checked && !correct ? (a) => target.has(a) !== picked.has(a) : undefined}
        onAtomClick={toggle}
        ariaLabel="مخطط فن قابل للتظليل"
      />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn active" onClick={check}>تحقّق</button>
        <button className="btn" onClick={() => { setPicked(new Set()); setChecked(false); }}>امسح</button>
        {checked && (correct ? (
          <span className="pill-ok">✓ صحيح!</span>
        ) : (
          <span className="pill-bad">ليس بعد: صحّح المناطق المخططة بالأحمر</span>
        ))}
        {checked && correct && idx < items.length - 1 && (
          <button className="btn" onClick={() => go(idx + 1)}>التالي ←</button>
        )}
      </div>
    </Shell>
  );
}
