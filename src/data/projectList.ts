import type { CollectionEntry } from "astro:content";

// How many project cards to show per page on the /projects list.
export const PROJECTS_PER_PAGE = 4;

type ProjectEntry = CollectionEntry<"projects">;

// Sorted, published projects (lower `order` first, then title). Shared by the
// list page and its paginated sub-pages so both stay in sync.
export function sortedProjects(entries: ProjectEntry[]): ProjectEntry[] {
  return entries
    .filter((e) => !e.data.draft)
    .sort((a, b) => {
      if (a.data.order !== b.data.order) return a.data.order - b.data.order;
      return a.data.title.localeCompare(b.data.title);
    });
}

// Maps a project entry to the props ProjectRow expects. A project with a
// case-study body opens its internal detail page; otherwise the title links to
// its first available link (repo / liveUrl / first custom link). The list is
// text-only, so no cover/image props are needed here.
export function projectCardProps(p: ProjectEntry, home: string) {
  const hasCaseStudy = p.body.trim().length > 0;
  const firstLink = p.data.repo ?? p.data.liveUrl ?? p.data.links?.[0]?.url;
  const external = !hasCaseStudy && !!firstLink;
  const href = hasCaseStudy
    ? `${home}projects/${p.slug}`
    : (firstLink ?? `${home}projects/${p.slug}`);

  return {
    title: p.data.title,
    summary: p.data.summary,
    timeframe: p.data.timeframe,
    tech: p.data.tech,
    links: p.data.links,
    href,
    external,
  };
}
