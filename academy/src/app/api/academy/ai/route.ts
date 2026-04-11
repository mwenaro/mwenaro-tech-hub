import { NextResponse } from 'next/server';
import { getAcademyChatResponse } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { message, history, role, name } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const reply = await getAcademyChatResponse({ 
      message, 
      history, 
      role, 
      name 
    });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Academy AI Error:', error);
    return NextResponse.json({ 
      error: 'Failed to get response from Academy AI',
      details: error.message 
    }, { status: 500 });
  }
}
