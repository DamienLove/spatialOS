"use client";

import type React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AppData, OpenAppInstance } from '@/lib/types';
import SpatialOsLogo from './SpatialOsLogo';
import { Minus } from 'lucide-react';


interface DockProps {
  apps: AppData[];
  openApps: OpenAppInstance[];
  onLaunchApp: (appId: string) => void;
  onToggleMinimize: (instanceId: string) => void;
  onFocusApp: (instanceId: string) => void;
}

const Dock: React.FC<DockProps> = ({ apps, openApps, onLaunchApp, onToggleMinimize, onFocusApp }) => {
  const minimizedApps = openApps.filter(app => app.isMinimized);
  
  return (
    <TooltipProvider delayDuration={100}>
      <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl shadow-2xl bg-background/80 backdrop-blur-md border-border/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
              <SpatialOsLogo className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>SpatialOS Menu</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border mx-1"></div>

        {apps.map((app) => (
          <Tooltip key={app.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLaunchApp(app.id)}
                className="hover:bg-accent/20"
              >
                <app.icon className="w-5 h-5 text-foreground/80 hover:text-accent" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{app.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {minimizedApps.length > 0 && <div className="h-6 w-px bg-border mx-1"></div>}
        
        {minimizedApps.map((appInstance) => (
           <Tooltip key={appInstance.instanceId}>
           <TooltipTrigger asChild>
             <Button
               variant="ghost"
               size="icon"
               onClick={() => {
                 onToggleMinimize(appInstance.instanceId);
                 onFocusApp(appInstance.instanceId);
               }}
               className="hover:bg-accent/20 relative"
             >
               <appInstance.icon className="w-5 h-5 text-foreground/60 hover:text-accent" />
               <Minus className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 text-accent bg-background rounded-full p-0.5" />
             </Button>
           </TooltipTrigger>
           <TooltipContent side="top">
             <p>{appInstance.title || appInstance.name} (Minimized)</p>
           </TooltipContent>
         </Tooltip>
        ))}
      </Card>
    </TooltipProvider>
  );
};

export default Dock;
