import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Step = { ok: boolean; tex: string; why: string };
interface SetDef { tex: string; hint: string; placeholder: string; check: (raw: string) => Step[] | string }

const nums = (raw: string) => raw.split(/[,\s()]+/).filter(Boolean).map(Number);
const isInt = (x: number) => Number.isInteger(x);
const mod = (a: number, n: number) => ((a % n) + n) % n;

const SETS: SetDef[] = [
  {
    tex: String.raw`A = \{x : x \in \mathbb{N} \text{ and } 7 \mid x\}`,
    hint: 'عدد واحد',
    placeholder: '21',
    check: (raw) => {
      const [a] = nums(raw);
      if (a === undefined || Number.isNaN(a)) return 'اكتب عدداً';
      return [
        { ok: isInt(a) && a > 0, tex: `${a} \\in \\mathbb{N}`, why: 'الشرط الأول في P(a)' },
        { ok: isInt(a) && a % 7 === 0, tex: `7 \\mid ${a}`, why: isInt(a) && a % 7 === 0 ? `${a} = 7 \\cdot ${a / 7}` : 'الباقي ليس صفراً' },
      ];
    },
  },
  {
    tex: String.raw`B = \{(x, y) \in \mathbb{Z} \times \mathbb{Z} : x \equiv y \pmod 5\}`,
    hint: 'زوج مرتب: عددان',
    placeholder: '8, 23',
    check: (raw) => {
      const [a, b] = nums(raw);
      if (b === undefined || Number.isNaN(a) || Number.isNaN(b)) return 'اكتب عددين، مثل 8, 23';
      const okZ = isInt(a) && isInt(b);
      return [
        { ok: okZ, tex: `(${a}, ${b}) \\in \\mathbb{Z} \\times \\mathbb{Z}`, why: 'أولاً: هل الزوج من المجموعة الأم S؟' },
        { ok: okZ && mod(a - b, 5) === 0, tex: `${a} \\equiv ${b} \\pmod 5`, why: `الفرق ${a - b}${okZ && mod(a - b, 5) === 0 ? ' يقبل القسمة على 5' : ' لا يقبل القسمة على 5'}` },
      ];
    },
  },
  {
    tex: String.raw`C = \{3x^3 + 2 : x \in \mathbb{Z}\}`,
    hint: 'عدد واحد: هل يوجد x صحيح يعطيه؟',
    placeholder: '-22',
    check: (raw) => {
      const [c] = nums(raw);
      if (c === undefined || Number.isNaN(c)) return 'اكتب عدداً';
      const x = Math.round(Math.cbrt((c - 2) / 3));
      const ok = isInt(c) && 3 * x ** 3 + 2 === c;
      return [
        { ok, tex: ok ? `${c} = 3(${x})^3 + 2` : `3x^3 + 2 = ${c} \\iff x^3 = ${+((c - 2) / 3).toFixed(4)}`, why: ok ? `وجدنا x = ${x} صحيحاً` : 'لا يوجد عدد صحيح مكعبه بهذه القيمة' },
      ];
    },
  },
  {
    tex: String.raw`D = \{X \in \mathcal{P}(\mathbb{N}) : |X| = 3\}`,
    hint: 'مجموعة: اكتب عناصرها',
    placeholder: '4, 13, 45',
    check: (raw) => {
      const xs = nums(raw);
      if (!xs.length || xs.some(Number.isNaN)) return 'اكتب عناصر المجموعة';
      const set = [...new Set(xs)];
      return [
        { ok: set.every((x) => isInt(x) && x > 0), tex: `\\{${set.join(', ')}\\} \\subseteq \\mathbb{N}`, why: 'كل عناصرها يجب أن تكون أعداداً طبيعية' },
        { ok: set.length === 3, tex: `|\\{${set.join(', ')}\\}| = ${set.length}`, why: xs.length !== set.length ? 'العناصر المكررة تُعدّ مرة واحدة' : 'عدد العناصر' },
      ];
    },
  },
];

/** To show a ∈ {x ∈ S : P(x)}: check a ∈ S, then check P(a). */
export default function MembershipTester() {
  const [si, setSi] = useState(1);
  const [raw, setRaw] = useState(SETS[1].placeholder);
  const def = SETS[si];
  const res = def.check(raw);
  const all = Array.isArray(res) && res.every((s) => s.ok);
  return (
    <Shell title="هل العنصر في المجموعة؟" foot="لتبرهن أن عنصراً ينتمي إلى مجموعة معرّفة بشرط: تحقق أولاً أنه من المجموعة الأم S، ثم أن الشرط P صادق له. لا شيء غير ذلك. وإذا كانت المجموعة قيم صيغة مثل 3x³ + 2، فابحث عن x صحيح يعطي العنصر.">
      <div className="controls">
        {SETS.map((s, i) => (
          <button key={i} className="chip" aria-pressed={i === si} onClick={() => { setSi(i); setRaw(SETS[i].placeholder); }}>
            {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', margin: '4px 0 10px', overflowX: 'auto' }}><Tex>{def.tex}</Tex></div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>العنصر ({def.hint}):</span>
        <input dir="ltr" value={raw} onChange={(e) => setRaw(e.target.value)} style={{ width: 160, font: 'inherit', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line-strong)', background: 'var(--bg-elev)', color: 'var(--ink)' }} />
      </label>
      {typeof res === 'string' ? (
        <p className="muted">{res}</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
            {res.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 10px', borderRadius: 10, background: s.ok ? 'var(--green-soft)' : 'var(--red-soft)' }}>
                <b style={{ color: s.ok ? 'var(--green)' : 'var(--red)' }}>{s.ok ? '✓' : '✗'}</b>
                <Tex>{s.tex}</Tex>
                <span className="muted" style={{ fontSize: 14 }}>{s.why.includes('\\') ? <Tex>{s.why}</Tex> : s.why}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: '10px 0 0', fontWeight: 600, color: all ? 'var(--green)' : 'var(--red)' }}>
            {all ? 'العنصر ينتمي إلى المجموعة.' : 'العنصر لا ينتمي إلى المجموعة: فشل شرط واحد على الأقل.'}
          </p>
        </>
      )}
    </Shell>
  );
}
