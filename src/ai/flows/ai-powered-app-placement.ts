// Implemented by Gemini.
'use server';
/**
 * @fileOverview An AI agent that suggests optimal placements for apps in a 3D spatial environment.
 *
 * - suggestAppPlacement - A function that takes the app name and available spatial information and suggests an ideal placement.
 * - SuggestAppPlacementInput - The input type for the suggestAppPlacement function.
 * - SuggestAppPlacementOutput - The return type for the suggestAppPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppPlacementInputSchema = z.object({
  appName: z.string().describe('The name of the application to be placed.'),
  spatialDescription: z
    .string()
    .describe(
      'A description of the available 3D space, including dimensions, available surfaces, and any obstructions.'
    ),
});
export type SuggestAppPlacementInput = z.infer<typeof SuggestAppPlacementInputSchema>;

const SuggestAppPlacementOutputSchema = z.object({
  suggestedPlacement: z
    .string()
    .describe(
      'A detailed description of the suggested placement, including coordinates, orientation, and rationale.'
    ),
});
export type SuggestAppPlacementOutput = z.infer<typeof SuggestAppPlacementOutputSchema>;

export async function suggestAppPlacement(
  input: SuggestAppPlacementInput
): Promise<SuggestAppPlacementOutput> {
  return suggestAppPlacementFlow(input);
}

const suggestAppPlacementPrompt = ai.definePrompt({
  name: 'suggestAppPlacementPrompt',
  input: {schema: SuggestAppPlacementInputSchema},
  output: {schema: SuggestAppPlacementOutputSchema},
  prompt: `You are an AI assistant specialized in spatial design and user interface placement within a 3D environment. Your goal is to suggest the best possible location and orientation for applications based on the provided spatial description.

  Given the following application name and spatial description, provide a detailed suggestion for where the app should be placed, including specific coordinates, orientation, and a brief explanation of why this placement is ideal.

  Application Name: {{{appName}}}
  Spatial Description: {{{spatialDescription}}}

  Consider factors such as ease of access, visibility, and potential conflicts with other elements in the space. The suggested placement should enhance the user's experience and productivity.
  `,
});

const suggestAppPlacementFlow = ai.defineFlow(
  {
    name: 'suggestAppPlacementFlow',
    inputSchema: SuggestAppPlacementInputSchema,
    outputSchema: SuggestAppPlacementOutputSchema,
  },
  async input => {
    const {output} = await suggestAppPlacementPrompt(input);
    return output!;
  }
);
