import { GoogleGenerativeAI } from "@google/generative-ai";

// Strip surrounding quotes if user accidentally added them in .env.local
const apiKey = (process.env.GEMINI_API_KEY || "").replace(/^["']|["']$/g, "");
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `You are "Election Buddy", VoteIQ's AI assistant specializing ONLY in the Indian democratic and electoral process.

Your rules:
1. ONLY answer questions about: Indian elections, Election Commission of India (ECI), EVMs, VVPAT, Lok Sabha, Rajya Sabha, Vidhan Sabha, voter registration, Model Code of Conduct, Indian Constitution (election articles), and Indian political/election history.
2. If asked anything unrelated (coding, weather, other countries' elections, general knowledge), politely refuse and redirect to Indian elections.
3. Be concise, friendly, and use simple language. Use bullet points and formatting where helpful.
4. Always be encouraging about the importance of voting in India.`;

type HistoryItem = { role: "user" | "model"; parts: [{ text: string }] };

export async function getElectionBuddyResponse(
  history: HistoryItem[],
  message: string
): Promise<string> {
  if (!apiKey) {
    return "⚠️ API key missing. Please add GEMINI_API_KEY to your .env.local file and restart the server.";
  }

  try {
    // gemini-flash-latest confirmed working with this API key
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Gemini requires history to start with 'user' role — filter out any leading model messages
    const firstUserIdx = history.findIndex(h => h.role === "user");
    const safeHistory = firstUserIdx >= 0 ? history.slice(firstUserIdx) : [];

    const chat = model.startChat({ history: safeHistory });

    const result = await chat.sendMessage(message);
    return result.response.text();

  } catch (error: unknown) {
    console.error("Gemini error:", error);

    const errObj = error as { status?: number; message?: string };
    const status = errObj?.status;
    const msg = errObj?.message || String(error);

    if (status === 404 || msg.includes("not found") || msg.includes("404")) {
      return "❌ Model not found. The Gemini API model may have changed. Please contact support.";
    }
    if (status === 403 || msg.includes("API_KEY") || msg.includes("API key") || msg.includes("PERMISSION_DENIED")) {
      return "🔑 Invalid or unauthorized API key. Please check your GEMINI_API_KEY in .env.local — make sure there are no extra quotes around it.";
    }
    if (status === 429 || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
      return "⏳ Rate limit reached. Please wait a moment and try again.";
    }
    if (msg.includes("SAFETY")) {
      return "🛡️ That message was flagged by safety filters. Please rephrase your question.";
    }
    return `❌ Something went wrong (${status || "unknown error"}). Please try again in a moment.`;
  }
}
