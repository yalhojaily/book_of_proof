import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Op = 'and' | 'or' | 'not' | 'imp' | 'iff';

const OPS: Record<Op, { tex: string; ar: string; f: (p: boolean, q: boolean) => boolean; why: (p: boolean, q: boolean) => string }> = {
  and: {
    tex: 'P \\wedge Q',
    ar: 'و',
    f: (p, q) => p && q,
    why: (p, q) => (p && q ? 'كلاهما صادق، فالعبارة صادقة.' : 'يكفي أن تكون إحداهما كاذبة لتكذب العبارة كلها.'),
  },
  or: {
    tex: 'P \\vee Q',
    ar: 'أو',
    f: (p, q) => p || q,
    why: (p, q) => (p || q ? (p && q ? 'كلاهما صادق، و«أو» في الرياضيات تقبل ذلك.' : 'واحدة صادقة على الأقل، فالعبارة صادقة.') : 'كلتاهما كاذبة، فالعبارة كاذبة.'),
  },
  not: {
    tex: '{\\sim} P',
    ar: 'ليس',
    f: (p) => !p,
    why: (p) => (p ? 'P صادقة، فنفيها كاذب.' : 'P كاذبة، فنفيها صادق.'),
  },
  imp: {
    tex: 'P \\Rightarrow Q',
    ar: 'إذا… فإن',
    f: (p, q) => !p || q,
    why: (p, q) =>
      p && !q
        ? 'الحالة الوحيدة التي يُنقض فيها الوعد: P صادقة وQ كاذبة.'
        : !p
          ? 'P كاذبة، فالوعد لم يُختبر أصلاً، ولم يُنقض. العبارة صادقة.'
          : 'P صادقة وQ صادقة: الوعد تحقق.',
  },
  iff: {
    tex: 'P \\Leftrightarrow Q',
    ar: 'إذا وفقط إذا',
    f: (p, q) => p === q,
    why: (p, q) => (p === q ? 'لهما قيمة الصدق نفسها، فالعبارة صادقة.' : 'قيمتا الصدق مختلفتان، فالعبارة كاذبة.'),
  },
};

const T = (b: boolean) => (b ? 'T' : 'F');

function Switch({ label, on, set, text }: { label: string; on: boolean; set: (v: boolean) => void; text?: string }) {
  return (
    <button
      onClick={() => set(!on)}
      aria-pressed={on}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 12,
        border: `2px solid ${on ? 'var(--green)' : 'var(--red)'}`,
        background: on ? 'var(--green-soft)' : 'var(--red-soft)',
        cursor: 'pointer',
        minWidth: 150,
      }}
    >
      <b style={{ fontFamily: 'KaTeX_Math, serif', fontSize: 20, fontStyle: 'italic' }}>{label}</b>
      <span style={{ width: 40, height: 22, borderRadius: 22, background: on ? 'var(--green)' : 'var(--red)', position: 'relative', flex: 'none' }}>
        <span style={{ position: 'absolute', top: 3, insetInlineStart: on ? 21 : 3, width: 16, height: 16, borderRadius: 16, background: '#fff', transition: 'inset-inline-start .15s' }} />
      </span>
      <span style={{ fontWeight: 700, color: on ? 'var(--green)' : 'var(--red)' }}>{on ? 'صادقة' : 'كاذبة'}</span>
      {text && <span className="muted" style={{ fontSize: 13.5 }}>{text}</span>}
    </button>
  );
}

/** Flip P and Q and watch every connective respond; the current row of each truth table lights up. */
export default function Connectives({ ops = ['and', 'or', 'not'], pText, qText }: { ops?: Op[]; pText?: string; qText?: string }) {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  const rows: [boolean, boolean][] = [[true, true], [true, false], [false, true], [false, false]];

  return (
    <Shell title="بدّل قيمة P وQ وراقب أدوات الربط" foot="اضغط على P أو Q لتبديل قيمة صدقها. الصف المضيء في كل جدول هو الحالة الحالية.">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 14 }}>
        <Switch label="P" on={p} set={setP} text={pText} />
        {(ops.length > 1 || ops[0] !== 'not') && <Switch label="Q" on={q} set={setQ} text={qText} />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        {ops.map((k) => {
          const o = OPS[k];
          const v = o.f(p, q);
          const tableRows = k === 'not' ? rows.filter(([, b]) => b).map(([a]) => [a, a] as [boolean, boolean]) : rows;
          return (
            <div key={k} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 10, background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="muted" style={{ fontSize: 13 }}>«{o.ar}»</span>
                <span className={v ? 'pill-ok' : 'pill-bad'}>{v ? 'صادقة' : 'كاذبة'}</span>
              </div>
              <table className="ltr" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ fontStyle: 'italic', fontWeight: 600 }}>P</th>
                    {k !== 'not' && <th style={{ fontStyle: 'italic', fontWeight: 600 }}>Q</th>}
                    <th><Tex>{o.tex}</Tex></th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map(([a, b], i) => {
                    const cur = k === 'not' ? a === p : a === p && b === q;
                    const r = o.f(a, b);
                    return (
                      <tr key={i} style={{ background: cur ? 'var(--shade-fill)' : undefined, transition: 'background .15s' }}>
                        <td style={{ textAlign: 'center', padding: '2px 0' }}>{T(a)}</td>
                        {k !== 'not' && <td style={{ textAlign: 'center' }}>{T(b)}</td>}
                        <td style={{ textAlign: 'center', fontWeight: 700, color: r ? 'var(--green)' : 'var(--red)' }}>{T(r)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.55 }}>{o.why(p, q)}</p>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
