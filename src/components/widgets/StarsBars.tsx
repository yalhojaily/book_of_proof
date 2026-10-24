import { useState } from 'react';
import { Shell, Tex } from './Shell';
import { choose, fact, fmt } from '@/lib/comb';

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

/** Multisets of size k from n types ↔ strings of k stars and n − 1 bars. */
export function StarsBars() {
  const [n, setN] = useState(4);
  const [mult, setMult] = useState<number[]>([2, 1, 0, 2]);
  const types = LETTERS.slice(0, n);
  const m = types.map((_, i) => mult[i] ?? 0);
  const k = m.reduce((a, b) => a + b, 0);
  const setType = (i: number, d: number) => setMult(types.map((_, j) => Math.max(0, Math.min(6, (m[j] ?? 0) + (j === i ? d : 0)))));
  const ms = types.flatMap((t, i) => Array(m[i]).fill(t));

  return (
    <Shell title="النجوم والفواصل: عدّ المجموعات المتعددة" foot="غيّر عدد كل نوع بالزرين + و−. كل مجموعة متعددة تقابل سطراً واحداً بالضبط من النجوم والفواصل، والعكس.">
      <div className="controls">
        <label className="ltr" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tex>{`\\text{types } n = ${n}`}</Tex>
          <input type="range" min={2} max={6} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <div className="ltr" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
        {types.map((t, i) => (
          <div key={t} style={{ textAlign: 'center', padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', minWidth: 64 }}>
            <div style={{ fontWeight: 700, fontStyle: 'italic', fontSize: 18 }}>{t}</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
              <button className="chip" style={{ height: 26, minWidth: 26 }} onClick={() => setType(i, -1)} aria-label={`أنقص ${t}`}>−</button>
              <b style={{ minWidth: 14 }}>{m[i]}</b>
              <button className="chip" style={{ height: 26, minWidth: 26 }} onClick={() => setType(i, 1)} aria-label={`زد ${t}`}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        <Tex>{ms.length ? `[${ms.join(', ')}]` : '[\\ ]'}</Tex>
        <span className="muted">مجموعة متعددة عدد عناصرها <Tex>{`k = ${k}`}</Tex></span>
      </div>
      <div className="ltr" style={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', fontSize: 26, fontWeight: 700, margin: '10px 0' }}>
        {types.map((t, i) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: m[i] }, (_, j) => <span key={j} title={t} style={{ color: `hsl(${(i * 60 + 200) % 360} 60% 50%)` }}>∗</span>)}
            {i < n - 1 && <span style={{ color: 'var(--ink-2)', margin: '0 4px' }}>|</span>}
          </span>
        ))}
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        <span>عدد النجوم {k}، وعدد الفواصل {n - 1}، فعدد الخانات {k + n - 1}، نختار منها مواضع النجوم:</span>
        <Tex>{`\\binom{k + n - 1}{k} = \\binom{${k + n - 1}}{${k}} = ${fmt(choose(k + n - 1, k))}`}</Tex>
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '4px 0 0' }}>هذا عدد كل المجموعات المتعددة التي فيها {k} عناصر من {n} أنواع.</p>
    </Shell>
  );
}

/** Permutations of a multiset: n! / (m1! m2! ... ). */
export function Anagrams() {
  const [word, setWord] = useState('MISSISSIPPI');
  const w = word.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 14);
  const freq = [...new Set(w.split(''))].map((c) => [c, w.split(c).length - 1] as [string, number]).sort((a, b) => b[1] - a[1]);
  const total = freq.reduce((acc, [, m]) => acc / fact(m), fact(w.length));
  const tex = `\\frac{${w.length}!}{${freq.map(([, m]) => `${m}!`).join('\\,')}}`;
  return (
    <Shell title="ترتيبات الحروف مع التكرار" foot="اكتب أي كلمة إنجليزية. لو كانت الحروف كلها مختلفة لكان عدد الترتيبات n!، لكن تبديل حرفين متطابقين لا ينتج ترتيباً جديداً، فنقسم على مضروب تكرار كل حرف.">
      <div className="controls" style={{ justifyContent: 'center' }}>
        <input type="text" dir="ltr" value={word} onChange={(e) => setWord(e.target.value)} style={{ fontSize: 18, letterSpacing: 2, width: 220, textTransform: 'uppercase' }} aria-label="الكلمة" />
        {['MISSISSIPPI', 'BANANA', 'LETTER', 'ABCDE'].map((x) => <button key={x} className="btn" onClick={() => setWord(x)}>{x}</button>)}
      </div>
      <div className="ltr" style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', margin: '6px 0 10px' }}>
        {w.split('').map((ch, i) => {
          const idx = freq.findIndex(([c]) => c === ch);
          return <span key={i} style={{ width: 34, height: 40, display: 'grid', placeItems: 'center', borderRadius: 8, fontWeight: 800, fontSize: 18, background: `hsl(${(idx * 70 + 20) % 360} 70% 88%)`, color: '#1d1f24', border: '1px solid var(--line-strong)' }}>{ch}</span>;
        })}
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        {freq.map(([c, m]) => <span key={c} className="ltr" style={{ fontFamily: 'ui-monospace, monospace' }}>{c}×{m}</span>)}
      </div>
      <div className="result-row" style={{ justifyContent: 'center', fontSize: '1.15em' }}>
        <Tex>{`${tex} = ${fmt(total)}`}</Tex>
      </div>
    </Shell>
  );
}

export default StarsBars;
