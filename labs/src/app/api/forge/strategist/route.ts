import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client to point to OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Missing OPENROUTER_API_KEY." },
        { status: 503 }
      );
    }

    const systemInstruction = `You are the "Mwenaro Labs AI Strategist", an elite technical architect and product strategist.
Your goal is to help visitors frame their software project ideas and suggest modern tech stacks (React, Next.js, Tailwnid, Supabase, etc).
Keep your responses very concise, highly technical, and professional. 
Do not write long essays. Use bullet points for suggested tech stacks.
Acknowledge constraints and business goals if the user mentions them.
If they ask about Mwenaro Labs, explain it's the R&D division of the Mwenaro Tech Hub building futuristic digital solutions.

Format the response in Markdown.`;

    // OpenRouter uses standard OpenAI messages array format
    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map((msg: any) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "qwen/qwen-2.5-7b-instruct:free",
      messages: messages as any,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("[forge/strategist] error:", err?.message || err);

    if (
      err?.status === 429 ||
      err?.message?.includes("rate limit") ||
      err?.message?.includes("quota")
    ) {
      return NextResponse.json(
        { error: "The AI is taking a breather — rate limit hit. Please try again in 30 seconds." },
        { status: 429 }
      );
    }

    if (err?.status === 401 || err?.status === 403) {
      return NextResponse.json(
        { error: "AI service authentication failed. Check OPENROUTER_API_KEY." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
