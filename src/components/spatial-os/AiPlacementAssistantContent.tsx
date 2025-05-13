"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle } from 'lucide-react';
import { getAiPlacementSuggestion } from '@/app/actions/aiPlacementActions';
import type { SuggestAppPlacementOutput } from '@/ai/flows/ai-powered-app-placement';

const AiPlacementAssistantContent: React.FC = () => {
  const [appName, setAppName] = useState<string>('');
  const [spatialDescription, setSpatialDescription] = useState<string>('A large open area with a central focus point. The user is facing forward.');
  const [suggestion, setSuggestion] = useState<SuggestAppPlacementOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    const result = await getAiPlacementSuggestion({ appName, spatialDescription });

    if ('error' in result) {
      setError(result.error);
    } else {
      setSuggestion(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground rounded-lg p-1 overflow-y-auto">
      <Card className="w-full h-full flex flex-col border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl">AI Placement Assistant</CardTitle>
          </div>
          <CardDescription>
            Get AI-powered suggestions for placing your apps in the spatial environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="appName" className="text-sm">Application Name</Label>
              <Input
                id="appName"
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g., My Awesome App"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="spatialDescription" className="text-sm">Spatial Environment Description</Label>
              <Textarea
                id="spatialDescription"
                value={spatialDescription}
                onChange={(e) => setSpatialDescription(e.target.value)}
                placeholder="Describe the current layout, existing apps, and desired area..."
                required
                className="mt-1 min-h-[100px]"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Getting Suggestion...' : 'Get Suggestion'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-destructive/20 text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {suggestion && (
            <div className="mt-6 p-4 rounded-md border border-accent bg-accent/10">
              <h3 className="text-lg font-semibold text-accent mb-2">Placement Suggestion:</h3>
              <p className="text-sm whitespace-pre-wrap">{suggestion.suggestedPlacement}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            The AI provides textual suggestions. Actual placement might require manual adjustment.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AiPlacementAssistantContent;
