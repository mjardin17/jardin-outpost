export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border bg-grain px-6 pb-24 pt-28 sm:pt-36"
    >
      <div
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-6 text-sm uppercase tracking-[0.2em] text-muted">
          Apps &middot; Finds &middot; Services
        </p>
        <h1 className="max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          One outpost.
          <br />
          <span className="italic text-gradient-accent">Everything I build,</span>
          <br />
          sell, and offer.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          A home base for the apps I&rsquo;ve shipped, the finds I curate, and the
          services I offer &mdash; all in one place.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#apps"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            Explore the apps
          </a>
          <a
            href="#store"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-soft"
          >
            Browse the store
          </a>
        </div>
      </div>
    </section>
  );
}
