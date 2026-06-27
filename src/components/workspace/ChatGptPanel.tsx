"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatGptPanel() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKey(window.localStorage.getItem("outpost.apikey.chatgpt"));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, sending]);

  async function sendMessage() {
    const text = draft.trim();
    if (!text || !apiKey || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setDraft("");
    setSending(true);
    setError(null);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message || `Request failed (${response.status})`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error("No reply returned.");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (!apiKey) {
    return (
      <section className="border-b border-border px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 font-display text-3xl tracking-tight">ChatGPT</h2>
          <p className="text-sm text-muted">
            Connect ChatGPT above with your OpenAI API key to start chatting here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 font-display text-3xl tracking-tight">ChatGPT</h2>
        <p className="mb-6 max-w-xl text-sm text-muted">
          Talks directly to OpenAI from your browser using the key you saved
          above. Nothing passes through this site&rsquo;s servers.
        </p>

        <div className="rounded-2xl border border-border bg-background-raised">
          <div
            ref={scrollRef}
            className="flex max-h-96 flex-col gap-3 overflow-y-auto p-5"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted">Say something to get started.</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-accent text-background"
                    : "self-start border border-border bg-background text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="self-start rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-muted">
                Thinking&hellip;
              </div>
            )}
          </div>

          {error && (
            <p className="border-t border-border px-5 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-3 border-t border-border p-4"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message ChatGPT..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
