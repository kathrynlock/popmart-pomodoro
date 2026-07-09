import { useRef, useCallback } from 'react';

interface Particle {
  type: 'conf' | 'spark';
  x: number;
  y: number;
  vx: number;
  vy: number;
  grav: number;
  rot: number;
  vr: number;
  w?: number;
  h?: number;
  size?: number;
  color: string;
  life: number;
  alpha: number;
  tw: number;
}

export function useParticles() {
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const vwRef = useRef(0);
  const vhRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reduceMotionRef = useRef(
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const initCanvas = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    const ctx = cv.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = ctx;
    }
    vwRef.current = innerWidth;
    vhRef.current = innerHeight;
  }, []);

  const startLoop = useCallback(() => {
    const loop = () => {
      const c = ctxRef.current;
      if (!c) return;
      c.clearRect(0, 0, vwRef.current, vhRef.current);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.vy += p.grav;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life--;
        p.tw += 0.25;

        p.alpha = p.life < 22 ? Math.max(0, p.life / 22) : 1;

        if (p.type === 'spark') {
          const s = (p.size || 5) * (0.55 + 0.45 * Math.abs(Math.sin(p.tw)));
          c.save();
          c.globalAlpha = p.alpha;
          c.translate(p.x, p.y);
          c.rotate(p.rot);
          c.fillStyle = p.color;
          c.fillRect(-s * 0.14, -s, s * 0.28, s * 2);
          c.fillRect(-s, -s * 0.14, s * 2, s * 0.28);
          c.restore();
        } else {
          c.save();
          c.globalAlpha = p.alpha;
          c.translate(p.x, p.y);
          c.rotate(p.rot);
          c.fillStyle = p.color;
          c.fillRect(-(p.w || 7) / 2, -(p.h || 9) / 2, p.w || 7, p.h || 9);
          c.restore();
        }

        if (p.life <= 0 || p.y > vhRef.current + 60) {
          particlesRef.current.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const confetti = useCallback(
    (x: number, y: number, opts: { count?: number; power?: number; spread?: number; palette?: string[] } = {}) => {
      const count = Math.round((opts.count || 90) * (reduceMotionRef.current ? 0.4 : 1));
      const palette = opts.palette || ['#FFCBE1', '#F5A0C4', '#FFDAB5', '#FFC58A', '#FAF2A8', '#FFEB7A', '#DBF0BA', '#CFF295', '#D0E6F7', '#A4D1F2', '#E5D8F2', '#D3B6F0'];

      for (let i = 0; i < count; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * (opts.spread || 2.2);
        const sp = (opts.power || 9) * (0.4 + Math.random() * 0.9);
        particlesRef.current.push({
          type: 'conf',
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 3,
          grav: 0.22,
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.4,
          w: 7 + Math.random() * 7,
          h: 9 + Math.random() * 8,
          color: palette[(Math.random() * palette.length) | 0],
          life: 90 + Math.random() * 40,
          alpha: 1,
          tw: 0,
        });
      }
    },
    []
  );

  const sparkles = useCallback(
    (x: number, y: number, opts: { count?: number; power?: number; jitter?: number; colors?: string[] } = {}) => {
      const colors = opts.colors || ['#FFF6D6', '#FFE7A8', '#FFCBE1', '#E5D8F2', '#D0E6F7', '#DBF0BA'];
      const count = Math.round((opts.count || 40) * (reduceMotionRef.current ? 0.4 : 1));

      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = (opts.power || 6) * (0.3 + Math.random());
        particlesRef.current.push({
          type: 'spark',
          x: x + (Math.random() - 0.5) * (opts.jitter || 20),
          y: y + (Math.random() - 0.5) * (opts.jitter || 20),
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 1.5,
          grav: 0.06,
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.2,
          size: 5 + Math.random() * 8,
          color: colors[(Math.random() * colors.length) | 0],
          life: 70 + Math.random() * 50,
          alpha: 1,
          tw: Math.random() * 6,
        });
      }
    },
    []
  );

  return {
    canvasRef,
    initCanvas,
    startLoop,
    confetti,
    sparkles,
    cleanup: () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
  };
}
