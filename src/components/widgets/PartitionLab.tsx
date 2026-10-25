import { useState } from 'react';
import { Shell, Tex } from './Shell';

const COLORS = ['var(--set-a)', 'var(--set-b)', 'var(--set-c)', 'var(--violet)', 'var(--amber)', '#c2417a', '#3a8fa8', '#7a7a2e', '#8a5a3c', '#5a6acf', '#2e9a7a', '#b04e4e'];
const mod = (a: number, n: number) => ((a % n) + n) % n;

interface Rel { name: string; tex: (n: number) => string; label: (x: number, n: number) => number | string; usesN?: boolean; classTex: (l: number | string, n: number) => string }
const RELS: Rel[] = [
  { name: 'x ≡ y (mod n)', usesN: true, tex: (n) => `x \\equiv y \\pmod{${n}}`, label: (x, n) => mod(x, n), classTex: (l) => `[${l}]` },
  { name: '|x| = |y|', tex: () => '|x| = |y|', label: (x) => Math.abs(x), classTex: (l) => `\\{${l === 0 ? '0' : `-${l}, ${l}`}\\}` },
  { name: 'نفس آخر رقم', tex: () => '\\text{same last digit}', label: (x) => Math.abs(x) % 10, classTex: (l) => `\\text{last digit } ${l}` },
  { name: '⌊x/n⌋ = ⌊y/n⌋', usesN: true, tex: (n) => `\\lfloor x/${n} \\rfloor = \\lfloor y/${n} \\rfloor`, label: (x, n) => Math.floor(x / n), classTex: (l, n) => `\\{${+l * n}, \\dots, ${+l * n + n - 1}\\}` },
];

/** An equivalence relation on Z cuts it into disjoint classes: a partition. */
export default function PartitionLab() {
  const [ri, setRi] = useState(0);
  const [n, setN] = useState(3);
  const [pick, setPick] = useState<number | null>(4);
  const rel = RELS[ri];
  const xs = Array.from({ length: 25 }, (_, i) => i - 12);
  const labels = [...new Set(xs.map((x) => String(rel.label(x, n))))];
  const color = (x: number) => COLORS[labels.indexOf(String(rel.label(x, n))) % COLORS.length];
  const cls = pick === null ? [] : xs.filter((x) => rel.label(x, n) === rel.label(pick, n));
  return (
    <Shell title="من علاقة التكافؤ إلى التجزئة" foot="كل لون فصل تكافؤ. لاحظ أن كل عدد له لون واحد بالضبط: الفصول غير خالية، ولا تتقاطع، واتحادها كل الأعداد. هذا معنى التجزئة (المبرهنة 11.2).">
      <div className="controls">
        {RELS.map((r, i) => <button key={r.name} className="chip" aria-pressed={i === ri} onClick={() => setRi(i)}>{r.name}</button>)}
        {rel.usesN && (
          <label className="ltr" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Tex>{`n = ${n}`}</Tex>
            <input type="range" min={2} max={6} value={n} onChange={(e) => setN(+e.target.value)} />
          </label>
        )}
      </div>
      <div style={{ textAlign: 'center', marginBottom: 8 }}><Tex>{`x \\, R \\, y \\iff ${rel.tex(n)}`}</Tex></div>
      <div className="ltr" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
        {xs.map((x) => (
          <button key={x} onClick={() => setPick(x)} style={{ width: 34, height: 34, borderRadius: 8, border: `2px solid ${color(x)}`, background: cls.includes(x) ? color(x) : 'var(--bg-elev)', color: cls.includes(x) ? '#fff' : 'var(--ink)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{x}</button>
        ))}
        <span className="muted" style={{ alignSelf: 'center' }}>…</span>
      </div>
      {pick !== null && (
        <div className="result-row" style={{ marginTop: 10 }}>
          <Tex>{ri === 1 || ri === 3 ? `[${pick}] = ${rel.classTex(rel.label(pick, n), n)}` : `[${pick}] = \\{\\dots, ${cls.join(', ')}, \\dots\\}`}</Tex>
        </div>
      )}
      <p className="muted" style={{ margin: '6px 0 0', fontSize: 14 }}>اضغط أي عدد لترى فصله. عدد الفصول الظاهرة هنا: {labels.length}.</p>
    </Shell>
  );
}
