import { NextResponse } from 'next/server';
import { getElectionBuddyResponse } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const responseText = await getElectionBuddyResponse(history || [], message);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
