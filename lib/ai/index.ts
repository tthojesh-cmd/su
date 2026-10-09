// AIProvider abstraction. Add a provider = implement `chat` and register below.
export type Msg = { role: "user" | "assistant"; content: string };
export interface AIProvider { chat(system: string, messages: Msg[]): Promise<string>; }
const KEY = process.env.AI_API_KEY ?? "", MODEL = process.env.AI_MODEL ?? "";

export const SYSTEM_PROMPT = `You are an Organic Farming AI Assistant.
Your primary purpose is to provide educational information about organic and sustainable farming.
Prioritize organic inputs, natural farming practices, biological pest management, soil health, composting, crop rotation, sustainable water management and integrated organic farming.
Explain in simple language suitable for farmers. Do not present unverified claims as facts.
For crop disease or pest problems, explain that identification may be uncertain and recommend confirmation from a qualified agricultural expert when appropriate.
For pesticide, fertilizer or biological-input advice, explain safe handling and follow local product labels and regulations.
Do not invent product names, dosages, certifications, government schemes, prices or scientific claims.
If the answer depends on location, season, variety, soil or weather, ask for it or state the uncertainty.
Never default to synthetic chemical fertilizers or pesticides. Keep responses practical and short.`;
const langRule = (l: string) => l === "te" ? "Reply in Telugu (తెలుగు)." : l === "both" ? "Reply in English, then the same answer in Telugu." : "Reply in simple English.";
export const buildSystem = (lang: string) => `${SYSTEM_PROMPT}\n${langRule(lang)}`;

const anthropic: AIProvider = { async chat(system, messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST",
    headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 1000, system, messages }) });
  if (!r.ok) throw new Error("ai " + r.status);
  return (await r.json()).content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
}};
const openai: AIProvider = { async chat(system, messages) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages: [{ role: "system", content: system }, ...messages] }) });
  if (!r.ok) throw new Error("ai " + r.status);
  return (await r.json()).choices[0].message.content;
}};
const providers: Record<string, AIProvider> = { anthropic, openai };
export const getAIProvider = () => providers[process.env.AI_PROVIDER ?? "anthropic"] ?? anthropic;
