"use client";

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, X, Square, Copy } from 'lucide-react';
import type { OpenAppInstance } from '@/lib/types';

interface AppWindowProps {
  app: OpenAppInstance;
  onClose: (instanceId: string) => void;
  onMinimize: (instanceId: string) => void;
  onFocus: (instanceId: string) => void;
  onDrag: (instanceId: string, newPosition: { x: number; y: number }) => void;
  // onResize: (instanceId: string, newSize: { width: number; height: number }) => void; // Future enhancement
  constraintsRef: React.RefObject<HTMLElement>;
}

const AppWindow: React.FC<AppWindowProps> = ({ app, onClose, onMinimize, onFocus, onDrag, constraintsRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent dragging on buttons or content
    if ((e.target as HTMLElement).closest('button, input, textarea, [data-no-drag="true"]')) {
      return;
    }
    onFocus(app.instanceId);
    setIsDragging(true);
    setDragStartPos({
      x: e.clientX - app.position.x,
      y: e.clientY - app.position.y,
    });
    // Add user-select-none to body to prevent text selection during drag
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !constraintsRef.current || !windowRef.current) return;

      let newX = e.clientX - dragStartPos.x;
      let newY = e.clientY - dragStartPos.y;
      
      const parentRect = constraintsRef.current.getBoundingClientRect();
      const windowRect = windowRef.current.getBoundingClientRect();

      // Constrain dragging within parent bounds
      newX = Math.max(0, Math.min(newX, parentRect.width - windowRect.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - windowRect.height));
      
      onDrag(app.instanceId, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = ''; // Re-enable text selection
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStartPos, app.instanceId, onDrag, app.position, constraintsRef]);
  
  if (app.isMinimized) {
    return null; // Minimized apps are handled by the Dock or Taskbar typically
  }

  return (
    <div
      ref={windowRef}
      className="absolute"
      style={{
        left: `${app.position.x}px`,
        top: `${app.position.y}px`,
        width: `${app.size.width}px`,
        height: `${app.size.height}px`,
        zIndex: app.zIndex,
        boxShadow: app.isFocused ? "0 0 20px 5px hsl(var(--ring) / 0.5)" : "0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.15)",
        transition: 'box-shadow 0.2s ease-in-out',
      }}
      onMouseDown={() => onFocus(app.instanceId)} // Focus on any click within window
    >
      <Card className="w-full h-full flex flex-col rounded-lg overflow-hidden border-2" style={{ borderColor: app.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))' }}>
        <div
          className="h-8 bg-card-foreground/10 text-card-foreground flex items-center justify-between px-2 cursor-grab border-b"
          onMouseDown={handleMouseDown}
          style={{ borderColor: app.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))' }}
        >
          <div className="flex items-center gap-2">
            <app.icon className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium truncate">{app.title || app.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => onMinimize(app.instanceId)} title="Minimize">
              <Minus className="w-3 h-3" />
            </Button>
            {/* <Button variant="ghost" size="icon" className="w-6 h-6" title="Maximize (Not Implemented)">
              <Square className="w-3 h-3" />
            </Button> */}
            <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-destructive/80" onClick={() => onClose(app.instanceId)} title="Close">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-0 bg-card" data-no-drag="true">
          <app.component />
        </div>
      </Card>
    </div>
  );
};

export default AppWindow;
