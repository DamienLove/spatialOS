import type { LucideIcon } from 'lucide-react';

export interface AppData {
  id: string;
  name: string;
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  type: 'browser' | 'android-apps' | 'ai-assistant' | 'generic';
  component: React.FC;
  defaultSize?: { width: number; height: number };
}

export interface OpenAppInstance extends AppData {
  instanceId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isFocused: boolean;
  title?: string; 
}
