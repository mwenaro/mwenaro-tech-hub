import { NextRequest, NextResponse } from "next/server";
import { generateAICompletion } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const systemInstruction = `You are the "Mwenaro Labs AI Strategist", an elite technical architect and product strategist.
Your goal is to help visitors frame their software project ideas and suggest modern tech stacks (React, Next.js, Tailwnid, Supabase, etc).
Keep your responses very concise, highly technical, and professional. 
Do not write long essays. Use bullet points for suggested tech stacks.
Acknowledge constraints and business goals if the user mentions them.
If they ask about Mwenaro Labs, explain it's the R&D division of the Mwenaro Tech Hub building futuristic digital solutions.

Format the response in Markdown.`;

    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map((msg: any) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const { text, provider } = await generateAICompletion(messages);

    return NextResponse.json({ reply: text, provider });
  } catch (err: any) {
    console.error("[forge/strategist] error:", err?.message || err);

    // Fallback mock response for ANY provider error to ensure the UI never deadlocks or crashes visually
    return NextResponse.json({ 
      reply: "I am currently at max aggregate capacity across all fallback vectors (API Limit Reached). However, for your project, I'd highly recommend building with **Next.js 16**, **Tailwind CSS**, and **Supabase**. It's the exact bleeding-edge stack we use here at Mwenaro Labs to guarantee performance. What specific features does your project need?",
      provider: "Mock Simulation Mode"
    });


  }
}
