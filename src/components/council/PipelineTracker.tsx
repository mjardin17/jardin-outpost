"use client";

import { useEffect, useState } from "react";

type StageStatus = "pending" | "in_progress" | "done";

type Stage = {
  id: string;
  label: string;
  status: StageStatus;
};

const DEFAULT_STAGES: Omit<Stage, "status">[] = [
  { id: "outline", label: "Outline / brief" },
  { id: "draft", label: "First draft" },
  { id: "assets", label: "Supporting assets" },
  { id: "review", label: "Quality review" },
  { id: "package", label: "Final package / export" },
];

const storageKey = (projectId: string) => `outpost.pipeline.${projectId}`;

function loadStages(projectId: string): Stage[] {
  if (typeof window === "undefined") {
    return DEFAULT_STAGES.map((s) => ({ ...s, status: "pending" as StageStatus }));
  }
  const raw = window.localStorage.getItem(storageKey(projectId));
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to defaults
    }
  }
  return DEFAULT_STAGES.map((s, i) => ({
    ...s,
    status: i === 0 ? "in_progress" : "pending",
  }));
}

const statusStyles: Record<StageStatus, string> = {
  pending: "border-slate-700 text-slate-500",
  in_progress: "border-blue-500 text-blue-400 bg-blue-500/5",
  done: "border-emerald-500 text-emerald-400 bg-emerald-500/5",
};

const statusLabel: Record<StageStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
};

export default function PipelineTracker({ projectId }: { projectId: string }) {
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    setStages(loadStages(projectId));
  }, [projectId]);

  function persist(next: Stage[]) {
    setStages(next);
    window.localStorage.setItem(storageKey(projectId), JSON.stringify(next));
  }

  function advance(id: string) {
    const idx = stages.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const next = stages.map((s, i) => {
      if (i < idx) return { ...s, status: "done" as StageStatus };
      if (i === idx) return { ...s, status: "done" as StageStatus };
      if (i === idx + 1) return { ...s, status: "in_progress" as StageStatus };
      return s;
    });
    persist(next);
  }

  if (stages.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
        Pipeline
      </h3>
      <ol className="space-y-3">
        {stages.map((stage) => (
          <li
            key={stage.id}
            className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${statusStyles[stage.status]}`}
          >
            <span className="text-sm font-medium text-slate-200">{stage.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wide">
                {statusLabel[stage.status]}
              </span>
              {stage.status !== "done" && (
                <button
                  onClick={() => advance(stage.id)}
                  className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-200 transition-colors hover:bg-slate-700"
                >
                  Mark done
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
