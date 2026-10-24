import { useState } from 'react';
import { Shell, Tex, fmtSet } from './Shell';

/** Pick two sets and see whether one is a subset of the other, with the witness that breaks it. */
export default function SubsetChecker() {
  const U = [1, 2, 3, 4, 5, 6, 7, 8];
  const [A, setA] = useState<Set<number>>(new Set([2, 4]));
  const [B, setB] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const sorted = (s: Set<number>) => [...s].sort((p, q) => p - q);
  const toggle = (w: 'A' | 'B', x: number) => {
    const [s, set] = w === 'A' ? [A, setA] : [B, setB];
    const n = new Set(s);
    n.has(x) ? n.delete(x) : n.add(x);
    set(n);
  };
  const badAB = sorted(A).filter((x) => !B.has(x));
  const badBA = sorted(B).filter((x) => !A.has(x));
  const Verdict = ({ l, r, bad }: { l: string; r: string; bad: number[] }) => (
    <div className="result-row">
      {bad.length === 0 ? (
        <>
          <span className="pill-ok">صحيح</span>
          <Tex>{`${l} \\subseteq ${r}`}</Tex>
          <span className="muted">
            {(l === 'A' ? A : B).size === 0 ? `${l} خالية، ولا يوجد عنصر فيها يمكن أن يخرق الشرط.` : `كل عنصر في ${l} موجود في ${r}.`}
          </span>
        </>
      ) : (
        <>
          <span className="pill-bad">خطأ</span>
          <Tex>{`${l} \\not\\subseteq ${r}`}</Tex>
          <span className="muted">
            لأن <Tex>{`${bad[0]} \\in ${l}`}</Tex> لكن <Tex>{`${bad[0]} \\notin ${r}`}</Tex>. يكفي عنصر واحد لنفي الاحتواء.
          </span>
        </>
      )}
    </div>
  );

  return (
    <Shell title="هل A مجموعة جزئية من B؟" foot="اضغط على الأعداد لتغيير المجموعتين. جرّب أن تجعل A خالية، أو أن تجعل A = B.">
      <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
        {(['A', 'B'] as const).map((w) => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <b style={{ width: 22, color: w === 'A' ? 'var(--set-a)' : 'var(--set-b)', fontFamily: 'KaTeX_Math, serif', fontSize: 19 }}>{w}</b>
            <div className="ltr" style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {U.map((x) => {
                const on = (w === 'A' ? A : B).has(x);
                const bad = (w === 'A' && badAB[0] === x) || (w === 'B' && badBA[0] === x);
                return (
                  <button
                    key={x}
                    className={`chip ${on ? (w === 'A' ? 'in-a' : 'in-b') : ''}`}
                    onClick={() => toggle(w, x)}
                    aria-pressed={on}
                    style={bad ? { boxShadow: '0 0 0 2px var(--red)' } : undefined}
                  >
                    {x}
                  </button>
                );
              })}
            </div>
            <span style={{ marginInlineStart: 6 }}>
              <Tex>{`${w} = ${fmtSet(sorted(w === 'A' ? A : B))}`}</Tex>
            </span>
          </div>
        ))}
      </div>
      <Verdict l="A" r="B" bad={badAB} />
      <Verdict l="B" r="A" bad={badBA} />
      {badAB.length === 0 && badBA.length === 0 && (
        <p style={{ margin: '8px 0 0' }}>
          كل منهما جزئية من الأخرى، إذن <Tex>{'A = B'}</Tex>. هذه هي الطريقة المعتادة لبرهان تساوي مجموعتين (الفصل 8).
        </p>
      )}
    </Shell>
  );
}
