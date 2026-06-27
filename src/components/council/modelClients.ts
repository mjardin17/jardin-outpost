export type ProviderId = "claude" | "gemini" | "chatgpt" | "grok";

export function getStoredKey(provider: ProviderId): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`outpost.apikey.${provider}`);
}

const MODEL_NAMES: Record<ProviderId, string> = {
  claude: "claude-3-5-sonnet-latest",
  gemini: "gemini-2.0-flash",
  chatgpt: "gpt-4o-mini",
  grok: "grok-2-latest",
};

export function modelLabel(provider: ProviderId) {
  return MODEL_NAMES[provider];
}

async function callOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  history: { role: "user" | "assistant"; text: string }[],
) {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({ role: h.role, content: h.text })),
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Request failed (${res.status})`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("No reply returned.");
  return text;
}

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  history: { role: "user" | "assistant"; text: string }[],
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL_NAMES.claude,
      max_tokens: 600,
      system: systemPrompt,
      messages: history.map((h) => ({ role: h.role, content: h.text })),
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Request failed (${res.status})`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error("No reply returned.");
  return text;
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  history: { role: "user" | "assistant"; text: string }[],
) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAMES.gemini}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: history.map((h) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.text }],
        })),
      }),
    },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Request failed (${res.status})`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("No reply returned.");
  return text;
}

export async function callProvider(
  provider: ProviderId,
  apiKey: string,
  systemPrompt: string,
  history: { role: "user" | "assistant"; text: string }[],
): Promise<string> {
  switch (provider) {
    case "claude":
      return callClaude(apiKey, systemPrompt, history);
    case "gemini":
      return callGemini(apiKey, systemPrompt, history);
    case "chatgpt":
      return callOpenAiCompatible(
        "https://api.openai.com/v1",
        apiKey,
        MODEL_NAMES.chatgpt,
        systemPrompt,
        history,
      );
    case "grok":
      return callOpenAiCompatible(
        "https://api.x.ai/v1",
        apiKey,
        MODEL_NAMES.grok,
        systemPrompt,
        history,
      );
  }
}
