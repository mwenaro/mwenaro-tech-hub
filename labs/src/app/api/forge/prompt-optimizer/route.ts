import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a prompt with at least 5 characters." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 503 }
      );
    }

    const modeInstructions: Record<string, string> = {
      refine: `You are an expert prompt engineer. The user has provided a rough AI prompt. Your task is to rewrite it to be more specific, clear, and effective.
Return ONLY a JSON object with these fields:
- "optimized": the improved prompt (string)
- "improvements": a list of 3 specific improvements made (string[])
- "score": a quality score from 1-10 for the original prompt (number)`,

      expand: `You are an expert prompt engineer. The user has provided a brief prompt. Expand it significantly with context, constraints, output format instructions, and examples where useful.
Return ONLY a JSON object with these fields:
- "optimized": the fully expanded prompt (string)
- "improvements": a list of 3 elements added or expanded (string[])
- "score": a quality score from 1-10 for the original prompt (number)`,

      simplify: `You are an expert prompt engineer. The user has provided a complex or verbose prompt. Simplify it into its most essential form without losing intent.
Return ONLY a JSON object with these fields:
- "optimized": the simplified prompt (string)
- "improvements": a list of 3 things simplified or removed for clarity (string[])
- "score": a quality score from 1-10 for the original prompt (number)`,
    };

    const systemInstruction = modeInstructions[mode] || modeInstructions.refine;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const result = await model.generateContent(
      `Here is the user's prompt to optimize:\n\n"${prompt.trim()}"\n\nRespond with ONLY a valid JSON object, no markdown or extra text.`
    );

    const text = result.response.text().trim();

    // Strip markdown code fences if Gemini returns them
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("[forge/prompt-optimizer] error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AI returned unexpected output. Please try again." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
