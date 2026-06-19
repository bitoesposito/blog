import { getCollection, render, type CollectionEntry } from "astro:content";
import { readingTime } from "./post";

type EducationEntry = CollectionEntry<"education">;

/**
 * Modello "corso → capitoli": un corso è il file `<corso>/index.mdx` (id senza
 * "/"), i capitoli sono i file `<corso>/<capitolo>.mdx` (id che contiene "/").
 */

/** Un'entry è un capitolo se il suo id contiene "/" (es. "javascript/dom"). */
export function isSubpost(id: string): boolean {
  return id.includes("/");
}

/** Id del corso a partire da un capitolo: "javascript/dom" → "javascript". */
export function getParentId(id: string): string {
  return id.split("/")[0];
}

export interface Course {
  entry: EducationEntry;
  chapters: EducationEntry[];
}

/** Ordina i capitoli per `order`, con fallback sull'id (prefissi numerici dei file). */
function byOrder(a: EducationEntry, b: EducationEntry): number {
  const oa = a.data.order ?? Number.MAX_SAFE_INTEGER;
  const ob = b.data.order ?? Number.MAX_SAFE_INTEGER;
  return oa - ob || a.id.localeCompare(b.id);
}

/**
 * Raggruppa la collection `education` in corsi: ogni entry radice con i suoi
 * capitoli ordinati. I corsi sono ordinati per data di pubblicazione decrescente.
 */
export async function getCourses(): Promise<Course[]> {
  const all = await getCollection("education");

  const chaptersByCourse = new Map<string, EducationEntry[]>();
  for (const entry of all) {
    if (!isSubpost(entry.id)) continue;
    const parent = getParentId(entry.id);
    const list = chaptersByCourse.get(parent) ?? [];
    list.push(entry);
    chaptersByCourse.set(parent, list);
  }

  return all
    .filter((entry) => !isSubpost(entry.id))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((entry) => ({
      entry,
      chapters: (chaptersByCourse.get(entry.id) ?? []).sort(byOrder),
    }));
}

/** Restituisce il corso (root + capitoli) a cui appartiene `id`, o null se è un contenuto isolato (senza capitoli). */
export async function getCourse(id: string): Promise<Course | null> {
  const rootId = isSubpost(id) ? getParentId(id) : id;
  const all = await getCollection("education");
  const entry = all.find((e) => e.id === rootId);
  if (!entry) return null;
  const chapters = all
    .filter((e) => isSubpost(e.id) && getParentId(e.id) === rootId)
    .sort(byOrder);
  if (chapters.length === 0) return null;
  return { entry, chapters };
}

// --- Indice (TOC) del corso ----------------------------------------------

export interface TocHeading {
  slug: string;
  text: string;
  depth: number;
}

// I headings richiedono render(): memoizziamo per id così ogni entry viene
// renderizzata una sola volta nell'intera build.
const headingsCache = new Map<string, TocHeading[]>();
async function getHeadings(entry: EducationEntry): Promise<TocHeading[]> {
  const cached = headingsCache.get(entry.id);
  if (cached) return cached;
  const { headings } = await render(entry);
  const filtered = headings
    .filter((h) => h.depth === 2 || h.depth === 3)
    .map((h) => ({ slug: h.slug, text: h.text, depth: h.depth }));
  headingsCache.set(entry.id, filtered);
  return filtered;
}

export interface TocSection {
  id: string;
  title: string;
  headings: TocHeading[];
  current: boolean;
}

export interface CourseView {
  base: string;
  isChapter: boolean;
  /** Barra di navigazione (solo nei capitoli). */
  nav: {
    prev: EducationEntry | null;
    next: EducationEntry | null;
    parent: EducationEntry | null;
  };
  /** Indice completo del corso (sidebar di sinistra). */
  toc: {
    parent: TocSection;
    subposts: TocSection[];
  };
  /** Directory del corso con tempi di lettura (sidebar di destra). */
  directory: {
    root: { id: string; title: string; readingTime: string; combined: string; current: boolean };
    chapters: { id: string; title: string; readingTime: string; current: boolean }[];
  };
}

/**
 * Raccoglie tutto ciò che serve a una pagina di corso/capitolo: navigazione,
 * indice completo e directory. Restituisce null per contenuti isolati.
 */
export async function getCourseView(currentId: string): Promise<CourseView | null> {
  const course = await getCourse(currentId);
  if (!course) return null;

  const { entry: root, chapters } = course;
  const isChapter = isSubpost(currentId);
  const base = "/education";

  const idx = chapters.findIndex((c) => c.id === currentId);
  const nav = isChapter
    ? {
        prev: idx > 0 ? chapters[idx - 1] : null,
        next: idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null,
        parent: root,
      }
    : { prev: null, next: null, parent: null };

  const parentSection: TocSection = {
    id: root.id,
    title: root.data.title,
    headings: await getHeadings(root),
    current: root.id === currentId,
  };
  const subposts: TocSection[] = await Promise.all(
    chapters.map(async (c) => ({
      id: c.id,
      title: c.data.title,
      headings: await getHeadings(c),
      current: c.id === currentId,
    }))
  );

  const directory = {
    root: {
      id: root.id,
      title: root.data.title,
      readingTime: readingTime(root.body),
      combined: readingTime([root.body, ...chapters.map((c) => c.body)].join(" ")),
      current: root.id === currentId,
    },
    chapters: chapters.map((c) => ({
      id: c.id,
      title: c.data.title,
      readingTime: readingTime(c.body),
      current: c.id === currentId,
    })),
  };

  return { base, isChapter, nav, toc: { parent: parentSection, subposts }, directory };
}
