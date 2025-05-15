import { suggestAppPlacement, SuggestAppPlacementInput, SuggestAppPlacementOutput } from '@/ai/flows/ai-powered-app-placement';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse<SuggestAppPlacementOutput | { error: string }>> {
  try {
    const input: SuggestAppPlacementInput = await req.json();

    if (!input.appName || !input.spatialDescription) {
      return NextResponse.json({ error: "Application name and spatial description are required." }, { status: 400 });
    }

    const result = await suggestAppPlacement(input);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in AI placement API:", error);
    return NextResponse.json({ error: "Failed to get AI suggestion." }, { status: 500 });
  }
}
 