import { getStoredKey, type ProviderId } from "@/components/council/modelClients";

export type MealEstimate = {
  summary: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: "low" | "medium" | "high";
};

const VISION_SYSTEM_PROMPT = `You are a nutrition vision analyst. You will receive one photo of a meal or plate.
Estimate portion sizes using visual scale cues (plate diameter, utensil size, hand if visible) to infer volume, then estimate macros.
Respond with ONLY a JSON object, no prose, no markdown fences, matching exactly this shape:
{"summary": string, "calories": number, "proteinG": number, "carbsG": number, "fatG": number, "confidence": "low"|"medium"|"high"}`;

function parseEstimate(raw: string): MealEstimate {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
  const parsed = JSON.parse(cleaned);
  if (
    typeof parsed.summary !== "string" ||
    typeof parsed.calories !== "number" ||
    typeof parsed.proteinG !== "number" ||
    typeof parsed.carbsG !== "number" ||
    typeof parsed.fatG !== "number"
  ) {
    throw new Error("Model returned an unexpected shape.");
  }
  return {
    summary: parsed.summary,
    calories: parsed.calories,
    proteinG: parsed.proteinG,
    carbsG: parsed.carbsG,
    fatG: parsed.fatG,
    confidence: ["low", "medium", "high"].includes(parsed.confidence) ? parsed.confidence : "medium",
  };
}

async function analyzeWithGemini(apiKey: string, base64Image: string): Promise<MealEstimate> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: VISION_SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: "Analyze this meal photo." },
              { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            ],
          },
        ],
      }),
    },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Gemini request failed (${res.status})`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini returned no analysis.");
  return parseEstimate(text);
}

async function analyzeWithOpenAi(apiKey: string, base64Image: string): Promise<MealEstimate> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: VISION_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this meal photo." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `OpenAI request failed (${res.status})`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI returned no analysis.");
  return parseEstimate(text);
}

const VISION_PROVIDER_PREFERENCE: ProviderId[] = ["gemini", "chatgpt"];

export async function analyzeMealPhoto(base64Image: string): Promise<MealEstimate> {
  const errors: string[] = [];
  for (const provider of VISION_PROVIDER_PREFERENCE) {
    const apiKey = getStoredKey(provider);
    if (!apiKey) continue;
    try {
      if (provider === "gemini") return await analyzeWithGemini(apiKey, base64Image);
      if (provider === "chatgpt") return await analyzeWithOpenAi(apiKey, base64Image);
    } catch (err) {
      errors.push(`${provider}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  if (errors.length > 0) {
    throw new Error(`All vision providers failed. ${errors.join(" | ")}`);
  }
  throw new Error(
    "No vision-capable AI is connected. Add a Gemini or ChatGPT API key on the Workspace page.",
  );
}
