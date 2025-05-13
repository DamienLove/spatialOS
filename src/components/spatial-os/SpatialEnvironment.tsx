
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AppData, OpenAppInstance } from '@/lib/types';
import AppWindow from './AppWindow';
import Dock from './Dock';
import { defaultApps } from '@/lib/app-definitions';
import { useToast } from "@/hooks/use-toast";

const WORLD_WIDTH = 3000; // px
const WORLD_HEIGHT = 2000; // px

const SpatialEnvironment: React.FC = () => {
  const [openApps, setOpenApps] = useState<OpenAppInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState<number>(10);
  const [nextInstanceId, setNextInstanceId] = useState<number>(1);
  const { toast } = useToast();

  const environmentRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  
  // Initialize with a non-window-dependent, server-renderable default.
  // The useEffect will center it properly on the client after mount.
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [panState, setPanState] = useState({ isPanning: false,startX: 0, startY: 0, initialTx: 0, initialTy: 0 });

  // Effect to center the initial view based on window size
  useEffect(() => {
    // This runs only on the client, after the initial mount
    setTranslate({
      x: (WORLD_WIDTH - window.innerWidth) / -2,
      y: (WORLD_HEIGHT - window.innerHeight) / -2
    });
  }, []); // Empty dependency array ensures this runs once on client mount


  const launchApp = (appId: string) => {
    const appToLaunch = defaultApps.find(app => app.id === appId);
    if (!appToLaunch) return;

    // Check if an instance of this app type is already open and not minimized
    const existingInstance = openApps.find(app => app.id === appId && !app.isMinimized);
    if (existingInstance) {
      focusApp(existingInstance.instanceId);
       toast({
          title: `${existingInstance.name} is already open.`,
          description: "Bringing the existing window to front.",
        });
      return;
    }
    
    // Check if a minimized instance exists, then restore it
    const minimizedInstance = openApps.find(app => app.id === appId && app.isMinimized);
    if (minimizedInstance) {
        toggleMinimize(minimizedInstance.instanceId);
        focusApp(minimizedInstance.instanceId);
        return;
    }


    const newInstanceId = `app-${nextInstanceId}`;
    setNextInstanceId(prev => prev + 1);

    const newAppInstance: OpenAppInstance = {
      ...appToLaunch,
      instanceId: newInstanceId,
      position: { 
        // Calculate center of current viewport
        // Ensure environmentRef.current is available, otherwise default
        x: Math.abs(translate.x) + (environmentRef.current ? environmentRef.current.clientWidth / 2 : window.innerWidth / 2) - (appToLaunch.defaultSize?.width ?? 600) / 2 + (Math.random() * 100 - 50),
        y: Math.abs(translate.y) + (environmentRef.current ? environmentRef.current.clientHeight / 2 : window.innerHeight / 2) - (appToLaunch.defaultSize?.height ?? 400) / 2 + (Math.random() * 100 - 50),
      },
      size: appToLaunch.defaultSize ?? { width: 600, height: 400 },
      zIndex: nextZIndex,
      isMinimized: false,
      isFocused: true,
      title: appToLaunch.name,
    };

    setOpenApps(prevApps => prevApps.map(app => ({...app, isFocused: false})).concat(newAppInstance));
    setNextZIndex(prev => prev + 1);
  };

  const closeApp = (instanceId: string) => {
    setOpenApps(prevApps => prevApps.filter(app => app.instanceId !== instanceId));
  };

  const focusApp = (instanceId: string) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.instanceId === instanceId
          ? { ...app, zIndex: nextZIndex, isFocused: true, isMinimized: false } // Ensure unminimized on focus
          : { ...app, isFocused: false }
      )
    );
    setNextZIndex(prev => prev + 1);
  };
  
  const toggleMinimize = (instanceId: string) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.instanceId === instanceId
          ? { ...app, isMinimized: !app.isMinimized, isFocused: !app.isMinimized ? true : false }
          : app
      )
    );
    if (openApps.find(app => app.instanceId === instanceId && !app.isMinimized)) {
        focusApp(instanceId); // If unminimizing, focus it
    }
  };

  const handleAppDrag = (instanceId: string, newPosition: { x: number; y: number }) => {
    setOpenApps(prevApps =>
      prevApps.map(app =>
        app.instanceId === instanceId ? { ...app, position: newPosition } : app
      )
    );
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent panning if clicking on an app window or dock
    if ((e.target as HTMLElement).closest('[data-app-window="true"], [data-dock="true"]')) {
      return;
    }
    setPanState({ isPanning: true, startX: e.clientX, startY: e.clientY, initialTx: translate.x, initialTy: translate.y });
    if (environmentRef.current) environmentRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!panState.isPanning || !environmentRef.current) return;
    const dx = e.clientX - panState.startX;
    const dy = e.clientY - panState.startY;
    
    let newTx = panState.initialTx + dx;
    let newTy = panState.initialTy + dy;

    // Clamp translation to keep world within bounds
    const parentWidth = environmentRef.current.clientWidth;
    const parentHeight = environmentRef.current.clientHeight;

    newTx = Math.min(0, Math.max(newTx, -(WORLD_WIDTH - parentWidth)));
    newTy = Math.min(0, Math.max(newTy, -(WORLD_HEIGHT - parentHeight)));

    setTranslate({ x: newTx, y: newTy });
  }, [panState]);

  const handleMouseUp = useCallback(() => {
    setPanState(prev => ({ ...prev, isPanning: false }));
    if (environmentRef.current) environmentRef.current.style.cursor = 'grab';
  }, []);

  useEffect(() => {
    if (panState.isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [panState.isPanning, handleMouseMove, handleMouseUp]);


  return (
    <div
      ref={environmentRef}
      className="flex-grow w-full h-full relative overflow-hidden cursor-grab bg-background"
      onMouseDown={handleMouseDown}
      style={{
        backgroundImage: 'radial-gradient(hsl(var(--border)/0.2) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div
        ref={worldRef}
        className="absolute"
        style={{
          width: `${WORLD_WIDTH}px`,
          height: `${WORLD_HEIGHT}px`,
          transform: `translate(${translate.x}px, ${translate.y}px)`,
          transition: panState.isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {openApps.map(app => (
          <div key={app.instanceId} data-app-window="true">
            <AppWindow
              app={app}
              onClose={closeApp}
              onMinimize={toggleMinimize}
              onFocus={focusApp}
              onDrag={handleAppDrag}
              constraintsRef={worldRef} // Pass worldRef for drag constraints
            />
          </div>
        ))}
      </div>
      <div data-dock="true">
        <Dock apps={defaultApps} openApps={openApps} onLaunchApp={launchApp} onToggleMinimize={toggleMinimize} onFocusApp={focusApp} />
      </div>
    </div>
  );
};

export default SpatialEnvironment;

