import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Step = { tex: string; rule: string };
type Item = { title: string; words: string; steps: Step[]; result: string };

const ITEMS: Item[] = [
  {
    title: 'نفي «أو»',
    words: 'الدالة f متصلة أو قابلة للاشتقاق.',
    steps: [
      { tex: '{\\sim}(P \\vee Q)', rule: 'نكتب العبارة رمزياً، حيث P تعني «f متصلة» وQ تعني «f قابلة للاشتقاق».' },
      { tex: '({\\sim}P) \\wedge ({\\sim}Q)', rule: 'قانون دي مورغان: نفي «أو» يصبح «و» بين النفيين.' },
    ],
    result: 'الدالة f ليست متصلة وليست قابلة للاشتقاق.',
  },
  {
    title: 'نفي «لكل»',
    words: 'لكل عدد طبيعي n، العدد ⁦n² + n⁩ زوجي.',
    steps: [
      { tex: '{\\sim}\\big(\\forall n \\in \\mathbb{N},\\ n^2 + n \\text{ is even}\\big)', rule: 'نضع النفي أمام العبارة كلها.' },
      { tex: '\\exists n \\in \\mathbb{N},\\ {\\sim}(n^2 + n \\text{ is even})', rule: 'نفي ∀ يصبح ∃، ويدخل النفي إلى الداخل.' },
      { tex: '\\exists n \\in \\mathbb{N},\\ n^2 + n \\text{ is odd}', rule: 'نبسّط: العدد الصحيح الذي ليس زوجياً فردي.' },
    ],
    result: 'يوجد عدد طبيعي n يكون ⁦n² + n⁩ عنده فردياً. (والأصلية صادقة، فالنفي كاذب.)',
  },
  {
    title: 'نفي «يوجد»',
    words: 'يوجد عدد صحيح مربّعه يساوي 3.',
    steps: [
      { tex: '{\\sim}\\big(\\exists x \\in \\mathbb{Z},\\ x^2 = 3\\big)', rule: 'نضع النفي أمام العبارة.' },
      { tex: '\\forall x \\in \\mathbb{Z},\\ {\\sim}(x^2 = 3)', rule: 'نفي ∃ يصبح ∀.' },
      { tex: '\\forall x \\in \\mathbb{Z},\\ x^2 \\neq 3', rule: 'نبسّط.' },
    ],
    result: 'لكل عدد صحيح x، مربّعه لا يساوي 3.',
  },
  {
    title: 'مكمِّمان',
    words: 'لكل عدد حقيقي x يوجد عدد حقيقي y بحيث ⁦x + y = 0⁩.',
    steps: [
      { tex: '{\\sim}\\big(\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ x + y = 0\\big)', rule: 'نضع النفي أمام العبارة.' },
      { tex: '\\exists x \\in \\mathbb{R},\\ {\\sim}\\big(\\exists y \\in \\mathbb{R},\\ x + y = 0\\big)', rule: 'المكمِّم الأول: ∀ يصبح ∃.' },
      { tex: '\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ {\\sim}(x + y = 0)', rule: 'المكمِّم الثاني: ∃ يصبح ∀.' },
      { tex: '\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x + y \\neq 0', rule: 'نبسّط.' },
    ],
    result: 'يوجد عدد حقيقي x لا يجعله أي عدد حقيقي y يحقق ⁦x + y = 0⁩.',
  },
  {
    title: 'نفي شرط',
    words: 'إذا كان n عدداً صحيحاً زوجياً، فإن n² زوجي.',
    steps: [
      { tex: '\\forall n \\in \\mathbb{Z},\\ (n \\text{ even}) \\Rightarrow (n^2 \\text{ even})', rule: 'الشرط مع متغير يعني «لكل n» ضمنياً (القسم 2.8).' },
      { tex: '{\\sim}\\big(\\forall n \\in \\mathbb{Z},\\ (n \\text{ even}) \\Rightarrow (n^2 \\text{ even})\\big)', rule: 'نضع النفي.' },
      { tex: '\\exists n \\in \\mathbb{Z},\\ {\\sim}\\big((n \\text{ even}) \\Rightarrow (n^2 \\text{ even})\\big)', rule: 'نفي ∀ يصبح ∃.' },
      { tex: '\\exists n \\in \\mathbb{Z},\\ (n \\text{ even}) \\wedge {\\sim}(n^2 \\text{ even})', rule: 'نفي الشرط: يصبح «المقدَّم صادق والتالي كاذب».' },
      { tex: '\\exists n \\in \\mathbb{Z},\\ (n \\text{ even}) \\wedge (n^2 \\text{ odd})', rule: 'نبسّط.' },
    ],
    result: 'يوجد عدد صحيح زوجي مربّعه فردي. لاحظ أن النفي ليس «إذا… فإن…» أخرى، بل «و».',
  },
  {
    title: 'تعريف التقارب',
    words: 'لكل ⁦ε > 0⁩ يوجد N بحيث ⁦|aₙ − L| < ε⁩ لكل ⁦n ≥ N⁩.',
    steps: [
      { tex: '{\\sim}\\big(\\forall \\varepsilon > 0,\\ \\exists N \\in \\mathbb{N},\\ \\forall n \\ge N,\\ |a_n - L| < \\varepsilon\\big)', rule: 'نضع النفي أمام العبارة. (ستلقى هذا التعريف في الفصل 13.)' },
      { tex: '\\exists \\varepsilon > 0,\\ {\\sim}\\big(\\exists N \\in \\mathbb{N},\\ \\forall n \\ge N,\\ |a_n - L| < \\varepsilon\\big)', rule: '∀ تصبح ∃.' },
      { tex: '\\exists \\varepsilon > 0,\\ \\forall N \\in \\mathbb{N},\\ {\\sim}\\big(\\forall n \\ge N,\\ |a_n - L| < \\varepsilon\\big)', rule: '∃ تصبح ∀.' },
      { tex: '\\exists \\varepsilon > 0,\\ \\forall N \\in \\mathbb{N},\\ \\exists n \\ge N,\\ {\\sim}(|a_n - L| < \\varepsilon)', rule: '∀ تصبح ∃.' },
      { tex: '\\exists \\varepsilon > 0,\\ \\forall N \\in \\mathbb{N},\\ \\exists n \\ge N,\\ |a_n - L| \\ge \\varepsilon', rule: 'نبسّط. لاحظ أن «⁦ε > 0⁩» و«⁦n ≥ N⁩» قيود على المتغير، فلا تُنفى.' },
    ],
    result: 'يوجد ⁦ε > 0⁩ بحيث مهما اخترت N، تجد ⁦n ≥ N⁩ يكون عنده aₙ بعيداً عن L بمقدار ε على الأقل.',
  },
];

/** Push a negation inward one rule at a time. */
export default function NegationStepper() {
  const [k, setK] = useState(0);
  const [shown, setShown] = useState(1);
  const it = ITEMS[k];
  const done = shown >= it.steps.length;
  return (
    <Shell title="أدخل النفي خطوة بخطوة" foot="في كل خطوة قاعدة واحدة: دي مورغان، أو نفي المكمِّم، أو نفي الشرط. حاول أن تتوقع الخطوة التالية قبل أن تكشفها.">
      <div className="controls">
        {ITEMS.map((x, i) => (
          <button key={i} className="btn" aria-pressed={i === k} onClick={() => { setK(i); setShown(1); }}>{x.title}</button>
        ))}
      </div>
      <p style={{ margin: '0 0 10px', fontWeight: 600 }}>العبارة: «{it.words}» ونريد نفيها.</p>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {it.steps.slice(0, shown).map((s, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 13, display: 'grid', placeItems: 'center', background: i === shown - 1 ? 'var(--amber)' : 'var(--bg-sunk)', color: i === shown - 1 ? '#fff' : 'var(--ink-2)', fontWeight: 700, fontSize: 13 }}>{i + 1}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ overflowX: 'auto', padding: '2px 0', textAlign: 'left' }} className="ltr">
                {i > 0 && <span className="muted" style={{ marginInlineEnd: 6 }}>=</span>}
                <Tex>{s.tex}</Tex>
              </div>
              <div className="muted" style={{ fontSize: 14 }}>{s.rule}</div>
            </div>
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        {!done && <button className="btn active" onClick={() => setShown(shown + 1)}>الخطوة التالية</button>}
        {!done && <button className="btn" onClick={() => setShown(it.steps.length)}>اعرض كل الخطوات</button>}
        {shown > 1 && <button className="btn" onClick={() => setShown(1)}>من البداية</button>}
      </div>
      {done && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--green-soft)' }}>
          <b style={{ color: 'var(--green)' }}>النفي بالكلمات:</b> {it.result}
        </div>
      )}
    </Shell>
  );
}
