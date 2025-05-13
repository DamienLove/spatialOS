"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppWindow, MessageCircle, Settings, Youtube } from 'lucide-react';

const mockApps = [
  { name: "SocialApp", icon: MessageCircle, description: "Connect with friends." },
  { name: "VideoPlayer", icon: Youtube, description: "Watch your favorite videos." },
  { name: "SystemSettings", icon: Settings, description: "Configure your device." },
  { name: "AnotherApp", icon: AppWindow, description: "A generic application." },
];

const AndroidAppsContent: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground rounded-lg p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-primary">Android Apps</h2>
      <p className="text-muted-foreground mb-6">
        Access a selection of your favorite Android applications. This is a simulated environment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockApps.map((app) => (
          <Card key={app.name} className="hover:shadow-lg transition-shadow duration-200 bg-background/50 hover:bg-background/80 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground">{app.name}</CardTitle>
              <app.icon className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{app.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-auto pt-4 text-center">
        Note: Full Android app functionality is not available in this simulation.
      </p>
    </div>
  );
};

export default AndroidAppsContent;
