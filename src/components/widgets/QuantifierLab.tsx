import { useState } from 'react';
import { Shell, Tex } from './Shell';

/* ───────── one variable: ∀ / ∃ over a small set of integers ───────── */

const PRED: { key: string; tex: string; ar: string; f: (x: number) => boolean }[] = [
  { key: 'even', tex: 'x \\text{ is even}', ar: 'x زوجي', f: (x) => x % 2 === 0 },
  { key: 'pos', tex: 'x > 0', ar: 'x موجب', f: (x) => x > 0 },
  { key: 'sq', tex: 'x^2 \\ge x', ar: 'مربع x لا يقل عنه', f: (x) => x * x >= x },
  { key: 'prime', tex: 'x \\text{ is prime}', ar: 'x أولي', f: (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; } },
  { key: 'lt10', tex: 'x < 10', ar: 'x أصغر من 10', f: (x) => x < 10 },
];

function OneVar() {
  const POOL = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [X, setX] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6]));
  const [pk, setPk] = useState('even');
  const P = PRED.find((p) => p.key === pk)!;
  const xs = POOL.filter((x) => X.has(x));
  const yes = xs.filter(P.f);
  const no = xs.filter((x) => !P.f(x));
  const all = xs.length > 0 && no.length === 0;
  const some = yes.length > 0;
  const setTex = xs.length ? `\\{${xs.join(', ')}\\}` : '\\varnothing';
  return (
    <>
      <div className="controls">
        <span>الشرط <Tex>{'P(x)'}</Tex>:</span>
        {PRED.map((p) => (
          <button key={p.key} className="btn" aria-pressed={p.key === pk} onClick={() => setPk(p.key)}>
            <Tex>{p.tex}</Tex>
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 8 }}>
        <span className="muted" style={{ fontSize: 14 }}>اختر عناصر المجموعة <Tex>X</Tex>:</span>
        <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
          {POOL.map((x) => {
            const inX = X.has(x);
            const ok = P.f(x);
            return (
              <button
                key={x}
                className="chip"
                onClick={() => { const n = new Set(X); n.has(x) ? n.delete(x) : n.add(x); setX(n); }}
                aria-pressed={inX}
                style={inX ? { background: ok ? 'var(--green-soft)' : 'var(--red-soft)', borderColor: ok ? 'var(--green)' : 'var(--red)', color: ok ? 'var(--green)' : 'var(--red)' } : { opacity: 0.45 }}
              >
                {x}
              </button>
            );
          })}
        </div>
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        <Tex>{`X = ${setTex}`}</Tex>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginTop: 8 }}>
        <div style={{ padding: 12, borderRadius: 12, border: `2px solid ${all ? 'var(--green)' : 'var(--red)'}`, background: all ? 'var(--green-soft)' : 'var(--red-soft)' }}>
          <div style={{ textAlign: 'center', fontSize: '1.15em' }}><Tex>{`\\forall x \\in X,\\ ${P.tex}`}</Tex></div>
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>
            <b>{all ? 'صادقة' : 'كاذبة'}</b>:{' '}
            {xs.length === 0 ? 'X خالية، فلا يوجد عنصر يخرق الشرط. (صادقة بانتفاء الموضوع!)' : all ? `كل عناصر X تحقق الشرط.` : <>يكفي مثال مضاد واحد: <Tex>{`x = ${no[0]}`}</Tex>.</>}
          </p>
        </div>
        <div style={{ padding: 12, borderRadius: 12, border: `2px solid ${some ? 'var(--green)' : 'var(--red)'}`, background: some ? 'var(--green-soft)' : 'var(--red-soft)' }}>
          <div style={{ textAlign: 'center', fontSize: '1.15em' }}><Tex>{`\\exists x \\in X,\\ ${P.tex}`}</Tex></div>
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>
            <b>{some ? 'صادقة' : 'كاذبة'}</b>:{' '}
            {some ? <>يكفي مثال واحد: <Tex>{`x = ${yes[0]}`}</Tex>.</> : xs.length === 0 ? 'X خالية، فلا يوجد أي عنصر أصلاً.' : 'لا يوجد عنصر في X يحقق الشرط.'}
          </p>
        </div>
      </div>
    </>
  );
}

/* ───────── two variables: order of quantifiers ───────── */

const N = 5;
const PRESETS: { name: string; f: (x: number, y: number) => boolean }[] = [
  { name: 'y = x', f: (x, y) => x === y },
  { name: 'y ≥ x', f: (x, y) => y >= x },
  { name: 'y = 3', f: (_x, y) => y === 3 },
  { name: 'x = 2', f: (x) => x === 2 },
  { name: 'الكل', f: () => true },
  { name: 'لا شيء', f: () => false },
];

type Stmt = { tex: string; read: string; eval: (R: boolean[][]) => { v: boolean; why: string; hl: (x: number, y: number) => boolean } };
const idx = Array.from({ length: N }, (_, i) => i);
const STMTS: Stmt[] = [
  {
    tex: '\\forall x,\\ \\exists y,\\ R(x,y)',
    read: 'كل صف فيه خانة مظللة واحدة على الأقل',
    eval: (R) => {
      const bad = idx.find((x) => !idx.some((y) => R[x][y]));
      return bad === undefined
        ? { v: true, why: 'لكل x وجدنا y خاصاً به (قد يختلف من صف لآخر).', hl: (x, y) => R[x][y] && y === idx.find((yy) => R[x][yy]) }
        : { v: false, why: `الصف x = ${bad + 1} لا خانة فيه.`, hl: (x) => x === bad };
    },
  },
  {
    tex: '\\exists y,\\ \\forall x,\\ R(x,y)',
    read: 'يوجد عمود مظلل بالكامل',
    eval: (R) => {
      const good = idx.find((y) => idx.every((x) => R[x][y]));
      return good !== undefined
        ? { v: true, why: `العمود y = ${good + 1} يصلح لكل x معاً.`, hl: (_x, y) => y === good }
        : { v: false, why: 'لا يوجد y واحد يصلح لكل الصفوف في الوقت نفسه.', hl: () => false };
    },
  },
  {
    tex: '\\forall y,\\ \\exists x,\\ R(x,y)',
    read: 'كل عمود فيه خانة مظللة',
    eval: (R) => {
      const bad = idx.find((y) => !idx.some((x) => R[x][y]));
      return bad === undefined
        ? { v: true, why: 'كل عمود فيه خانة واحدة على الأقل.', hl: () => false }
        : { v: false, why: `العمود y = ${bad + 1} فارغ.`, hl: (_x, y) => y === bad };
    },
  },
  {
    tex: '\\exists x,\\ \\forall y,\\ R(x,y)',
    read: 'يوجد صف مظلل بالكامل',
    eval: (R) => {
      const good = idx.find((x) => idx.every((y) => R[x][y]));
      return good !== undefined
        ? { v: true, why: `الصف x = ${good + 1} مظلل كله.`, hl: (x) => x === good }
        : { v: false, why: 'لا يوجد صف مظلل بالكامل.', hl: () => false };
    },
  },
];

function TwoVar() {
  const [R, setR] = useState<boolean[][]>(() => idx.map((x) => idx.map((y) => x === y)));
  const [focus, setFocus] = useState(0);
  const res = STMTS.map((s) => s.eval(R));
  const toggle = (x: number, y: number) => setR(R.map((row, i) => row.map((v, j) => (i === x && j === y ? !v : v))));
  const f = res[focus];
  return (
    <>
      <div className="controls">
        <span>علاقة جاهزة:</span>
        {PRESETS.map((p) => (
          <button key={p.name} className="btn" onClick={() => setR(idx.map((x) => idx.map((y) => p.f(x + 1, y + 1))))}>
            <span className="ltr">{p.name}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div className="ltr" style={{ flex: 'none' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 4 }}>
            <thead>
              <tr>
                <th style={{ fontSize: 12, color: 'var(--ink-3)' }}>x \ y</th>
                {idx.map((y) => <th key={y} style={{ fontStyle: 'italic', color: 'var(--set-b)' }}>{y + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {idx.map((x) => (
                <tr key={x}>
                  <th style={{ fontStyle: 'italic', color: 'var(--set-a)', paddingInlineEnd: 4 }}>{x + 1}</th>
                  {idx.map((y) => {
                    const on = R[x][y];
                    const hl = f.hl(x, y);
                    return (
                      <td key={y} style={{ padding: 0 }}>
                        <button
                          onClick={() => toggle(x, y)}
                          aria-label={`R(${x + 1}, ${y + 1}) ${on ? 'صادقة' : 'كاذبة'}`}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            cursor: 'pointer',
                            border: `2px solid ${hl ? (f.v ? 'var(--green)' : 'var(--red)') : 'var(--line-strong)'}`,
                            background: on ? 'var(--set-a)' : hl && !f.v ? 'var(--red-soft)' : 'var(--bg-elev)',
                            boxShadow: hl ? `0 0 0 2px ${f.v ? 'var(--green-soft)' : 'var(--red-soft)'}` : 'none',
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: 12.5, textAlign: 'center', margin: '4px 0 0', direction: 'rtl' }}>الخانة الملونة تعني أن <Tex>{'R(x,y)'}</Tex> صادقة</p>
        </div>
        <div style={{ flex: '1 1 280px', display: 'grid', gap: 8 }}>
          {STMTS.map((s, i) => (
            <button
              key={i}
              onClick={() => setFocus(i)}
              style={{
                textAlign: 'start',
                padding: '8px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                border: `2px solid ${i === focus ? 'var(--ink-2)' : 'var(--line)'}`,
                background: res[i].v ? 'var(--green-soft)' : 'var(--red-soft)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <Tex>{s.tex}</Tex>
                <span className={res[i].v ? 'pill-ok' : 'pill-bad'}>{res[i].v ? 'صادقة' : 'كاذبة'}</span>
              </div>
              <div className="muted" style={{ fontSize: 13.5 }}>{s.read}</div>
            </button>
          ))}
        </div>
      </div>
      <p style={{ margin: '12px 0 0', textAlign: 'center' }}>
        <Tex>{STMTS[focus].tex}</Tex>: {f.why}
      </p>
    </>
  );
}

export default function QuantifierLab({ start = 'one' }: { start?: 'one' | 'two' }) {
  const [tab, setTab] = useState<'one' | 'two'>(start);
  return (
    <Shell
      title="ملعب المكمِّمات"
      foot={tab === 'one' ? 'غيّر المجموعة X والشرط. الأخضر يحقق الشرط والأحمر لا يحققه.' : 'اضغط الخانات لتغيير العلاقة، حيث x وy من 1 إلى 5. جرّب أن تجعل العبارة الأولى صادقة والثانية كاذبة: هذا هو الفرق بين ترتيبَي المكمِّمين.'}
    >
      <div className="controls">
        <button className="btn" aria-pressed={tab === 'one'} onClick={() => setTab('one')}>متغير واحد</button>
        <button className="btn" aria-pressed={tab === 'two'} onClick={() => setTab('two')}>متغيران: هل يهم الترتيب؟</button>
      </div>
      {tab === 'one' ? <OneVar /> : <TwoVar />}
    </Shell>
  );
}
