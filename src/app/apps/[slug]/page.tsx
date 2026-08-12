import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, iframeSlugs } from "@/data/projects";

export function generateStaticParams() {
  return iframeSlugs().map((slug) => ({ slug }));
}

export default async function AppGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project || project.kind !== "iframe") {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          &larr; Jardin&rsquo;s Outpost
        </Link>
        <span className="font-display text-lg">{project.name}</span>
        <span className="text-xs text-muted">{project.status}</span>
      </header>
      <iframe
        src={project.url}
        title={project.name}
        className="flex-1 border-0"
        allow="camera; microphone; clipboard-write"
      />
    </div>
  );
}
