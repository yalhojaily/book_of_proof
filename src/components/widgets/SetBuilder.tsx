import { useState } from 'react';
import { Shell, Tex } from './Shell';

type Preset = {
  key: string;
  label: string; // tex
  params: { name: string; min: number; max: number; init: number }[];
  tex: (p: number[]) => string;
  test: (x: number, p: number[]) => boolean;
  finite: boolean;
  read: (p: number[]) => string;
};

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

const PRESETS: Preset[] = [
  {
    key: 'abs',
    label: '\\{x \\in \\mathbb{Z} : |x| < k\\}',
    params: [{ name: 'k', min: 1, max: 9, init: 4 }],
    tex: ([k]) => `\\{x \\in \\mathbb{Z} : |x| < ${k}\\}`,
    test: (x, [k]) => Math.abs(x) < k,
    finite: true,
    read: ([k]) => `كل عدد صحيح x بحيث تكون القيمة المطلقة لـ x أصغر من ${k}.`,
  },
  {
    key: 'lin',
    label: '\\{an + b : n \\in \\mathbb{Z}\\}',
    params: [
      { name: 'a', min: 1, max: 6, init: 2 },
      { name: 'b', min: 0, max: 5, init: 1 },
    ],
    tex: ([a, b]) => `\\{${a === 1 ? '' : a}n ${b ? `+ ${b}` : ''} : n \\in \\mathbb{Z}\\}`,
    test: (x, [a, b]) => (((x - b) % a) + a) % a === 0,
    finite: false,
    read: ([a, b]) => `كل عدد يمكن كتابته بالشكل ${a}n + ${b} حيث n عدد صحيح. هنا الصيغة على يسار النقطتين تولّد العناصر، لا تختبرها.`,
  },
  {
    key: 'sq',
    label: '\\{x \\in \\mathbb{Z} : x^2 \\le k\\}',
    params: [{ name: 'k', min: 0, max: 100, init: 20 }],
    tex: ([k]) => `\\{x \\in \\mathbb{Z} : x^2 \\le ${k}\\}`,
    test: (x, [k]) => x * x <= k,
    finite: true,
    read: ([k]) => `كل عدد صحيح مربّعه لا يتجاوز ${k}.`,
  },
  {
    key: 'div',
    label: '\\{x \\in \\mathbb{N} : x \\mid k\\}',
    params: [{ name: 'k', min: 1, max: 12, init: 12 }],
    tex: ([k]) => `\\{x \\in \\mathbb{N} : x \\mid ${k}\\}`,
    test: (x, [k]) => x >= 1 && k % x === 0,
    finite: true,
    read: ([k]) => `كل عدد طبيعي يقسم ${k} دون باقٍ (قواسم ${k} الموجبة).`,
  },
  {
    key: 'prime',
    label: '\\{p \\in \\mathbb{N} : p \\text{ prime}\\}',
    params: [],
    tex: () => '\\{p \\in \\mathbb{N} : p \\text{ is prime}\\}',
    test: (x) => isPrime(x),
    finite: false,
    read: () => 'كل عدد طبيعي أولي. المجموعة غير منتهية (برهن إقليدس ذلك)، لذا لا نرى منها إلا جزءاً.',
  },
];

const LO = -12;
const HI = 12;

export default function SetBuilder() {
  const [pi, setPi] = useState(0);
  const p = PRESETS[pi];
  const [vals, setVals] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(PRESETS.map((q) => [q.key, q.params.map((x) => x.init)]))
  );
  const v = vals[p.key];
  const xs = Array.from({ length: HI - LO + 1 }, (_, i) => LO + i);
  const members = xs.filter((x) => p.test(x, v));

  let roster: string;
  if (p.finite) {
    roster = members.length ? `\\{${members.join(', ')}\\}` : '\\varnothing';
  } else {
    const pos = members.filter((x) => x >= 0).slice(0, 5);
    const neg = p.key === 'prime' ? [] : members.filter((x) => x < 0).slice(-3);
    roster = `\\{${p.key === 'prime' ? '' : '\\ldots, '}${[...neg, ...pos].join(', ')}, \\ldots\\}`;
  }

  const W = 640;
  const pad = 22;
  const step = (W - 2 * pad) / (HI - LO);
  const X = (x: number) => pad + (x - LO) * step;

  return (
    <Shell
      title="من رمز بناء المجموعة إلى عناصرها"
      foot="اختر وصفاً، وحرّك المعاملات، وراقب أي الأعداد الصحيحة بين −12 و 12 تنتمي إلى المجموعة."
    >
      <div className="controls">
        {PRESETS.map((q, i) => (
          <button key={q.key} className="btn" aria-pressed={i === pi} onClick={() => setPi(i)}>
            <Tex>{q.label}</Tex>
          </button>
        ))}
      </div>
      {p.params.length > 0 && (
        <div className="controls" style={{ gap: 18 }}>
          {p.params.map((prm, j) => (
            <label key={prm.name} className="ltr" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tex>{`${prm.name} = ${v[j]}`}</Tex>
              <input
                type="range"
                min={prm.min}
                max={prm.max}
                value={v[j]}
                onChange={(e) => {
                  const n = [...v];
                  n[j] = Number(e.target.value);
                  setVals({ ...vals, [p.key]: n });
                }}
              />
            </label>
          ))}
        </div>
      )}
      <div style={{ textAlign: 'center', fontSize: '1.3em', margin: '6px 0 2px' }}>
        <Tex>{p.tex(v)}</Tex>
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '0 0 6px' }}>{p.read(v)}</p>

      <svg viewBox={`0 0 ${W} 70`} style={{ width: '100%', display: 'block', direction: 'ltr' }} role="img" aria-label="خط الأعداد">
        <line x1={pad - 10} x2={W - pad + 10} y1={34} y2={34} stroke="var(--line-strong)" strokeWidth={2} />
        {xs.map((x) => {
          const on = members.includes(x);
          return (
            <g key={x}>
              <line x1={X(x)} x2={X(x)} y1={29} y2={39} stroke="var(--line-strong)" />
              <circle cx={X(x)} cy={34} r={on ? 8 : 3} fill={on ? 'var(--set-a)' : 'var(--line-strong)'} style={{ transition: 'r .2s' }} />
              <text x={X(x)} y={62} fontSize={11.5} textAnchor="middle" fill={on ? 'var(--ink)' : 'var(--ink-3)'} fontWeight={on ? 700 : 400}>
                {x}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="result-row" style={{ justifyContent: 'center', fontSize: '1.1em' }}>
        <Tex>{`= ${roster}`}</Tex>
      </div>
      <div className="result-row" style={{ justifyContent: 'center' }}>
        {p.finite ? (
          <span>
            مجموعة منتهية، عدد عناصرها <Tex>{`|A| = ${members.length}`}</Tex>
          </span>
        ) : (
          <span>
            مجموعة <b>غير منتهية</b>: النقاط الظاهرة جزء منها فقط.
          </span>
        )}
      </div>
    </Shell>
  );
}
