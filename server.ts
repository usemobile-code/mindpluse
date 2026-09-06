import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in server environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient Model Fallback Ladder
const FALLBACK_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
];

async function generateContentWithFallback(
  ai: GoogleGenAI,
  config: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    responseMimeType?: string;
  }
) {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: config.contents,
        config: {
          systemInstruction: config.systemInstruction,
          temperature: config.temperature ?? 0.7,
          ...(config.responseMimeType ? { responseMimeType: config.responseMimeType } : {}),
        },
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      console.warn(`[Fallback Ladder] Model "${model}" failed, trying next candidate:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All models in the resilient fallback ladder failed.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Top-Level Request Deserialization (Ordering Guarantee)
  app.use(express.json({ limit: "1mb" }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      modelsSupported: FALLBACK_MODELS,
    });
  });

  // Multi-turn Gemini AI Chat for Mindful Journaling & Reflections
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      // 2. Defensive Payload Ingestion (Null-Safe Destructuring)
      const data = req.body && typeof req.body === "object" ? req.body : {};
      const messages = Array.isArray(data.messages) ? data.messages : [];
      const stressScore = data.stressScore;
      const dominantFactor = data.dominantFactor;
      const currentMood = data.currentMood;
      const language = data.language || "en";
      const locationContext = data.locationContext;

      if (messages.length === 0) {
        return res.status(400).json({ error: "Invalid or empty messages payload." });
      }

      const ai = getAI();

      const langDirective =
        language === "hi"
          ? "You MUST respond in supportive, warm, and natural Hindi (Devanagari script), using compassionate, accessible words for mental wellness and somatic grounding."
          : "Respond in clear, warm, and empathetic English.";

      const locationSnippet = locationContext?.title
        ? `User is reflecting at peaceful location: "${locationContext.title}" (${locationContext.category || "Mindful Space"}). Feel free to subtly reference the grounding elements of nature/space if relevant.`
        : "";

      const systemInstruction = `You are MindPulse AI, an empathetic, supportive, and evidence-informed mental wellness companion and journaling guide.
Your purpose is to help users reflect on their thoughts, decompress stress, practice cognitive reframing, and brainstorm manageable micro-steps.
Current user stress score: ${stressScore ? `${stressScore} / 1000` : "Not yet assessed"}
${dominantFactor ? `Dominant stress factor identified: ${dominantFactor}` : ""}
${currentMood ? `User's latest daily mood check-in: ${currentMood.emoji} ${currentMood.label}${currentMood.note ? ` (Note: "${currentMood.note}")` : ""}` : ""}
${locationSnippet}

Language Requirement:
${langDirective}

Core Interaction Guidelines:
1. Validate emotions with warmth, psychological safety, and compassionate clarity.
2. Keep responses concise, engaging, conversational, and non-overwhelming (around 2-4 focused paragraphs or conversational bullet points).
3. Offer concrete, realistic micro-actions (e.g., sensory grounding, breath breaks, boundary setting, self-compassion mantras).
4. When appropriate, offer a gentle follow-up question or journaling reflection prompt.
5. Important Safety Boundary: You are an AI wellness companion, NOT a licensed psychiatrist, doctor, or emergency hotline. If the user mentions self-harm or suicidal ideation, urge contacting the 988 Suicide & Crisis Lifeline (call/text 988 in the US/Canada, or local emergency services) immediately.`;

      // Convert conversation messages to Gemini format
      const formattedContents = messages.map((msg: { role: string; text: string }) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: String(msg.text || "") }],
      }));

      const { response, modelUsed } = await generateContentWithFallback(ai, {
        contents: formattedContents,
        systemInstruction,
        temperature: 0.7,
      });

      const responseText = response.text || "";
      return res.json({ reply: responseText, modelUsed });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      const isMissingKey = error.message && error.message.includes("GEMINI_API_KEY");
      return res.status(500).json({
        error: isMissingKey
          ? "Gemini API key is not configured in environment."
          : error.message || "Failed to process mindful chat message.",
      });
    }
  });

  // Summarize Journal Reflection Endpoint
  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const data = req.body && typeof req.body === "object" ? req.body : {};
      const { text, messages, language = "en" } = data;

      let contentToSummarize = "";
      if (text && typeof text === "string" && text.trim().length > 0) {
        contentToSummarize = text.trim();
      } else if (Array.isArray(messages) && messages.length > 0) {
        contentToSummarize = messages
          .map((m: any) => `${m.role === "user" ? "User" : "MindPulse"}: ${m.text}`)
          .join("\n\n");
      }

      if (!contentToSummarize) {
        return res.status(400).json({ error: "No content provided to summarize." });
      }

      const ai = getAI();

      const langPrompt =
        language === "hi"
          ? "CRITICAL: The entire summary and key takeaways must be written in natural, fluent Hindi (Devanagari script)."
          : "Provide the summary in clear, empathetic, and professional English.";

      const prompt = `Please provide a thoughtful, mindful summary of the following journal reflection session:

${contentToSummarize}

${langPrompt}

Return a structured summary with:
1. Core Emotional Theme (1-2 sentences capturing the underlying feeling/state)
2. Key Insight or Breakthrough (what the reflection reveals)
3. 2-3 Actionable Micro-Takeaways (grounded, practical steps)`;

      const { response, modelUsed } = await generateContentWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        temperature: 0.4,
      });

      return res.json({
        summary: response.text || "Summary generated successfully.",
        modelUsed,
      });
    } catch (error: any) {
      console.error("Gemini Summarize API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate reflection summary.",
      });
    }
  });

  // Brainstorming Ideas & Micro-steps Endpoint
  app.post("/api/gemini/brainstorm", async (req, res) => {
    try {
      const data = req.body && typeof req.body === "object" ? req.body : {};
      const { topic, context, language = "en" } = data;

      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required for brainstorming." });
      }

      const ai = getAI();

      const langPrompt =
        language === "hi"
          ? "CRITICAL: Write all brainstorming ideas, titles, and steps in natural, encouraging Hindi (Devanagari script)."
          : "Write in clear, uplifting, and practical English.";

      const prompt = `Brainstorm creative, manageable, and soothing ideas/actions for the following reflection topic:
Topic: "${topic}"
Context: ${context || "Daily wellness reflection"}

${langPrompt}

Provide 4 distinct, highly actionable ideas or perspectives:
- 1 Sensory/Somatic Grounding Idea (quick physical reset)
- 1 Cognitive Reframing Idea (a fresh, gentle perspective)
- 1 Micro-Action (can be completed in under 5 minutes)
- 1 Boundary or Restorative Practice (protecting personal energy)

Format each with a clear title and a 1-2 sentence description.`;

      const { response, modelUsed } = await generateContentWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        temperature: 0.7,
      });

      return res.json({
        ideas: response.text || "",
        modelUsed,
      });
    } catch (error: any) {
      console.error("Gemini Brainstorm API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate brainstorming ideas.",
      });
    }
  });

  // AI Deep Wellness Recommendations & Stress Analysis
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const data = req.body && typeof req.body === "object" ? req.body : {};
      const { score, categoryScores, responses, userNotes, dailyMood, language = "en" } = data;

      const ai = getAI();

      const langPromptInstruction =
        language === "hi"
          ? `CRITICAL LOCALIZATION REQUIREMENT: The user has selected Hindi (हिन्दी).
All string fields in the response JSON ("summary", "stressTier", "keyTriggers", "immediateGrounding.title", "immediateGrounding.steps", "dailyMicroHabits[].title", "dailyMicroHabits[].description", "dailyMicroHabits[].benefit", "cognitiveReframes[].stressThought", "cognitiveReframes[].empoweringReframe", "restorativePlan.sleepAdvice", "restorativePlan.nervousSystemReset", "restorativePlan.boundaryTip", "affirmation") MUST be written in natural, compassionate Hindi (Devanagari script). Keep the JSON keys in English as specified in the schema.`
          : `Provide all text in clear, empathetic, and evidence-informed English.`;

      const moodInfo = dailyMood
        ? `User's Daily Mood Check-In: ${dailyMood.emoji} ${dailyMood.label} (Mood: ${dailyMood.mood})
Mood Stress Calibration: ${dailyMood.stressModifier > 0 ? `+${dailyMood.stressModifier}` : dailyMood.stressModifier} pts
User's Mood Note: ${dailyMood.note ? `"${dailyMood.note}"` : "No specific note"}
NOTE: You MUST refine and tailor the summary, key triggers, immediate grounding, and daily micro-habits specifically addressing their current emotional mood and note!`
        : `Daily Mood: None logged today.`;

      const prompt = `Analyze this mental health & stress assessment and provide high-impact, compassionate, personalized wellness recommendations.
Stress Score: ${score} / 1000 (Scale: 100 = minimum stress/deep serenity, 1000 = maximum stress/extreme overload).

${moodInfo}

Category breakdown (scores out of 1000):
${JSON.stringify(categoryScores || {}, null, 2)}

User Questionnaire Answers:
${JSON.stringify(responses || {}, null, 2)}

User Personal Notes / Context:
${userNotes ? `"${userNotes}"` : "None provided"}

${langPromptInstruction}

Please return a JSON object with this exact schema:
{
  "summary": "Warm, insightful 2-3 sentence overview of their current mental balance and stress drivers.",
  "stressTier": "Deep Calm | Balanced Flow | Moderate Strain | High Stress | Acute Overload",
  "keyTriggers": ["Key trigger or vulnerability 1", "Key trigger or vulnerability 2", "Key trigger 3"],
  "immediateGrounding": {
    "title": "Short title for grounding practice (e.g. 5-4-3-2-1 Sensory Reset, Physiological Sigh, Cold Splash)",
    "duration": "e.g. 3 Minutes",
    "steps": ["Step 1...", "Step 2...", "Step 3..."]
  },
  "dailyMicroHabits": [
    {
      "title": "Micro-habit title",
      "timeOfDay": "Morning | Midday | Evening",
      "description": "Clear actionable 1-2 sentence instruction",
      "benefit": "Why this calms the nervous system"
    },
    {
      "title": "Micro-habit title 2",
      "timeOfDay": "Midday",
      "description": "Instruction...",
      "benefit": "Benefit..."
    },
    {
      "title": "Micro-habit title 3",
      "timeOfDay": "Evening",
      "description": "Instruction...",
      "benefit": "Benefit..."
    }
  ],
  "cognitiveReframes": [
    {
      "stressThought": "A typical distorted thought related to their high category",
      "empoweringReframe": "A compassionate, realistic reframe"
    },
    {
      "stressThought": "Another stress thought",
      "empoweringReframe": "Another compassionate reframe"
    }
  ],
  "restorativePlan": {
    "sleepAdvice": "Targeted sleep hygiene action",
    "nervousSystemReset": "Physical or somatic practice for nervous system regulation",
    "boundaryTip": "One practical boundary to establish today"
  },
  "affirmation": "A short, grounded grounding mantra"
}`;

      const { response, modelUsed } = await generateContentWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        temperature: 0.5,
        responseMimeType: "application/json",
      });

      const responseText = response.text || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr);
        parsed = { summary: responseText };
      }

      return res.json({ analysis: parsed, modelUsed });
    } catch (error: any) {
      console.error("Gemini Analysis API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate personalized recommendations.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
