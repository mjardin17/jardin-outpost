import NavBar from "@/components/NavBar";
import AiHookups from "@/components/workspace/AiHookups";
import ChatGptPanel from "@/components/workspace/ChatGptPanel";
import ProjectFiles from "@/components/workspace/ProjectFiles";
import TaskList from "@/components/workspace/TaskList";

export default function WorkspacePage() {
  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="border-b border-border px-6 pb-10 pt-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted">
              Workspace
            </p>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
              Work on a project
            </h1>
          </div>
        </div>
        <AiHookups />
        <ChatGptPanel />
        <ProjectFiles />
        <TaskList />
      </main>
    </div>
  );
}
