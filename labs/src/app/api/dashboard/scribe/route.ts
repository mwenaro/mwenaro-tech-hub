import { NextRequest, NextResponse } from "next/server";
import { generateAICompletion } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    let contextString = "";
    if (context) {
      contextString = `\n\nCURRENT PAGE CONTEXT:\n${JSON.stringify(context, null, 2)}\n\nUse this context (proposal details, project info, etc.) to give more specific and helpful answers.`;
    }

    const systemInstruction = `You are the "Mwenaro Labs AI Scribe", a specialized technical architect and professional proposal writer.
Your core goal is to help users and admins draft technical documentation, define project scopes, architectural roadmaps, and full software proposals.

GUIDELINES:
- Be formal, precise, and highly professional.
- Use advanced software engineering terminology (e.g., "microservices", "stateless architecture", "event-driven", etc.) when appropriate.
- Help refine problem statements into clear technical requirements.
- Suggest modern tech stacks (Next.js, Tailwind, Supabase, Groq, etc.) as the default for Mwenaro Labs projects.
- If context is provided, prioritize it. If they are writing a proposal, help them expand on the features and budget justification.

Format all responses in Markdown.${contextString}`;

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
    console.error("[dashboard/scribe] error:", err?.message || err);

    // Fallback mock response if all providers fail
    return NextResponse.json({ 
      reply: "I am temporarily in high-demand mode. For your proposal, ensure you clearly define the **Core Problem Statement**, **Target User Personas**, and a **Phased Roadmap**. This structure ensures clarity and transparency for all stakeholders. How else can I assist with your documentation today?",
      provider: "Mock Scribe Mode"
    });
  }
}
