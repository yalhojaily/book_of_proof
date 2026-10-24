import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { Shell, Tex } from './Shell';
import { parseLogic, evalLogic, varsOf, logicTex, subExpressions, rowsFor, TF, type LNode } from '@/lib/logic';

type Preset = { a: string; b?: string; note?: string };

function useParsed(src: string) {
  return useMemo(() => {
    try {
      return { node: parseLogic(src), err: null as string | null };
    } catch (e) {
      return { node: null as LNode | null, err: (e as Error).message };
    }
  }, [src]);
}

function ExprInput({ label, value, onChange, err }: { label?: string; value: string; onChange: (s: string) => void; err: string | null }) {
  const ref = useRef<HTMLInputElement>(null);
  const insert = (t: string) => {
    const el = ref.current;
    const a = el?.selectionStart ?? value.length;
    const b = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, a) + t + value.slice(b));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(a + t.length, a + t.length);
    });
  };
  return (
    <div style={{ flex: '1 1 280px', minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        {label && <b style={{ whiteSpace: 'nowrap' }}>{label}</b>}
        <input
          ref={ref}
          type="text"
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-label={label ?? 'العبارة'}
          style={{ flex: 1, minWidth: 0, fontSize: 16, letterSpacing: 0.5 }}
        />
      </div>
      <div className="ltr" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['P', 'Q', 'R', '∼', '∧', '∨', '⇒', '⇔', '(', ')'].map((t) => (
          <button key={t} className="chip" style={{ height: 30, minWidth: 30 }} onClick={() => insert(t)}>
            {t}
          </button>
        ))}
      </div>
      {err && <p className="pill-bad" style={{ marginTop: 6 }}>{err}</p>}
    </div>
  );
}

const cell = (v: boolean, strong = false, hl?: 'bad' | 'good'): CSSProperties => ({
  textAlign: 'center',
  padding: '4px 10px',
  fontWeight: strong ? 700 : 500,
  color: v ? 'var(--green)' : 'var(--red)',
  background: hl === 'bad' ? 'var(--red-soft)' : hl === 'good' ? 'var(--green-soft)' : undefined,
  borderBottom: '1px solid var(--line)',
  fontFamily: 'ui-monospace, monospace',
});

/**
 * Truth-table workbench.
 *  mode="table":    one statement, optional helper columns
 *  mode="compare":  two statements side by side, are they logically equivalent?
 *  mode="practice": fill in the last column yourself, then check
 */
export default function TruthTable({
  mode = 'table',
  presets = [],
  initial,
  initialB,
  title,
}: {
  mode?: 'table' | 'compare' | 'practice';
  presets?: Preset[];
  initial?: string;
  initialB?: string;
  title?: string;
}) {
  const [a, setA] = useState(initial ?? presets[0]?.a ?? '(P ∨ Q) ∧ ∼(P ∧ Q)');
  const [b, setB] = useState(initialB ?? presets[0]?.b ?? 'P ⇔ ∼Q');
  const [note, setNote] = useState(presets[0]?.note ?? '');
  const [helpers, setHelpers] = useState(mode === 'table');
  const [guess, setGuess] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const A = useParsed(a);
  const B = useParsed(b);
  const nodes = mode === 'compare' ? [A.node, B.node] : [A.node];
  const ok = nodes.every(Boolean);
  const vars = ok ? varsOf(...(nodes as LNode[])) : [];
  const rows = rowsFor(vars);
  const helperCols = ok && helpers && mode !== 'practice' ? subExpressions(A.node!).slice(0, -1) : [];
  const diffRows = mode === 'compare' && ok ? rows.map((env, i) => (evalLogic(A.node!, env) !== evalLogic(B.node!, env) ? i : -1)).filter((i) => i >= 0) : [];
  const finalA = ok ? rows.map((env) => evalLogic(A.node!, env)) : [];
  const practiceRight = mode === 'practice' && ok && rows.every((_, i) => guess[i] === finalA[i]);
  const alwaysTrue = ok && finalA.every(Boolean);
  const alwaysFalse = ok && finalA.every((v) => !v);

  const loadPreset = (p: Preset) => {
    setA(p.a);
    if (p.b) setB(p.b);
    setNote(p.note ?? '');
    setGuess({});
    setChecked(false);
  };

  const th: CSSProperties = { padding: '6px 10px', borderBottom: '2px solid var(--line-strong)', fontWeight: 600, whiteSpace: 'nowrap' };

  return (
    <Shell
      title={title ?? (mode === 'compare' ? 'هل العبارتان متكافئتان منطقياً؟' : mode === 'practice' ? 'املأ جدول الصدق بنفسك' : 'مولّد جداول الصدق')}
      foot={
        <>
          اكتب بالرموز أو من لوحة المفاتيح: <code>~</code> للنفي، <code>&amp;</code> لـ «و»، <code>|</code> لـ «أو»، <code>{'=>'}</code> للشرط، <code>{'<=>'}</code> للشرط الثنائي. الصفوف بترتيب الكتاب نفسه.
        </>
      }
    >
      {presets.length > 0 && (
        <div className="controls">
          {presets.map((p, i) => (
            <button key={i} className="btn" aria-pressed={p.a === a && (mode !== 'compare' || p.b === b)} onClick={() => loadPreset(p)}>
              {mode === 'compare' ? `مثال ${i + 1}` : <Tex>{logicTex(parseLogic(p.a))}</Tex>}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <ExprInput label={mode === 'compare' ? 'الأولى' : undefined} value={a} onChange={(s) => { setA(s); setNote(''); setGuess({}); setChecked(false); }} err={A.err} />
        {mode === 'compare' && <ExprInput label="الثانية" value={b} onChange={(s) => { setB(s); setNote(''); }} err={B.err} />}
      </div>
      {mode === 'table' && (
        <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginBottom: 8, fontSize: 14 }}>
          <input type="checkbox" checked={helpers} onChange={(e) => setHelpers(e.target.checked)} /> أظهر الأعمدة المساعدة
        </label>
      )}
      {ok && (
        <div className="ltr" style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: 15 }}>
            <thead>
              <tr>
                {vars.map((v) => (
                  <th key={v} style={{ ...th, fontStyle: 'italic' }}>{v}</th>
                ))}
                {helperCols.map((h, i) => (
                  <th key={i} style={{ ...th, color: 'var(--ink-3)', fontWeight: 400 }}>
                    <Tex>{logicTex(h)}</Tex>
                  </th>
                ))}
                <th style={{ ...th, background: 'var(--amber-soft)' }}>
                  <Tex>{logicTex(A.node!)}</Tex>
                </th>
                {mode === 'compare' && (
                  <th style={{ ...th, background: 'var(--violet-soft)' }}>
                    <Tex>{logicTex(B.node!)}</Tex>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((env, i) => {
                const bad = diffRows.includes(i);
                const vA = finalA[i];
                return (
                  <tr key={i}>
                    {vars.map((v) => (
                      <td key={v} style={{ ...cell(env[v]), color: 'var(--ink-2)', fontWeight: 600 }}>{TF(env[v])}</td>
                    ))}
                    {helperCols.map((h, k) => {
                      const v = evalLogic(h, env);
                      return <td key={k} style={{ ...cell(v), opacity: 0.75 }}>{TF(v)}</td>;
                    })}
                    {mode === 'practice' ? (
                      <td style={{ ...cell(guess[i] ?? true, true, checked ? (guess[i] === vA ? 'good' : 'bad') : undefined), padding: 3 }}>
                        <button
                          className="chip"
                          onClick={() => { setGuess({ ...guess, [i]: !(guess[i] ?? false) }); setChecked(false); }}
                          style={{ height: 28, minWidth: 40, color: guess[i] === undefined ? 'var(--ink-3)' : guess[i] ? 'var(--green)' : 'var(--red)' }}
                        >
                          {guess[i] === undefined ? '?' : TF(guess[i])}
                        </button>
                      </td>
                    ) : (
                      <td style={cell(vA, true, bad ? 'bad' : undefined)}>{TF(vA)}</td>
                    )}
                    {mode === 'compare' && (
                      <td style={cell(evalLogic(B.node!, env), true, bad ? 'bad' : undefined)}>{TF(evalLogic(B.node!, env))}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {ok && mode === 'compare' && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: diffRows.length ? 'var(--red-soft)' : 'var(--green-soft)' }}>
          {diffRows.length === 0 ? (
            <b style={{ color: 'var(--green)' }}>✓ متكافئتان منطقياً: العمودان متطابقان في كل الصفوف.</b>
          ) : (
            <>
              <b style={{ color: 'var(--red)' }}>✗ غير متكافئتين.</b> تختلفان في {diffRows.length === 1 ? 'صف واحد' : `${diffRows.length} صفوف`} (المظلل بالأحمر)، ويكفي صف واحد لنفي التكافؤ.
            </>
          )}
          {note && <div className="muted" style={{ marginTop: 4 }}>{note}</div>}
        </div>
      )}
      {ok && mode === 'practice' && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          <button className="btn active" onClick={() => setChecked(true)}>تحقّق</button>
          <button className="btn" onClick={() => { setGuess({}); setChecked(false); }}>امسح</button>
          {checked && (practiceRight ? <span className="pill-ok">✓ الجدول صحيح</span> : <span className="pill-bad">راجع الخانات الحمراء</span>)}
        </div>
      )}
      {ok && mode === 'table' && (alwaysTrue || alwaysFalse || note) && (
        <p className="muted" style={{ marginTop: 10, textAlign: 'center' }}>
          {alwaysTrue && 'العبارة صادقة في كل الصفوف، مهما كانت قيم المتغيرات. '}
          {alwaysFalse && 'العبارة كاذبة في كل الصفوف، مهما كانت قيم المتغيرات. '}
          {note}
        </p>
      )}
    </Shell>
  );
}
