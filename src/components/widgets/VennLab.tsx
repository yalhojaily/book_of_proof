import { useMemo, useState, useRef } from 'react';
import { Shell, Tex } from './Shell';
import { Venn, LAYOUT3 } from './venn';
import { parse, evalAtom, toTex, describeAtom, type Node } from '@/lib/setexpr';

const PRESETS: { l: string; r: string; note: string }[] = [
  { l: '(A∪B)∩C', r: 'A∪(B∩C)', note: 'مكان القوسين يغيّر المعنى، لذلك لا نكتب ⁦A ∪ B ∩ C⁩ دون أقواس.' },
  { l: "(A∪B)'", r: "A'∩B'", note: 'قانون دي مورغان: متممة الاتحاد تساوي تقاطع المتممتين.' },
  { l: "(A∩B)'", r: "A'∪B'", note: 'قانون دي مورغان الثاني.' },
  { l: 'A∩(B∪C)', r: '(A∩B)∪(A∩C)', note: 'التوزيع: التقاطع يتوزع على الاتحاد.' },
  { l: 'A−(B∪C)', r: '(A−B)∩(A−C)', note: 'حذف ⁦B ∪ C⁩ من A هو حذف B وحذف C معاً.' },
  { l: 'A−(B∩C)', r: '(A−B)∩(A−C)', note: 'تبدو صحيحة، لكنها ليست كذلك. أين تختلفان؟' },
];

function useExpr(src: string): { node: Node | null; err: string | null } {
  return useMemo(() => {
    try {
      return { node: parse(src), err: null };
    } catch (e) {
      return { node: null, err: (e as Error).message };
    }
  }, [src]);
}

function ExprPanel({ label, src, setSrc, node, err, diff }: {
  label: string;
  src: string;
  setSrc: (s: string) => void;
  node: Node | null;
  err: string | null;
  diff: number[];
}) {
  const ref = useRef<HTMLInputElement>(null);
  const insert = (t: string) => {
    const el = ref.current;
    if (!el) return setSrc(src + t);
    const a = el.selectionStart ?? src.length;
    const b = el.selectionEnd ?? src.length;
    const next = src.slice(0, a) + t + src.slice(b);
    setSrc(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + t.length, a + t.length);
    });
  };
  return (
    <div style={{ flex: '1 1 300px', minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
        <b>{label}</b>
        <input
          ref={ref}
          type="text"
          dir="ltr"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          aria-label={`التعبير ${label}`}
          spellCheck={false}
          style={{ flex: 1, minWidth: 0, fontSize: 16, letterSpacing: 1 }}
        />
      </div>
      <div className="ltr" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
        {['A', 'B', 'C', '∪', '∩', '−', "'", '(', ')'].map((t) => (
          <button key={t} className="chip" style={{ height: 30, minWidth: 30 }} onClick={() => insert(t)} title={t === "'" ? 'المتممة' : undefined}>
            {t === "'" ? <Tex>{'\\overline{X}'}</Tex> : t}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 34, textAlign: 'center' }}>
        {node ? <Tex>{toTex(node)}</Tex> : <span className="pill-bad">{err}</span>}
      </div>
      <Venn layout={LAYOUT3} shaded={(a) => !!node && evalAtom(node, a)} highlight={(a) => diff.includes(a)} ariaLabel={`مخطط فن للتعبير ${src}`} />
    </div>
  );
}

export default function VennLab() {
  const [l, setL] = useState(PRESETS[0].l);
  const [r, setR] = useState(PRESETS[0].r);
  const [note, setNote] = useState(PRESETS[0].note);
  const L = useExpr(l);
  const R = useExpr(r);
  const atoms = Array.from({ length: 8 }, (_, a) => a);
  const diff = L.node && R.node ? atoms.filter((a) => evalAtom(L.node!, a) !== evalAtom(R.node!, a)) : [];
  const ok = L.node && R.node;

  return (
    <Shell
      title="مختبر مخططات فِن: هل التعبيران متساويان؟"
      foot={<>اكتب أي تعبير بـ A وB وC. يمكنك الكتابة من لوحة المفاتيح: <code>u</code> للاتحاد، <code>n</code> للتقاطع، <code>-</code> للفرق، <code>'</code> بعد المجموعة للمتممة. المناطق المخططة بالأحمر هي حيث يختلف التعبيران.</>}
    >
      <div className="controls">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            className="btn"
            aria-pressed={p.l === l && p.r === r}
            onClick={() => {
              setL(p.l);
              setR(p.r);
              setNote(p.note);
            }}
          >
            مثال {i + 1}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <ExprPanel label="الأول" src={l} setSrc={(s) => { setL(s); setNote(''); }} node={L.node} err={L.err} diff={diff} />
        <ExprPanel label="الثاني" src={r} setSrc={(s) => { setR(s); setNote(''); }} node={R.node} err={R.err} diff={diff} />
      </div>
      {ok && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: diff.length ? 'var(--red-soft)' : 'var(--green-soft)' }}>
          {diff.length === 0 ? (
            <b style={{ color: 'var(--green)' }}>✓ متساويان: المخططان متطابقان في كل المناطق الثماني.</b>
          ) : (
            <>
              <b style={{ color: 'var(--red)' }}>✗ غير متساويين.</b> يختلفان في {diff.length === 1 ? 'منطقة واحدة' : `${diff.length} مناطق`}:{' '}
              {diff.map((a) => describeAtom(a, 3)).join('، ')}.
            </>
          )}
          {note && <div className="muted" style={{ marginTop: 4 }}>{note}</div>}
        </div>
      )}
    </Shell>
  );
}
