import type { ReactNode } from 'react';
import katex from 'katex';

/** Frame shared by every interactive widget. */
export function Shell({ title, children, foot, tag = 'تجربة تفاعلية' }: {
  title: string;
  children: ReactNode;
  foot?: ReactNode;
  tag?: string;
}) {
  return (
    <figure className="widget hue-amber" style={{ marginInline: 0 }}>
      <div className="widget-head">
        <span className="tag">{tag}</span>
        <h4>{title}</h4>
      </div>
      <div className="widget-body">{children}</div>
      {foot && <figcaption className="widget-foot">{foot}</figcaption>}
    </figure>
  );
}

/** Inline (or display) KaTeX. */
export function Tex({ children, display = false }: { children: string; display?: boolean }) {
  const html = katex.renderToString(children, { throwOnError: false, displayMode: display, strict: false });
  return <span className={display ? 'tex-display' : 'tex'} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Format a list of values as a set: {1, 2, 3}. */
export const fmtSet = (xs: (string | number)[]) =>
  xs.length === 0 ? '\\varnothing' : `\\{${xs.join(', ')}\\}`;
