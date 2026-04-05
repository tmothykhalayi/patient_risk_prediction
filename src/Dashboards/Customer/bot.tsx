import { GoogleGenerativeAI } from "@google/generative-ai";

interface SessionContext {
  topics: string[];
  mood: string;
  stressLevel: number;
}

type SessionType = "dump" | "morning" | "night" | "mindmap" | "chat" | "therapist" | null;

// Initialize Gemini AI
const getApiKey = (): string => {
  return import.meta.env?.VITE_GEMINI_API || "";
};

const apiKey = getApiKey();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000;

// Generate AI response with context extraction
const generateAIResponse = async (
  userMessage: string,
  sessionType: SessionType,
  context: SessionContext
): Promise<{ response: string; extractedContext: Partial<SessionContext> }> => {
  if (!model) {
    return {
      response: "AI service is currently unavailable. Please check your API key configuration.",
      extractedContext: {},
    };
  }

  try {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    const prompts = {
      dump: `You are a compassionate listener for a developer's mental load dump. They need to vent without judgment.
Current context: ${JSON.stringify(context)}
User: "${userMessage}"

Respond with:
1. Deep validation and empathy (2-3 sentences)
2. Brief reflection of their feelings
3. ONE gentle question to help them process further

Extract: mood indicators, stress topics, burnout signals. Be warm, brief, supportive. 💙`,

      morning: `You are a supportive morning check-in companion for developers.
Current context: ${JSON.stringify(context)}
User: "${userMessage}"

Respond with:
1. Warm acknowledgment of how they're feeling
2. ONE specific, achievable intention for their day
3. Brief encouragement (1-2 sentences)

Extract: energy level, concerns, goals. Keep it uplifting and brief. ☀️`,

      night: `You are a calming evening reflection companion for developers.
Current context: ${JSON.stringify(context)}
User: "${userMessage}"

Respond with:
1. Acknowledge their day (1-2 sentences)
2. Help them identify one win or learning
3. Gentle wind-down suggestion

Extract: stress levels, achievements, tomorrow's concerns. Be soothing and brief. 🌙`,

      mindmap: `You are a code logic companion helping developers think through problems.
Current context: ${JSON.stringify(context)}
User: "${userMessage}"

Respond with:
1. Reframe their problem clearly
2. Break into 2-3 logical steps or questions
3. Ask ONE clarifying question

Extract: problem complexity, confusion points. Be clear, structured, brief. 🧠`,

      chat: `You are a friendly AI companion for developers needing casual conversation.
Current context: ${JSON.stringify(context)}
User: "${userMessage}"

Respond naturally and conversationally (2-3 sentences). Be supportive but light.
Extract: general mood, topics of interest. 💬`,
    };

    const prompt = prompts[sessionType as keyof typeof prompts] || prompts.chat;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const extractedContext: Partial<SessionContext> = {
      topics: context.topics,
      mood: context.mood,
      stressLevel: context.stressLevel,
    };

    return { response, extractedContext };
  } catch (error: any) {
    console.error("AI Error:", error);
    if (error?.status === 429) {
      return {
        response: "Taking a breather... 😅 Please try again in a moment (rate limit).",
        extractedContext: {},
      };
    }
    return {
      response: "Connection issue. 😔 Please try again.",
      extractedContext: {},
    };
  }
};

export default generateAIResponse;