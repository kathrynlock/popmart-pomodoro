import { createContext } from 'react';
import type { ReactNode } from 'react';
import { useParticles } from '../hooks/useParticles';

export const ParticleContext = createContext<ReturnType<typeof useParticles> | null>(null);

export function ParticleProvider({ children, particles }: { children: ReactNode; particles: ReturnType<typeof useParticles> }) {
  return <ParticleContext.Provider value={particles}>{children}</ParticleContext.Provider>;
}
