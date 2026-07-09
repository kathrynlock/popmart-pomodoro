import type { Figure, FigureSet } from '../types';
import { FIGURE_SETS } from '../data/figures';

export function useFigures() {
  const findFigure = (id: string): { fig: Figure; set: FigureSet } | null => {
    for (const set of FIGURE_SETS) {
      const fig = set.figures.find(f => f.id === id);
      if (fig) return { fig, set };
    }
    return null;
  };

  const pickRandomFigure = (): Figure => {
    const activeSet = FIGURE_SETS.find(s => s.active) || FIGURE_SETS[0];
    const total = activeSet.figures.reduce((a, f) => a + f.weight, 0);
    let r = Math.random() * total;
    for (const f of activeSet.figures) {
      if ((r -= f.weight) <= 0) return f;
    }
    return activeSet.figures[0];
  };

  return { findFigure, pickRandomFigure, allSets: FIGURE_SETS };
}
