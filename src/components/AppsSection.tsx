import { projects, type Project } from "@/data/projects";

const statusStyles: Record<Project["status"], string> = {
  Live: "border-accent/40 text-accent-soft",
  "In progress": "border-border text-muted",
  "Coming soon": "border-border text-muted",
};

function projectHref(project: Project): string {
  return project.kind === "iframe" ? `/apps/${project.slug}` : project.url;
}

export default function AppsSection() {
  return (
    <section id="apps" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Apps I&rsquo;ve built
          </h2>
          <p className="hidden max-w-xs text-sm text-muted sm:block">
            A running record of the tools and projects shipped from the outpost.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const isLive = project.status === "Live";
            const card = (
              <article
                key={project.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background-raised p-6 transition-colors hover:border-accent/40"
              >
                <div>
                  <span
                    className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                  <h3 className="font-display text-2xl">{project.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  {isLive && project.kind === "iframe" && (
                    <p className="mt-3 text-xs text-muted">
                      Runs locally &mdash; start its dev server, then open it here.
                    </p>
                  )}
                </div>
                <div className="mt-6 h-px w-full bg-border transition-colors group-hover:bg-accent/30" />
              </article>
            );

            if (!isLive) return card;

            return (
              <a
                key={project.slug}
                href={projectHref(project)}
                target={project.kind === "iframe" ? "_blank" : undefined}
                rel={project.kind === "iframe" ? "noopener noreferrer" : undefined}
                className="block"
              >
                {card}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
