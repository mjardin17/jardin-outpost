import NavBar from "@/components/NavBar";
import DiscussionRoom from "@/components/council/DiscussionRoom";
import PipelineTracker from "@/components/council/PipelineTracker";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex flex-1 flex-col bg-slate-950">
      <NavBar />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            Project
          </p>
          <h1 className="mb-8 font-display text-3xl tracking-tight text-slate-100 sm:text-4xl">
            {projectId}
          </h1>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="h-[640px]">
              <DiscussionRoom projectId={projectId} />
            </div>
            <PipelineTracker projectId={projectId} />
          </div>
        </div>
      </main>
    </div>
  );
}
