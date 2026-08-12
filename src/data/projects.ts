export type ProjectStatus = "Live" | "In progress" | "Coming soon";

export type Project = {
  slug: string;
  name: string;
  description: string;
  status: ProjectStatus;
  /**
   * "internal" projects are pages inside this site (e.g. /aurafit).
   * "iframe" projects are other apps embedded via /apps/[slug], which
   * requires `url` to point at a publicly reachable address (not localhost
   * once deployed — visitors can't reach your machine).
   */
  kind: "internal" | "iframe";
  url: string;
};

export const projects: Project[] = [
  {
    slug: "storyforge",
    name: "StoryForge",
    description:
      "Book-building studio — characters, worlds, series, and exports, all in one factory.",
    status: "Live",
    kind: "iframe",
    url: "http://localhost:3004",
  },
  {
    slug: "adhd-focus-companion",
    name: "ADHD Focus Companion",
    description:
      "Task breakdowns, a visual pomodoro timer, and a brain-dump area for active brains.",
    status: "Live",
    kind: "iframe",
    url: "http://localhost:3003",
  },  {
    slug: "boss-listers",
    name: "Boss Listers",
    description:
      "Scan, price, and cross-list inventory across marketplaces.",
    status: "Live",
    kind: "iframe",
    url: "https://boss-listers.pages.dev",
  },

];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function iframeSlugs(): string[] {
  return projects.filter((p) => p.kind === "iframe").map((p) => p.slug);
}
