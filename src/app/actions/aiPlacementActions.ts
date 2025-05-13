"use server";

import { suggestAppPlacement, type SuggestAppPlacementInput, type SuggestAppPlacementOutput } from '@/ai/flows/ai-powered-app-placement';

export async function getAiPlacementSuggestion(input: SuggestAppPlacementInput): Promise<SuggestAppPlacementOutput | { error: string }> {
  try {
    if (!input.appName || !input.spatialDescription) {
      return { error: "Application name and spatial description are required." };
    }
    const result = await suggestAppPlacement(input);
    return result;
  } catch (error) {
    console.error("Error getting AI placement suggestion:", error);
    return { error: "Failed to get AI suggestion. Please try again." };
  }
}
