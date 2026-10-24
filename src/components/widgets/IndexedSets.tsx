import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Iv = { lo: number; hi: number; lc: boolean; hc: boolean };

type Family = {
  key: string;
  tex: string;
  make: (n: number) => Iv;
  texN: (n: number) => string;
  range: [number, number];
  limitUnion: string;
  limitInter: string;
  note: string;
};

const fr = (n: number) => (n === 1 ? '1' : `\\tfrac{1}{${n}}`);

const FAMILIES: Family[] = [
  {
    key: 'grow',
    tex: 'A_n = [-n,\\, n]',
    make: (n) => ({ lo: -n, hi: n, lc: true, hc: true }),
    texN: (n) => `[-${n}, ${n}]`,
    range: [-12.5, 12.5],
    limitUnion: '\\mathbb{R}',
    limitInter: '[-1, 1]',
    note: 'كل مجموعة تحتوي التي قبلها. الاتحاد يكبر بلا حدّ حتى يغطي ℝ كلها، والتقاطع يبقى أصغرها: A₁.',
  },
  {
    key: 'shrink',
    tex: 'A_n = [0,\\, \\tfrac{1}{n}]',
    make: (n) => ({ lo: 0, hi: 1 / n, lc: true, hc: true }),
    texN: (n) => `[0, ${fr(n)}]`,
    range: [-0.1, 1.1],
    limitUnion: '[0, 1]',
    limitInter: '\\{0\\}',
    note: 'المجالات تنكمش نحو الصفر. العدد 0 في كل منها، أما أي عدد موجب x فسيخرج حين يصبح 1/n أصغر منه. لذا التقاطع اللانهائي هو {0} فقط.',
  },
  {
    key: 'open',
    tex: 'A_n = (0,\\, \\tfrac{1}{n})',
    make: (n) => ({ lo: 0, hi: 1 / n, lc: false, hc: false }),
    texN: (n) => `(0, ${fr(n)})`,
    range: [-0.1, 1.1],
    limitUnion: '(0, 1)',
    limitInter: '\\varnothing',
    note: 'نفس المثال لكن بمجالات مفتوحة. الآن 0 ليس في أي منها، فالتقاطع اللانهائي خالٍ، مع أن كل تقاطع منتهٍ غير خالٍ!',
  },
  {
    key: 'walk',
    tex: 'A_n = [n,\\, n+1]',
    make: (n) => ({ lo: n, hi: n + 1, lc: true, hc: true }),
    texN: (n) => `[${n}, ${n + 1}]`,
    range: [0, 14],
    limitUnion: '[1, \\infty)',
    limitInter: '\\varnothing',
    note: 'مجالات متجاورة تشترك كل اثنتين متتاليتين في نقطة واحدة. الاتحاد شريط متصل، والتقاطع يصبح خالياً من n = 3.',
  },
  {
    key: 'fill',
    tex: 'A_n = [\\tfrac{1}{n},\\, 2-\\tfrac{1}{n}]',
    make: (n) => ({ lo: 1 / n, hi: 2 - 1 / n, lc: true, hc: true }),
    texN: (n) => `[${fr(n)}, ${n === 1 ? '1' : `2-${fr(n)}`}]`,
    range: [-0.1, 2.1],
    limitUnion: '(0, 2)',
    limitInter: '\\{1\\}',
    note: 'المجالات تتمدد نحو 0 و2 دون أن تبلغهما. لذلك الاتحاد اللانهائي مفتوح الطرفين، مع أن كل مجال مغلق.',
  },
];

function inter(ivs: Iv[]): Iv | null {
  let r = ivs[0];
  for (const v of ivs.slice(1)) {
    const lo = Math.max(r.lo, v.lo);
    const hi = Math.min(r.hi, v.hi);
    const lc = (r.lo === lo ? r.lc : true) && (v.lo === lo ? v.lc : true);
    const hc = (r.hi === hi ? r.hc : true) && (v.hi === hi ? v.hc : true);
    r = { lo, hi, lc, hc };
  }
  if (r.lo > r.hi || (r.lo === r.hi && !(r.lc && r.hc))) return null;
  return r;
}

function union(ivs: Iv[]): Iv[] {
  const s = [...ivs].sort((a, b) => a.lo - b.lo || Number(b.lc) - Number(a.lc));
  const out: Iv[] = [];
  for (const v of s) {
    const last = out[out.length - 1];
    if (last && (v.lo < last.hi || (v.lo === last.hi && (v.lc || last.hc)))) {
      if (v.hi > last.hi) {
        last.hi = v.hi;
        last.hc = v.hc;
      } else if (v.hi === last.hi) last.hc = last.hc || v.hc;
      if (v.lo === last.lo) last.lc = last.lc || v.lc;
    } else out.push({ ...v });
  }
  return out;
}

const fmt = (x: number) => (Number.isInteger(x) ? String(x) : x.toFixed(3).replace(/0+$/, ''));
const ivTex = (v: Iv) => (v.lo === v.hi ? `\\{${fmt(v.lo)}\\}` : `${v.lc ? '[' : '('}${fmt(v.lo)}, ${fmt(v.hi)}${v.hc ? ']' : ')'}`);

export default function IndexedSets() {
  const [fi, setFi] = useState(0);
  const [N, setN] = useState(4);
  const f = FAMILIES[fi];
  const ivs = Array.from({ length: N }, (_, i) => f.make(i + 1));
  const I = inter(ivs);
  const Uu = union(ivs);

  const W = 640;
  const padX = 40;
  const rowH = 18;
  const [r0, r1] = f.range;
  const X = (x: number) => padX + ((x - r0) / (r1 - r0)) * (W - 2 * padX);
  const showRows = Math.min(N, 12);
  const H = 40 + showRows * rowH + 92;
  const yU = 40 + showRows * rowH + 22;
  const yI = yU + 30;

  const bar = (v: Iv, y: number, color: string, thick = 6, key?: string | number) => (
    <g key={key}>
      <line x1={X(v.lo)} x2={X(v.hi)} y1={y} y2={y} stroke={color} strokeWidth={thick} strokeLinecap="butt" opacity={0.9} />
      {[['lo', v.lc], ['hi', v.hc]].map(([side, closed]) => (
        <circle key={side as string} cx={X(side === 'lo' ? v.lo : v.hi)} cy={y} r={thick / 2 + 2.2} fill={closed ? color : 'var(--bg-elev)'} stroke={color} strokeWidth={2} />
      ))}
    </g>
  );

  const ticks: number[] = [];
  const span = r1 - r0;
  const stepT = span > 20 ? 4 : span > 10 ? 2 : span > 3 ? 1 : span > 1.5 ? 0.5 : 0.25;
  for (let t = Math.ceil(r0 / stepT) * stepT; t <= r1 + 1e-9; t += stepT) ticks.push(Math.round(t * 1000) / 1000);

  return (
    <Shell
      title="اتحاد عائلة من المجموعات وتقاطعها"
      foot="حرّك N لترى كيف يتغير الاتحاد والتقاطع عند إضافة مجموعات. الدائرة الممتلئة تعني أن الطرف داخل المجال، والفارغة أنه خارجه."
    >
      <div className="controls">
        {FAMILIES.map((q, i) => (
          <button key={q.key} className="btn" aria-pressed={i === fi} onClick={() => setFi(i)}>
            <Tex>{q.tex}</Tex>
          </button>
        ))}
      </div>
      <div className="controls ltr" style={{ justifyContent: 'center' }}>
        <Tex>{`N = ${N}`}</Tex>
        <input type="range" min={1} max={12} value={N} onChange={(e) => setN(Number(e.target.value))} aria-label="عدد المجموعات N" />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', direction: 'ltr' }} role="img" aria-label="المجالات على خط الأعداد">
        <line x1={padX - 10} x2={W - padX + 10} y1={22} y2={22} stroke="var(--line-strong)" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={X(t)} x2={X(t)} y1={18} y2={H - 8} stroke="var(--line)" strokeDasharray="2 4" />
            <text x={X(t)} y={13} fontSize={11} textAnchor="middle" fill="var(--ink-3)">{fmt(t)}</text>
          </g>
        ))}
        {ivs.slice(0, showRows).map((v, i) => (
          <g key={i}>
            <text x={8} y={40 + i * rowH + 4} fontSize={11} fill="var(--ink-3)">A{i + 1}</text>
            {bar(v, 40 + i * rowH, 'var(--set-a)', 5)}
          </g>
        ))}
        <text x={8} y={yU + 4} fontSize={14} fontWeight={700} fill="var(--set-b)">∪</text>
        {Uu.map((v, i) => bar(v, yU, 'var(--set-b)', 8, i))}
        <text x={8} y={yI + 4} fontSize={14} fontWeight={700} fill="var(--amber)">∩</text>
        {I ? bar(I, yI, 'var(--amber)', 8) : <text x={X((r0 + r1) / 2)} y={yI + 5} fontSize={13} textAnchor="middle" fill="var(--red)" fontWeight={700}>∅ (خالٍ)</text>}
      </svg>
      <div style={{ display: 'grid', gap: 2, marginTop: 6 }}>
        <div className="result-row" style={{ justifyContent: 'center', gap: 22 }}>
          <Tex>{`\\bigcup_{n=1}^{${N}} A_n = ${Uu.map(ivTex).join(' \\cup ')}`}</Tex>
          <Tex>{`\\bigcap_{n=1}^{${N}} A_n = ${I ? ivTex(I) : '\\varnothing'}`}</Tex>
        </div>
        <div className="result-row" style={{ justifyContent: 'center', gap: 22 }}>
          <span className="muted">ولعدد لانهائي من المجموعات:</span>
          <Tex>{`\\bigcup_{n=1}^{\\infty} A_n = ${f.limitUnion}`}</Tex>
          <Tex>{`\\bigcap_{n=1}^{\\infty} A_n = ${f.limitInter}`}</Tex>
        </div>
        <p className="muted" style={{ margin: '6px 0 0' }}>{f.note}</p>
      </div>
    </Shell>
  );
}
