import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DragGhostState {
  imageUrl: string | null;
  x: number;
  y: number;
}

export const DragContext = createContext<
  | {
      dragGhost: DragGhostState;
      setDragGhost: (ghost: DragGhostState) => void;
    }
  | undefined
>(undefined);

export function DragProvider({ children }: { children: ReactNode }) {
  const [dragGhost, setDragGhost] = useState<DragGhostState>({ imageUrl: null, x: 0, y: 0 });

  return <DragContext.Provider value={{ dragGhost, setDragGhost }}>{children}</DragContext.Provider>;
}
