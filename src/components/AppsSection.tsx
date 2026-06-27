type AppItem = {
  name: string;
  description: string;
  status: "Live" | "In progress" | "Coming soon";
  href: string;
};

const apps: AppItem[] = [
  {
    name: "StoryForge",
    description:
      "Book-building studio — characters, worlds, series, and exports, all in one factory.",
    status: "Live",
    href: "http://localhost:3004",
  },
  {
    name: "ADHD Focus Companion",
    description:
      "Task breakdowns, a visual pomodoro timer, and a brain-dump area for active brains.",
    status: "Live",
    href: "http://localhost:3003",
  },
  {
    name: "Add your next app",
    description: "Keep stacking these as you ship more.",
    status: "Coming soon",
    href: "#",
  },
];

const statusStyles: Record<AppItem["status"], string> = {
  Live: "border-accent/40 text-accent-soft",
  "In progress": "border-border text-muted",
  "Coming soon": "border-border text-muted",
};

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
          {apps.map((app) => {
            const isLive = app.status === "Live";
            const card = (
              <article
                key={app.name}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background-raised p-6 transition-colors hover:border-accent/40"
              >
                <div>
                  <span
                    className={`mb-4 inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-wide ${statusStyles[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <h3 className="font-display text-2xl">{app.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {app.description}
                  </p>
                  {isLive && (
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
                key={app.name}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
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
