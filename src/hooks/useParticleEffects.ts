import { useContext } from 'react';
import { ParticleContext } from '../context/ParticleContext';

export function useParticleEffects() {
  const particles = useContext(ParticleContext);
  if (!particles) {
    return {
      confetti: () => {},
      sparkles: () => {},
    };
  }
  return {
    confetti: particles.confetti,
    sparkles: particles.sparkles,
  };
}
