// Loads the per-chapter manifests written by tools/extract_chapter.py.
export interface Strip { src: string; w: number; h: number; page: number }
export interface SectionPages { reading: Strip[]; exercises: Strip[]; solutions: Strip[] }

const files = import.meta.glob<{ default: { chapter: number; sections: Record<string, SectionPages> } }>(
  '../../data/pages/*.json',
  { eager: true }
);

const all: Record<string, SectionPages> = {};
for (const f of Object.values(files)) Object.assign(all, f.default.sections);

export function sectionPages(section: string): SectionPages {
  return all[section] ?? { reading: [], exercises: [], solutions: [] };
}

export const PDF_PAGE_OFFSET = 12; // pdf page = book page + 12
