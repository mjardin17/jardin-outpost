"use client";

import { useRef, useState } from "react";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: UploadedFile[] = Array.from(list).map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      name: f.name,
      size: f.size,
      type: f.type || "file",
    }));
    setFiles((prev) => {
      const existingIds = new Set(prev.map((f) => f.id));
      return [...prev, ...next.filter((f) => !existingIds.has(f.id))];
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <section className="border-b border-border bg-background-raised px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 font-display text-3xl tracking-tight">
          Project files
        </h2>
        <p className="mb-8 max-w-xl text-sm text-muted">
          Upload files for the project you&rsquo;re working on. This session
          holds them in your browser for now &mdash; persistent storage across
          visits comes once a backend is wired up.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
            dragging ? "border-accent bg-accent/5" : "border-border bg-background"
          }`}
        >
          <p className="font-display text-lg text-foreground">
            Drop files here, or click to browse
          </p>
          <p className="mt-2 text-sm text-muted">
            Code, docs, images &mdash; anything related to the project.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{file.name}</p>
                  <p className="text-xs text-muted">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-xs text-muted hover:text-accent-soft"
                  aria-label={`Remove ${file.name}`}
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
