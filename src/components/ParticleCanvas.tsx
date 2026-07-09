import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useParticles } from '../hooks/useParticles';
import { ParticleContext } from '../context/ParticleContext';

export function ParticleCanvas({ children }: { children: ReactNode }) {
  const particles = useParticles();

  useEffect(() => {
    particles.initCanvas();
    particles.startLoop();

    const handleResize = () => particles.initCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      particles.cleanup();
    };
  }, [particles]);

  return (
    <ParticleContext.Provider value={particles}>
      <canvas
        ref={particles.canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 80,
        }}
      />
      {children}
    </ParticleContext.Provider>
  );
}
