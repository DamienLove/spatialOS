import type { AppData } from '@/lib/types';
import { Globe, LayoutGrid, Sparkles } from 'lucide-react';
import BrowserAppContent from '@/components/spatial-os/BrowserAppContent';
import AndroidAppsContent from '@/components/spatial-os/AndroidAppsContent';
import AiPlacementAssistantContent from '@/components/spatial-os/AiPlacementAssistantContent';

export const defaultApps: AppData[] = [
  {
    id: 'browser',
    name: 'Web Browser',
    icon: Globe,
    type: 'browser',
    component: BrowserAppContent,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'android-apps',
    name: 'Android Apps',
    icon: LayoutGrid,
    type: 'android-apps',
    component: AndroidAppsContent,
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: 'ai-assistant',
    name: 'AI Placement',
    icon: Sparkles,
    type: 'ai-assistant',
    component: AiPlacementAssistantContent,
    defaultSize: { width: 500, height: 650 },
  },
];
