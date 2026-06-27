"use client";

import { useEffect, useState } from "react";

type Provider = {
  id: "claude" | "gemini" | "chatgpt" | "grok";
  name: string;
  helpUrl: string;
};

const providers: Provider[] = [
  { id: "claude", name: "Claude", helpUrl: "https://console.anthropic.com/settings/keys" },
  { id: "gemini", name: "Gemini", helpUrl: "https://aistudio.google.com/apikey" },
  { id: "chatgpt", name: "ChatGPT", helpUrl: "https://platform.openai.com/api-keys" },
  { id: "grok", name: "Grok", helpUrl: "https://console.x.ai" },
];

const storageKey = (id: string) => `outpost.apikey.${id}`;

export default function AiHookups() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    const loaded: Record<string, string> = {};
    for (const p of providers) {
      const v = window.localStorage.getItem(storageKey(p.id));
      if (v) loaded[p.id] = v;
    }
    setKeys(loaded);
  }, []);

  function saveKey(id: string, value: string) {
    if (value.trim()) {
      window.localStorage.setItem(storageKey(id), value.trim());
    } else {
      window.localStorage.removeItem(storageKey(id));
    }
    setKeys((prev) => ({ ...prev, [id]: value.trim() }));
    setEditing(null);
  }

  function disconnect(id: string) {
    window.localStorage.removeItem(storageKey(id));
    setKeys((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <section className="border-b border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 font-display text-3xl tracking-tight">AI hookups</h2>
        <p className="mb-8 max-w-xl text-sm text-muted">
          Connect the assistants you want to work with. Keys are stored only in
          this browser &mdash; they never leave your device.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p) => {
            const connected = Boolean(keys[p.id]);
            const isEditing = editing === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  connected ? "border-accent/50 bg-background-raised" : "border-border bg-background-raised"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-lg">{p.name}</h3>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      connected ? "bg-accent" : "bg-border"
                    }`}
                    aria-label={connected ? "Connected" : "Not connected"}
                  />
                </div>
                {isEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem(
                        "key"
                      ) as HTMLInputElement;
                      saveKey(p.id, input.value);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <input
                      name="key"
                      type="password"
                      defaultValue={keys[p.id] ?? ""}
                      placeholder="Paste API key"
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-background"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-lg border border-border px-3 py-2 text-xs text-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted">
                      {connected ? "Connected" : "Not connected"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(p.id)}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-xs text-foreground transition-colors hover:border-accent/50"
                      >
                        {connected ? "Update key" : "Connect"}
                      </button>
                      {connected && (
                        <button
                          onClick={() => disconnect(p.id)}
                          className="rounded-lg border border-border px-3 py-2 text-xs text-muted hover:text-foreground"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <a
                      href={p.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted underline-offset-2 hover:underline"
                    >
                      Get an API key
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
