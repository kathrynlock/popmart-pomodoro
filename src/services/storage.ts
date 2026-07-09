import type { AppState } from '../types';

const STORAGE_KEY = 'focus-friends-state';

export const storage = {
  getState(): Partial<AppState> | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load state from storage:', e);
      return null;
    }
  },

  setState(state: Partial<AppState>): void {
    try {
      const current = this.getState() || {};
      const merged = { ...current, ...state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error('Failed to save state to storage:', e);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  },
};
