import { useState } from 'react';
import type React from 'react';
import { Shell, Tex } from './Shell';
import { Rich } from './QuickCheck';

type Num = { tex: string; level: 0 | 1 | 2 | 3; why: string };
// level: 0 = ℕ, 1 = ℤ, 2 = ℚ, 3 = ℝ (smallest system containing it)
const NUMS: Num[] = [
  { tex: '7', level: 0, why: 'عدد طبيعي، وبالتالي في كل الأنظمة الأكبر.' },
  { tex: '0', level: 1, why: 'في هذا الكتاب $\\mathbb{N} = \\{1, 2, 3, \\ldots\\}$، فالصفر ليس طبيعياً لكنه صحيح.' },
  { tex: '-3', level: 1, why: 'عدد صحيح سالب، فليس في $\\mathbb{N}$.' },
  { tex: '\\tfrac{2}{3}', level: 2, why: 'نسبة بين عددين صحيحين، وليس عدداً صحيحاً.' },
  { tex: '0.75', level: 2, why: 'يساوي $\\frac{3}{4}$، إذن نسبي.' },
  { tex: '0.\\overline{3}', level: 2, why: 'الكسر العشري الدوري يساوي $\\frac{1}{3}$، فهو نسبي.' },
  { tex: '\\tfrac{8}{4}', level: 0, why: 'يبدو كسراً، لكنه يساوي 2، فهو طبيعي! العنصر هو القيمة لا طريقة كتابتها.' },
  { tex: '\\sqrt{2}', level: 3, why: 'لا يمكن كتابته نسبة بين عددين صحيحين (ستبرهن ذلك في الفصل 6).' },
  { tex: '\\pi', level: 3, why: 'عدد حقيقي غير نسبي.' },
  { tex: '\\sqrt{9}', level: 0, why: 'يساوي 3.' },
];

const SYS = [
  { sym: '\\mathbb{N}', ar: 'الطبيعية', color: 'var(--set-a)' },
  { sym: '\\mathbb{Z}', ar: 'الصحيحة', color: 'var(--set-c)' },
  { sym: '\\mathbb{Q}', ar: 'النسبية', color: 'var(--set-b)' },
  { sym: '\\mathbb{R}', ar: 'الحقيقية', color: 'var(--violet)' },
];

export default function NumberSystems() {
  const [pick, setPick] = useState(1);
  const num = NUMS[pick];
  const token = (
    <span style={{ fontSize: '1.35em', background: 'var(--shade)', color: '#1d1f24', borderRadius: 10, padding: '0 12px', alignSelf: 'center' }}>
      <Tex>{num.tex}</Tex>
    </span>
  );
  const box = (lvl: number): React.ReactNode => {
    const s = SYS[lvl];
    const active = num.level <= lvl;
    return (
      <div
        style={{
          border: `2px solid ${s.color}`,
          borderRadius: 18,
          padding: '30px 12px 12px',
          position: 'relative',
          background: active ? `color-mix(in srgb, ${s.color} 9%, transparent)` : 'transparent',
          opacity: active ? 1 : 0.55,
          transition: 'all .25s',
          display: 'flex',
          gap: 12,
          minHeight: lvl === 0 ? 72 : undefined,
          justifyContent: 'space-between',
        }}
      >
        <span style={{ position: 'absolute', top: 5, insetInlineStart: 14, color: s.color, fontWeight: 700, fontSize: 14 }}>
          <Tex>{s.sym}</Tex> {s.ar} {active && '✓'}
        </span>
        {lvl > 0 && <div style={{ flex: 1 }}>{box(lvl - 1)}</div>}
        {num.level === lvl ? token : lvl === 0 ? <span /> : null}
      </div>
    );
  };
  return (
    <Shell title="أنظمة الأعداد متداخلة: ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ" foot="اختر عدداً لترى أصغر نظام يحتويه. لاحظ أن كل عدد في نظام ما موجود تلقائياً في كل الأنظمة الأوسع منه.">
      <div className="controls ltr" style={{ justifyContent: 'center' }}>
        {NUMS.map((n, i) => (
          <button key={i} className="chip" aria-pressed={i === pick} onClick={() => setPick(i)} style={i === pick ? { background: 'var(--shade)', borderColor: 'var(--amber)', color: '#1d1f24' } : undefined}>
            <Tex>{n.tex}</Tex>
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 560, margin: '8px auto 0' }}>{box(3)}</div>
      <p style={{ textAlign: 'center', margin: '12px 0 0' }}>
        <Tex>{num.tex}</Tex>: <Rich text={num.why} />
      </p>
    </Shell>
  );
}
