import { useState } from 'react';
import { Shell, Tex } from './Shell';

const isPrime = (x: number) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };

const PREDS: { key: string; tex: string; ar: string; f: (x: number) => boolean }[] = [
  { key: 'm6', tex: 'x \\text{ is a multiple of } 6', ar: 'x من مضاعفات 6', f: (x) => x % 6 === 0 },
  { key: 'even', tex: 'x \\text{ is even}', ar: 'x زوجي', f: (x) => x % 2 === 0 },
  { key: 'm3', tex: 'x \\text{ is a multiple of } 3', ar: 'x من مضاعفات 3', f: (x) => x % 3 === 0 },
  { key: 'm4', tex: 'x \\text{ is a multiple of } 4', ar: 'x من مضاعفات 4', f: (x) => x % 4 === 0 },
  { key: 'prime', tex: 'x \\text{ is prime}', ar: 'x أولي', f: isPrime },
  { key: 'odd', tex: 'x \\text{ is odd}', ar: 'x فردي', f: (x) => x % 2 === 1 },
  { key: 'sqodd', tex: 'x^2 \\text{ is odd}', ar: 'x² فردي', f: (x) => (x * x) % 2 === 1 },
  { key: 'gt2', tex: 'x > 2', ar: 'x أكبر من 2', f: (x) => x > 2 },
];

const XS = Array.from({ length: 30 }, (_, i) => i + 1);

/**
 * An open conditional P(x) ⇒ Q(x) is read as "for all x". Every x lands in one of four boxes;
 * the statement is false exactly when the "P true, Q false" box is non-empty.
 */
export default function OpenConditional({ initialP = 'm6', initialQ = 'even', showVariants = true }: { initialP?: string; initialQ?: string; showVariants?: boolean }) {
  const [pk, setPk] = useState(initialP);
  const [qk, setQk] = useState(initialQ);
  const P = PREDS.find((p) => p.key === pk)!;
  const Q = PREDS.find((p) => p.key === qk)!;
  const cls = (x: number) => (P.f(x) ? (Q.f(x) ? 'tt' : 'tf') : Q.f(x) ? 'ft' : 'ff');
  const groups = { tt: XS.filter((x) => cls(x) === 'tt'), tf: XS.filter((x) => cls(x) === 'tf'), ft: XS.filter((x) => cls(x) === 'ft'), ff: XS.filter((x) => cls(x) === 'ff') };
  const forward = groups.tf.length === 0;
  const converse = groups.ft.length === 0;

  const Box = ({ k, title, bad }: { k: keyof typeof groups; title: string; bad?: boolean }) => (
    <div style={{ border: `2px ${bad && groups[k].length ? 'solid' : 'dashed'} ${bad && groups[k].length ? 'var(--red)' : 'var(--line-strong)'}`, borderRadius: 12, padding: 10, background: bad && groups[k].length ? 'var(--red-soft)' : 'var(--bg)' }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 30 }}>
        {groups[k].length === 0 ? <span className="muted" style={{ fontSize: 13 }}>لا أحد</span> : groups[k].map((x) => (
          <span key={x} className="chip" style={{ height: 28, minWidth: 30, cursor: 'default', ...(bad ? { borderColor: 'var(--red)', color: 'var(--red)' } : {}) }}>{x}</span>
        ))}
      </div>
    </div>
  );

  const Verdict = ({ tex, v, ar, cx }: { tex: string; v: boolean; ar: string; cx?: number }) => (
    <div className="result-row">
      <span className={v ? 'pill-ok' : 'pill-bad'}>{v ? 'صادقة' : 'كاذبة'}</span>
      <Tex>{tex}</Tex>
      <span className="muted" style={{ fontSize: 14 }}>{ar}{!v && cx !== undefined && <> مثال مضاد: <Tex>{`x = ${cx}`}</Tex>.</>}</span>
    </div>
  );

  const sel = (val: string, set: (s: string) => void, label: string) => (
    <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <b style={{ fontFamily: 'KaTeX_Math, serif', fontStyle: 'italic' }}>{label}</b>
      <select value={val} onChange={(e) => set(e.target.value)}>
        {PREDS.map((p) => <option key={p.key} value={p.key}>{p.ar}</option>)}
      </select>
    </label>
  );

  return (
    <Shell title="الشرط مع متغير: هل يصح لكل x؟" foot="كل عدد من 1 إلى 30 يقع في أحد الصناديق الأربعة. العبارة P(x) ⇒ Q(x) تعني «لكل x»، فتكون كاذبة إذا وُجد ولو عدد واحد في الصندوق الأحمر.">
      <div className="controls" style={{ gap: 14 }}>
        {sel(pk, setPk, 'P(x):')}
        {sel(qk, setQk, 'Q(x):')}
      </div>
      <div style={{ textAlign: 'center', margin: '4px 0 10px', fontSize: '1.1em' }}>
        <Tex>{`(${P.tex}) \\Rightarrow (${Q.tex})`}</Tex>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
        <Box k="tt" title="P صادقة وQ صادقة" />
        <Box k="tf" title="P صادقة وQ كاذبة (يكسر الشرط)" bad />
        <Box k="ft" title="P كاذبة وQ صادقة" />
        <Box k="ff" title="P كاذبة وQ كاذبة" />
      </div>
      <div style={{ marginTop: 10 }}>
        <Verdict tex={'\\forall x,\\ P(x) \\Rightarrow Q(x)'} v={forward} ar="العبارة الأصلية." cx={groups.tf[0]} />
        {showVariants && (
          <>
            <Verdict tex={'\\forall x,\\ {\\sim}Q(x) \\Rightarrow {\\sim}P(x)'} v={forward} ar="العكس النقيض: دائماً بقيمة الأصلية نفسها." cx={groups.tf[0]} />
            <Verdict tex={'\\forall x,\\ Q(x) \\Rightarrow P(x)'} v={converse} ar="العكس: قد يختلف عن الأصلية." cx={groups.ft[0]} />
          </>
        )}
      </div>
    </Shell>
  );
}
