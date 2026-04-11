import OpenAI from "openai";

interface AIProvider {
  name: string;
  client: OpenAI;
  model: string;
}

export async function generateAICompletion(
  messages: any[],
  responseFormat: "text" | "json_object" = "text"
) {
  const providers: AIProvider[] = [];

  // 1. Groq (Primary Priority - Fast & Free)
  if (process.env.GROQ_API_KEY) {
    providers.push({
      name: "Groq",
      client: new OpenAI({ 
        apiKey: process.env.GROQ_API_KEY, 
        baseURL: "https://api.groq.com/openai/v1" 
      }),
      model: "llama3-8b-8192", 
    });
  }

  // 2. OpenRouter (Secondary Fallback - Highly Flexible)
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: "OpenRouter",
      client: new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_LABS_URL || "http://localhost:3000",
          "X-Title": "Mwenaro Labs Forge",
        },
      }),
      model: "google/gemma-3-12b-it:free",
    });
  }

  // 3. DeepSeek (Tertiary Fallback via OpenRouter)
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: "DeepSeek",
      client: new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_LABS_URL || "http://localhost:3000",
          "X-Title": "Mwenaro Labs Forge",
        },
      }),
      model: "deepseek/deepseek-chat:free",
    });
  }

  if (providers.length === 0) {
    throw new Error("NO_PROVIDERS_CONFIGURED");
  }

  let lastError: any = null;

  // Cascade through available providers sequentially
  for (const provider of providers) {
    try {
      const completion = await provider.client.chat.completions.create({
        model: provider.model,
        messages,
        response_format: responseFormat === "json_object" ? { type: "json_object" } : undefined,
      });

      return {
        text: completion.choices[0]?.message?.content?.trim() || "",
        provider: provider.name
      };
    } catch (err: any) {
      console.warn(`[AI Fallback] ${provider.name} failed:`, err?.message || err);
      lastError = err;
      // Loop seamlessly continues to the next available provider
    }
  }

  // If all providers fail the active request, throw the final error caught
  throw lastError;
}
