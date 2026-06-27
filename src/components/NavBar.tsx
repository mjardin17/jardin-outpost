import NeonSign from "./NeonSign";

const links = [
  { href: "#apps", label: "Apps" },
  { href: "#store", label: "Store" },
  { href: "#services", label: "Services" },
  { href: "/workspace", label: "Workspace" },
  { href: "#contact", label: "Contact" },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NeonSign />
        <ul className="hidden items-center gap-8 text-sm text-muted sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full border border-accent/40 px-4 py-2 text-sm text-accent-soft transition-colors hover:bg-accent/10"
        >
          Get in touch
        </a>
      </nav>
    </header>
  );
}
