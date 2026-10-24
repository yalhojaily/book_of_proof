import { useId, type ReactNode, type MouseEvent } from 'react';

/** An "atom" is one of the 2^n basic regions, encoded as a bitmask: bit0 = A, bit1 = B, bit2 = C. */
export type Atom = number;

export interface Circle {
  name: string;
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  fill: string;
  lx: number; // label position
  ly: number;
}

export const LAYOUT2 = {
  w: 360,
  h: 230,
  circles: [
    { name: 'A', cx: 140, cy: 115, r: 80, stroke: 'var(--set-a)', fill: 'var(--set-a-fill)', lx: 72, ly: 50 },
    { name: 'B', cx: 220, cy: 115, r: 80, stroke: 'var(--set-b)', fill: 'var(--set-b-fill)', lx: 278, ly: 50 },
  ] as Circle[],
};

export const LAYOUT3 = {
  w: 360,
  h: 260,
  circles: [
    { name: 'A', cx: 148, cy: 100, r: 72, stroke: 'var(--set-a)', fill: 'var(--set-a-fill)', lx: 70, ly: 46 },
    { name: 'B', cx: 212, cy: 100, r: 72, stroke: 'var(--set-b)', fill: 'var(--set-b-fill)', lx: 280, ly: 46 },
    { name: 'C', cx: 180, cy: 156, r: 72, stroke: 'var(--set-c)', fill: 'var(--set-c-fill)', lx: 266, ly: 238 },
  ] as Circle[],
};

/** Which atom contains the point (x, y)? */
export function atomAt(circles: Circle[], x: number, y: number): Atom {
  let m = 0;
  circles.forEach((c, i) => {
    if ((x - c.cx) ** 2 + (y - c.cy) ** 2 <= c.r ** 2) m |= 1 << i;
  });
  return m;
}

/**
 * Draws an n-set Venn diagram inside a universal rectangle U, shading the atoms for which
 * `shaded(atom)` is true. Optional children are drawn on top (e.g. element dots).
 */
export function Venn({
  layout,
  shaded,
  onAtomClick,
  children,
  universeLabel = 'U',
  ariaLabel,
  highlight,
}: {
  layout: { w: number; h: number; circles: Circle[] };
  shaded: (a: Atom) => boolean;
  onAtomClick?: (a: Atom) => void;
  children?: ReactNode;
  universeLabel?: string;
  ariaLabel?: string;
  highlight?: (a: Atom) => boolean; // dashed outline style for "difference" atoms
}) {
  const uid = useId().replace(/:/g, '');
  const { w, h, circles } = layout;
  const n = circles.length;
  const atoms = Array.from({ length: 1 << n }, (_, i) => i);

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onAtomClick) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    if (p.x < 4 || p.y < 4 || p.x > w - 4 || p.y > h - 4) return;
    onAtomClick(atomAt(circles, p.x, p.y));
  };

  // Nest one masked <g> per circle: "inside" mask if the atom has that bit, otherwise "outside".
  const renderAtom = (a: Atom, fill: string, key: string) => {
    let node: ReactNode = <rect x={4} y={4} width={w - 8} height={h - 8} fill={fill} />;
    circles.forEach((_, i) => {
      const id = `${uid}-${(a >> i) & 1 ? 'in' : 'out'}-${i}`;
      node = <g mask={`url(#${id})`}>{node}</g>;
    });
    return <g key={key}>{node}</g>;
  };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      onClick={handleClick}
      style={{ width: '100%', maxWidth: w * 1.35, display: 'block', margin: '0 auto', cursor: onAtomClick ? 'pointer' : 'default', direction: 'ltr' }}
    >
      <defs>
        {circles.map((c, i) => (
          <g key={i}>
            <mask id={`${uid}-in-${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
              <rect x={0} y={0} width={w} height={h} fill="black" />
              <circle cx={c.cx} cy={c.cy} r={c.r} fill="white" />
            </mask>
            <mask id={`${uid}-out-${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
              <rect x={0} y={0} width={w} height={h} fill="white" />
              <circle cx={c.cx} cy={c.cy} r={c.r} fill="black" />
            </mask>
          </g>
        ))}
        <pattern id={`${uid}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="var(--red-soft)" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--red)" strokeWidth="2.5" />
        </pattern>
      </defs>
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={12} fill="var(--bg-elev)" stroke="var(--line-strong)" strokeWidth={1.5} />
      {circles.map((c, i) => (
        <circle key={`f${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} />
      ))}
      {atoms.filter(shaded).map((a) => renderAtom(a, 'var(--shade-fill)', `s${a}`))}
      {highlight && atoms.filter(highlight).map((a) => renderAtom(a, `url(#${uid}-hatch)`, `h${a}`))}
      {circles.map((c, i) => (
        <circle key={`o${i}`} cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke={c.stroke} strokeWidth={2.2} />
      ))}
      {circles.map((c, i) => (
        <text key={`l${i}`} x={c.lx} y={c.ly} fontSize={22} fontStyle="italic" fontWeight={600} fill={c.stroke} textAnchor="middle" fontFamily="KaTeX_Math, Georgia, serif">
          {c.name}
        </text>
      ))}
      <text x={w - 14} y={26} fontSize={17} fontStyle="italic" textAnchor="end" className="svg-ink-2" fontFamily="KaTeX_Math, Georgia, serif">
        {universeLabel}
      </text>
      {children}
    </svg>
  );
}

/* Slot positions for placing up to ~10 element labels inside each atom of the 2-set layout. */
const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [360 - x, y] as [number, number]);
const A_ONLY: [number, number][] = [
  [106, 115], [82, 115], [128, 88], [128, 142], [106, 88], [106, 142], [82, 88], [82, 142], [106, 60], [106, 170],
];
const BOTH: [number, number][] = [
  [180, 115], [180, 88], [180, 142], [164, 101], [196, 101], [164, 129], [196, 129], [180, 60], [180, 170], [164, 75],
];
const NONE: [number, number][] = [
  [26, 26], [26, 60], [26, 170], [26, 205], [56, 205], [334, 205], [304, 205], [334, 170], [334, 60], [56, 26],
  [180, 22], [26, 115], [334, 115], [150, 212], [210, 212],
];
export const SLOTS2: Record<number, [number, number][]> = {
  0: NONE,
  1: A_ONLY,
  2: mirror(A_ONLY),
  3: BOTH,
};
