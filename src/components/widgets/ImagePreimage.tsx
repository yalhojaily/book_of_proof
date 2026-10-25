import { useState } from 'react';
import { Shell, Tex } from './Shell';

const A = ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const F = [4, 8, 4, 0, 1, 1, 6, 8]; // like Example 12.13
const B = Array.from({ length: 10 }, (_, i) => i);

/** Choose X ⊆ A to see f(X), or Y ⊆ B to see f⁻¹(Y). */
export default function ImagePreimage() {
  const [mode, setMode] = useState<'img' | 'pre'>('img');
  const [X, setX] = useState<Set<number>>(new Set([0, 1, 2]));
  const [Y, setY] = useState<Set<number>>(new Set([4, 9]));
  const tog = (s: Set<number>, v: number) => { const t = new Set(s); t.has(v) ? t.delete(v) : t.add(v); return t; };
  const fX = new Set([...X].map((i) => F[i]));
  const preY = new Set(A.map((_, i) => i).filter((i) => Y.has(F[i])));
  const back = new Set(A.map((_, i) => i).filter((i) => fX.has(F[i])));
  const onA = (i: number) => (mode === 'img' ? X.has(i) : preY.has(i));
  const onB = (j: number) => (mode === 'img' ? fX.has(j) : Y.has(j));
  const ya = (i: number) => 30 + i * 30, yb = (j: number) => 22 + j * 25;
  const setTex = (s: Set<number>, names: (string | number)[]) => (s.size ? `\\{${[...s].sort((p, q) => p - q).map((k) => names[k]).join(', ')}\\}` : '\\varnothing');
  return (
    <Shell title="الصورة والصورة العكسية" foot="⁦f(X) =⁩ كل صور عناصر X. و ⁦f⁻¹(Y) =⁩ كل عناصر A التي تقع صورها في Y. الصورة العكسية معرّفة لكل دالة، حتى لو لم تكن الدالة العكسية موجودة.">
      <div className="controls">
        <button className="btn" aria-pressed={mode === 'img'} onClick={() => setMode('img')}>اختر X في A</button>
        <button className="btn" aria-pressed={mode === 'pre'} onClick={() => setMode('pre')}>اختر Y في B</button>
      </div>
      <svg viewBox="0 0 300 280" style={{ width: '100%', maxWidth: 330, display: 'block', margin: '0 auto', direction: 'ltr' }} role="img" aria-label="الصورة والصورة العكسية">
        <defs><marker id="ip-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)" /></marker></defs>
        {A.map((_, i) => <line key={i} x1={74} y1={ya(i)} x2={214} y2={yb(F[i])} stroke={onA(i) && onB(F[i]) ? 'var(--violet)' : 'var(--line-strong)'} strokeWidth={onA(i) && onB(F[i]) ? 2.2 : 1} markerEnd="url(#ip-h)" />)}
        {A.map((n, i) => (
          <g key={n} onClick={() => mode === 'img' && setX(tog(X, i))} style={{ cursor: mode === 'img' ? 'pointer' : 'default' }}>
            <circle cx={60} cy={ya(i)} r={12} fill={onA(i) ? 'var(--set-a)' : 'var(--bg-elev)'} stroke="var(--set-a)" />
            <text x={60} y={ya(i) + 5} textAnchor="middle" fontWeight={700} fill={onA(i) ? '#fff' : 'var(--ink)'}>{n}</text>
          </g>
        ))}
        {B.map((j) => (
          <g key={j} onClick={() => mode === 'pre' && setY(tog(Y, j))} style={{ cursor: mode === 'pre' ? 'pointer' : 'default' }}>
            <circle cx={228} cy={yb(j)} r={10} fill={onB(j) ? 'var(--set-b)' : 'var(--bg-elev)'} stroke="var(--set-b)" />
            <text x={228} y={yb(j) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={onB(j) ? '#fff' : 'var(--ink)'}>{j}</text>
          </g>
        ))}
        <text x={60} y={276} textAnchor="middle" fontWeight={700} fill="var(--set-a)">A</text>
        <text x={228} y={276} textAnchor="middle" fontWeight={700} fill="var(--set-b)">B</text>
      </svg>
      {mode === 'img' ? (
        <>
          <div className="result-row ltr" style={{ justifyContent: 'center' }}><Tex>{`X = ${setTex(X, A)},\\quad f(X) = ${setTex(fX, B)}`}</Tex></div>
          <div className="result-row ltr" style={{ justifyContent: 'center' }}><Tex>{`f^{-1}(f(X)) = ${setTex(back, A)}`}</Tex></div>
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>{back.size > X.size ? <>لاحظ: <Tex>{'f^{-1}(f(X))'}</Tex> أكبر من <Tex>X</Tex>، لأن f ليست متباينة. لكن دائماً <Tex>{'X \\subseteq f^{-1}(f(X))'}</Tex> (تمرين 5).</> : <>هنا <Tex>{'f^{-1}(f(X)) = X'}</Tex>. أضف إلى X عنصراً يشارك غيره الصورة لترى الفرق.</>}</p>
        </>
      ) : (
        <div className="result-row ltr" style={{ justifyContent: 'center' }}><Tex>{`Y = ${setTex(Y, B)},\\quad f^{-1}(Y) = ${setTex(preY, A)}`}</Tex></div>
      )}
    </Shell>
  );
}
