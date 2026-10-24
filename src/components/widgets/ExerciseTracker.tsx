import { useEffect, useState } from 'react';

type State = 0 | 1 | 2; // 0 = not yet, 1 = solved, 2 = needs review
const KEY = 'bop-exercises-v1';

function load(section: string): Record<number, State> {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || '{}');
    return all[section] ?? {};
  } catch {
    return {};
  }
}
function save(section: string, s: Record<number, State>) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || '{}');
    all[section] = s;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Tracks which of the book's exercises you have done. Click a number to cycle:
 * not yet → solved ✓ → needs review ↻ → not yet.
 */
export default function ExerciseTracker({
  section,
  count,
  core = [],
}: {
  section: string;
  count: number;
  core?: number[]; // the exercises recommended as a minimum
}) {
  const [st, setSt] = useState<Record<number, State>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSt(load(section));
    setReady(true);
  }, [section]);
  const nums = Array.from({ length: count }, (_, i) => i + 1);
  const cycle = (n: number) => {
    const next = { ...st, [n]: (((st[n] ?? 0) + 1) % 3) as State };
    if (next[n] === 0) delete next[n];
    setSt(next);
    save(section, next);
  };
  const solved = nums.filter((n) => st[n] === 1).length;
  const review = nums.filter((n) => st[n] === 2).length;
  const coreDone = core.filter((n) => st[n] === 1).length;

  return (
    <figure className="widget hue-green" style={{ marginInline: 0 }}>
      <div className="widget-head">
        <span className="tag">متابعة التمارين</span>
        <h4>تمارين القسم <span className="ltr">{section}</span> في الكتاب</h4>
      </div>
      <div className="widget-body">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {nums.map((n) => {
            const s = st[n] ?? 0;
            const isCore = core.includes(n);
            const odd = n % 2 === 1;
            return (
              <button
                key={n}
                className="chip"
                onClick={() => cycle(n)}
                title={`${isCore ? 'تمرين أساسي · ' : ''}${odd ? 'حلّه في آخر الكتاب' : 'لا حل له في الكتاب'}`}
                aria-label={`تمرين ${n}: ${['لم يُحل', 'محلول', 'يحتاج مراجعة'][s]}`}
                style={{
                  position: 'relative',
                  minWidth: 40,
                  background: s === 1 ? 'var(--green)' : s === 2 ? 'var(--amber-soft)' : undefined,
                  color: s === 1 ? '#fff' : s === 2 ? 'var(--amber)' : undefined,
                  borderColor: s === 1 ? 'var(--green)' : s === 2 ? 'var(--amber)' : isCore ? 'var(--ink-2)' : undefined,
                  borderWidth: isCore ? 2 : 1,
                  opacity: ready ? 1 : 0.6,
                }}
              >
                {s === 1 ? '✓' : s === 2 ? '↻' : n}
                {s !== 0 && <span style={{ position: 'absolute', top: -7, insetInlineEnd: -5, fontSize: 10, background: 'var(--bg-elev)', borderRadius: 6, padding: '0 3px', color: 'var(--ink-3)', border: '1px solid var(--line)' }}>{n}</span>}
                {isCore && s === 0 && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: 4, background: 'var(--ink-2)' }} />}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: 14, fontSize: 14.5 }}>
          <span>
            <b style={{ color: 'var(--green)' }}>{solved}</b> من {count} محلول
          </span>
          {review > 0 && (
            <span>
              <b style={{ color: 'var(--amber)' }}>{review}</b> تحتاج مراجعة
            </span>
          )}
          {core.length > 0 && (
            <span>
              الأساسية: <b>{coreDone}</b> من {core.length}
              {coreDone === core.length && ' 🎉'}
            </span>
          )}
        </div>
        <div style={{ height: 6, background: 'var(--bg-sunk)', borderRadius: 9, marginTop: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(100 * solved) / count}%`, background: 'var(--green)', transition: 'width .3s' }} />
        </div>
      </div>
      <figcaption className="widget-foot">
        اضغط رقم التمرين بعد حلّه: مرة ✓ محلول، ومرتين ↻ يحتاج مراجعة، وثالثة للإلغاء. الأرقام ذات الإطار الداكن والنقطة هي الحد الأدنى المقترح. حلول التمارين الفردية في الخطوة التالية.
      </figcaption>
    </figure>
  );
}
