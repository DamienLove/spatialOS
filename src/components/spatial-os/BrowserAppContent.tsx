"use client";

import { useState, type FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Search } from 'lucide-react';

const BrowserAppContent: React.FC = () => {
  const [url, setUrl] = useState<string>("https://example.com");
  const [displayUrl, setDisplayUrl] = useState<string>("https://example.com");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real browser, this would navigate. Here, we just update the display.
    setDisplayUrl(url);
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="flex items-center p-2 border-b border-border gap-2">
        <Globe className="w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="flex-grow h-8 text-sm"
        />
        <Button type="submit" size="sm" variant="ghost" className="h-8">
          <Search className="w-4 h-4 mr-1" /> Go
        </Button>
      </form>
      <div className="flex-grow p-4 flex flex-col items-center justify-center text-center">
        <Globe className="w-24 h-24 text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Mock Web Browser</h2>
        <p className="text-muted-foreground">
          Content for <code className="bg-muted px-1 rounded">{displayUrl}</code> would be displayed here.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This is a simplified browser interface.
        </p>
      </div>
    </div>
  );
};

export default BrowserAppContent;
