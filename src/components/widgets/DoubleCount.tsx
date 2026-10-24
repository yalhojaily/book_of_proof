import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { lists } from '@/lib/comb';

/**
 * Count lists that contain at least one E. Splitting by "where is the E" double-counts
 * when repetition is allowed; the subtraction principle does not.
 */
export default function DoubleCount() {
  const [rep, setRep] = useState(true);
  const [method, setMethod] = useState<'types' | 'subtract'>('types');
  const S = ['A', 'B', 'E'];
  const k = 3;
  const all = lists(S, k, rep);
  const withE = all.filter((l) => l.includes('E'));
  const times = (l: string[]) => l.filter((x) => x === 'E').length;
  const typeSum = [0, 1, 2].map((pos) => all.filter((l) => l[pos] === 'E').length);
  const typeTotal = typeSum.reduce((a, b) => a + b, 0);

  return (
    <Shell title="العدّ المكرر: قوائم فيها E" foot="قوائم بطول 3 من الرموز A وB وE. الأرقام الصغيرة فوق كل قائمة: كم مرة عُدّت بطريقة «أين E؟».">
      <div className="controls">
        <button className="btn" aria-pressed={rep} onClick={() => setRep(true)}>التكرار مسموح</button>
        <button className="btn" aria-pressed={!rep} onClick={() => setRep(false)}>دون تكرار</button>
        <span style={{ width: 12 }} />
        <button className="btn" aria-pressed={method === 'types'} onClick={() => setMethod('types')}>قسّم حسب موضع E</button>
        <button className="btn" aria-pressed={method === 'subtract'} onClick={() => setMethod('subtract')}>الكل ناقص ما ليس فيه E</button>
      </div>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', fontFamily: 'ui-monospace, monospace' }}>
        {all.map((l, i) => {
          const has = l.includes('E');
          const t = times(l);
          return (
            <span key={i} style={{ position: 'relative', padding: '4px 9px', borderRadius: 7, border: `1.5px solid ${has ? (method === 'types' && t > 1 ? 'var(--red)' : 'var(--green)') : 'var(--line)'}`, background: has ? (method === 'types' && t > 1 ? 'var(--red-soft)' : 'var(--green-soft)') : 'var(--bg)', opacity: has ? 1 : method === 'subtract' ? 0.85 : 0.45, textDecoration: !has && method === 'subtract' ? 'line-through' : 'none' }}>
              {l.map((c, j) => <span key={j} style={{ color: c === 'E' ? 'var(--set-b)' : undefined, fontWeight: c === 'E' ? 800 : 500 }}>{c}</span>)}
              {method === 'types' && has && (
                <span style={{ position: 'absolute', top: -8, insetInlineEnd: -6, fontSize: 10.5, fontWeight: 700, background: t > 1 ? 'var(--red)' : 'var(--green)', color: '#fff', borderRadius: 8, padding: '0 4px', fontFamily: 'var(--font-ui)' }}>×{t}</span>
              )}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="result-row" style={{ justifyContent: 'center' }}>
          <span>العدد الصحيح:</span> <b style={{ color: 'var(--green)', fontSize: '1.15em' }}>{withE.length}</b>
        </div>
        {method === 'types' ? (
          <div className="result-row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <Tex>{`\\underbrace{${typeSum[0]}}_{E\\ \\text{1st}} + \\underbrace{${typeSum[1]}}_{E\\ \\text{2nd}} + \\underbrace{${typeSum[2]}}_{E\\ \\text{3rd}} = ${typeTotal}`}</Tex>
            {typeTotal === withE.length ? <span className="pill-ok">صحيح: الأنواع منفصلة</span> : <span className="pill-bad">أكثر من الصحيح بـ {typeTotal - withE.length}: القوائم الحمراء عُدّت أكثر من مرة</span>}
          </div>
        ) : (
          <div className="result-row" style={{ justifyContent: 'center' }}>
            <Tex>{`\\underbrace{${all.length}}_{\\text{all}} - \\underbrace{${all.length - withE.length}}_{\\text{no } E} = ${withE.length}`}</Tex>
            <span className="pill-ok">مبدأ الطرح: لا تكرار في العدّ</span>
          </div>
        )}
        <p className="muted" style={{ margin: '6px 0 0', textAlign: 'center' }}>
          {rep ? 'مع التكرار يمكن أن تحتوي القائمة أكثر من E، فتقع في أكثر من نوع. لذلك يصلح هنا مبدأ الطرح.' : 'دون تكرار لا يظهر E إلا مرة واحدة، فالأنواع منفصلة ومبدأ الجمع يعمل.'}
        </p>
      </div>
    </Shell>
  );
}
