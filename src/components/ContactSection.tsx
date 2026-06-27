export default function ContactSection() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-accent/30 bg-background-raised p-10 sm:p-16">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Let&rsquo;s talk.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Have a project, an order, or a question? Reach out and I&rsquo;ll get
            back to you.
          </p>
          <a
            href="mailto:hello@jardinsoutpost.com"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            Send a message
          </a>
        </div>
        <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Jardin&rsquo;s Outpost.</p>
          <p>Built one piece at a time.</p>
        </footer>
      </div>
    </section>
  );
}
