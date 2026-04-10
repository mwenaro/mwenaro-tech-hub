import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured." },
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text().trim();

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("[forge/strategist] error:", err?.message || err);

    if (
      err?.status === 429 ||
      err?.message?.includes("Quota exceeded") ||
      err?.message?.includes("Too Many Requests") ||
      err?.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        { error: "The AI is taking a breather — free tier rate limit hit. Please try again in 30 seconds." },
        { status: 429 }
      );
    }

    if (err?.status === 401 || err?.status === 403) {
      return NextResponse.json(
        { error: "AI service authentication failed." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
