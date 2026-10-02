import type { AppState } from '../types';

const STORAGE_KEY = 'focus-friends-state';

// Only these keys are persisted; timer and modal/UI state always start fresh.
const PERSISTED_KEYS = [
  'tasks',
  'collection',
  'displayed',
  'pending',
  'sessionMode',
  'timerMins',
  'pomoWork',
  'pomoBreak',
  'sessionBox',
] as const satisfies readonly (keyof AppState)[];

function pickPersisted(state: Partial<AppState>): Partial<AppState> {
  const result: Record<string, unknown> = {};
  for (const key of PERSISTED_KEYS) {
    if (key in state) result[key] = state[key];
  }
  return result as Partial<AppState>;
}

export const storage = {
  getState(): Partial<AppState> | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Whitelist on load too, so UI state saved by older versions is dropped
      return stored ? pickPersisted(JSON.parse(stored)) : null;
    } catch (e) {
      console.error('Failed to load state from storage:', e);
      return null;
    }
  },

  setState(state: Partial<AppState>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pickPersisted(state)));
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
