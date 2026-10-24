/** Prefix a site-relative path with the configured base (e.g. /book_of_proof/). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export const lessonUrl = (chapterSlug: string, sectionSlug: string) =>
  url(`chapters/${chapterSlug}/${sectionSlug}/`);
export const chapterUrl = (chapterSlug: string) => url(`chapters/${chapterSlug}/`);
