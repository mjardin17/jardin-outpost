"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

const storageKey = "outpost.tasks";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setTasks(JSON.parse(raw));
      } catch {
        setTasks([]);
      }
    }
  }, []);

  function persist(next: Task[]) {
    setTasks(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function addTask() {
    const title = draft.trim();
    if (!title) return;
    persist([...tasks, { id: crypto.randomUUID(), title, done: false }]);
    setDraft("");
  }

  function toggleTask(id: string) {
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    persist(tasks.filter((t) => t.id !== id));
  }

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 font-display text-3xl tracking-tight">Tasks</h2>
        <p className="mb-8 max-w-xl text-sm text-muted">
          Set what needs to happen next on this project.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
          className="mb-6 flex gap-3"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 rounded-xl border border-border bg-background-raised px-4 py-3 text-sm text-foreground outline-none focus:border-accent/50"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
          >
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="text-sm text-muted">No tasks yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background-raised px-4 py-3"
              >
                <label className="flex flex-1 items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <span
                    className={`text-sm ${
                      task.done ? "text-muted line-through" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-xs text-muted hover:text-accent-soft"
                  aria-label={`Remove ${task.title}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
