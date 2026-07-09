import { createContext, useReducer, type ReactNode } from 'react';
import type { AppState, Task, TaskStatus, Figure, SessionMode } from '../types';
import React from 'react';
import { storage } from '../services/storage';

type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'MOVE_TASK'; payload: { id: number; status: TaskStatus } }
  | { type: 'UPDATE_TASK'; payload: Partial<Task> & { id: number } }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'SET_TIMER'; payload: Partial<AppState['timer']> }
  | { type: 'TICK_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SET_SESSION_MODE'; payload: SessionMode }
  | { type: 'SET_TIMER_MINS'; payload: number }
  | { type: 'SET_POMO_WORK'; payload: number }
  | { type: 'SET_POMO_BREAK'; payload: number }
  | { type: 'SET_SESSION_BOX'; payload: number }
  | { type: 'SET_MODAL'; payload: { key: string; value: boolean } }
  | { type: 'SET_ADD_TASK_MODAL'; payload: { visible: boolean; target?: TaskStatus } }
  | { type: 'UPDATE_NEW_TASK'; payload: { title?: string; desc?: string } }
  | { type: 'TOGGLE_SESSION_POPUP' }
  | { type: 'TOGGLE_COLLECTION' }
  | { type: 'TOGGLE_BLINDBOX' }
  | { type: 'TOGGLE_FIGURE_DETAIL'; payload?: string }
  | { type: 'COMPLETE_WORK_PHASE'; payload: { kind: 'timer-work' | 'pomo-work' } }
  | { type: 'COMPLETE_BREAK_PHASE' }
  | { type: 'OPEN_BLINDBOX'; payload: number }
  | { type: 'ADD_FIGURE_TO_COLLECTION'; payload: Figure }
  | { type: 'TOGGLE_SHELF'; payload: string }
  | { type: 'REORDER_SHELF'; payload: string[] }
  | { type: 'MARK_JUST_DONE'; payload: number | null }
  | { type: 'BLIND_BOX_SHAKE' }
  | { type: 'BLIND_BOX_REVEAL'; payload: Figure }
  | { type: 'BLIND_BOX_NEXT' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const initialState: AppState = {
  tasks: [
    { id: 1, title: 'Sketch the onboarding flow', desc: 'rough out 3 screens', status: 'backlog' },
    { id: 2, title: 'Reply to Mia\'s email', desc: 'about the launch date', status: 'backlog' },
    { id: 3, title: 'Write the blog intro', desc: 'keep it playful', status: 'progress' },
    { id: 4, title: 'Water the plants', desc: '', status: 'progress' },
    { id: 5, title: 'Morning pages', desc: '', status: 'done' },
  ],
  collection: { 'ny-genesis': 1, 'ny-wisteria': 1 },
  displayed: ['ny-genesis', 'ny-wisteria'],
  selectedFigureId: null,
  draggingId: null,
  pending: [2],
  timer: { mode: 'timer', phase: 'work', work: 45 * 60, brk: 5 * 60, total: 45 * 60, left: 45 * 60, running: false, active: false, box: 0 },
  sessionMode: 'timer',
  timerMins: 45,
  pomoWork: 25,
  pomoBreak: 5,
  sessionBox: 0,
  justDone: null,
  showSessionPopup: false,
  showSessionComplete: false,
  showCollection: false,
  showAddTask: false,
  showBlindbox: false,
  showFigureDetail: false,
  addTarget: 'backlog',
  newTaskTitle: '',
  newTaskDesc: '',
  bbPhase: 'ready',
  bbFigure: null,
  bbBox: 0,
  completeKind: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, status: action.payload.status } : t
        ),
      };

    case 'REORDER_TASKS':
      return { ...state, tasks: action.payload };

    case 'SET_TIMER':
      return { ...state, timer: { ...state.timer, ...action.payload } };

    case 'TICK_TIMER':
      return {
        ...state,
        timer: { ...state.timer, left: Math.max(0, state.timer.left - 1) },
      };

    case 'PAUSE_TIMER':
      return { ...state, timer: { ...state.timer, running: false } };

    case 'RESUME_TIMER':
      return { ...state, timer: { ...state.timer, running: true } };

    case 'RESET_TIMER':
      return {
        ...state,
        timer: { ...state.timer, running: false, active: false, phase: 'work', left: state.timer.work },
      };

    case 'SET_SESSION_MODE':
      return { ...state, sessionMode: action.payload };

    case 'SET_TIMER_MINS':
      return { ...state, timerMins: action.payload };

    case 'SET_POMO_WORK':
      return { ...state, pomoWork: action.payload };

    case 'SET_POMO_BREAK':
      return { ...state, pomoBreak: action.payload };

    case 'SET_SESSION_BOX':
      return { ...state, sessionBox: action.payload };

    case 'TOGGLE_SESSION_POPUP':
      return { ...state, showSessionPopup: !state.showSessionPopup };

    case 'TOGGLE_COLLECTION':
      return { ...state, showCollection: !state.showCollection };

    case 'TOGGLE_BLINDBOX':
      return { ...state, showBlindbox: !state.showBlindbox };

    case 'SET_MODAL':
      return { ...state, [action.payload.key]: action.payload.value };

    case 'SET_ADD_TASK_MODAL':
      return {
        ...state,
        showAddTask: action.payload.visible,
        addTarget: action.payload.target || state.addTarget,
        newTaskTitle: action.payload.visible ? '' : state.newTaskTitle,
        newTaskDesc: action.payload.visible ? '' : state.newTaskDesc,
      };

    case 'UPDATE_NEW_TASK':
      return {
        ...state,
        newTaskTitle: action.payload.title !== undefined ? action.payload.title : state.newTaskTitle,
        newTaskDesc: action.payload.desc !== undefined ? action.payload.desc : state.newTaskDesc,
      };

    case 'TOGGLE_FIGURE_DETAIL':
      return {
        ...state,
        selectedFigureId: action.payload || null,
        showFigureDetail: !!action.payload,
      };

    case 'COMPLETE_WORK_PHASE':
      return {
        ...state,
        pending: [...state.pending, state.timer.box],
        showSessionComplete: true,
        completeKind: action.payload.kind,
        timer: { ...state.timer, running: false, active: false },
      };

    case 'COMPLETE_BREAK_PHASE':
      return {
        ...state,
        showSessionComplete: true,
        completeKind: 'pomo-break',
        timer: { ...state.timer, running: false, active: false },
      };

    case 'OPEN_BLINDBOX':
      return {
        ...state,
        showBlindbox: true,
        bbPhase: state.pending.length > 0 ? 'ready' : 'empty',
        bbBox: state.pending.length > 0 ? state.pending[0] : 0,
        bbFigure: null,
      };

    case 'ADD_FIGURE_TO_COLLECTION':
      return {
        ...state,
        collection: {
          ...state.collection,
          [action.payload.id]: (state.collection[action.payload.id] || 0) + 1,
        },
      };

    case 'TOGGLE_SHELF':
      return {
        ...state,
        displayed: state.displayed.includes(action.payload)
          ? state.displayed.filter(id => id !== action.payload)
          : [...state.displayed, action.payload],
      };

    case 'REORDER_SHELF':
      return { ...state, displayed: action.payload };

    case 'MARK_JUST_DONE':
      return { ...state, justDone: action.payload };

    case 'BLIND_BOX_SHAKE':
      return {
        ...state,
        bbPhase: 'shake',
      };

    case 'BLIND_BOX_REVEAL':
      return {
        ...state,
        bbPhase: 'reveal',
        bbFigure: action.payload,
        collection: {
          ...state.collection,
          [action.payload.id]: (state.collection[action.payload.id] || 0) + 1,
        },
      };

    case 'BLIND_BOX_NEXT':
      if (state.pending.length > 1) {
        return {
          ...state,
          pending: state.pending.slice(1),
          bbPhase: 'ready',
          bbFigure: null,
          bbBox: state.pending[1],
        };
      } else {
        return {
          ...state,
          showBlindbox: false,
          pending: state.pending.slice(1),
        };
      }

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = storage.getState();
  const [state, dispatch] = useReducer(appReducer, { ...initialState, ...saved });

  // Persist state changes
  React.useEffect(() => {
    storage.setState(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useAppActions() {
  const { dispatch, state } = useAppState();

  return {
    addTask: (task: Task) => dispatch({ type: 'ADD_TASK', payload: task }),
    deleteTask: (id: number) => dispatch({ type: 'DELETE_TASK', payload: id }),
    moveTask: (id: number, status: TaskStatus) =>
      dispatch({ type: 'MOVE_TASK', payload: { id, status } }),
    openAddTask: (target: TaskStatus) =>
      dispatch({ type: 'SET_ADD_TASK_MODAL', payload: { visible: true, target } }),
    closeAddTask: () =>
      dispatch({ type: 'SET_ADD_TASK_MODAL', payload: { visible: false } }),
    updateNewTask: (title?: string, desc?: string) =>
      dispatch({ type: 'UPDATE_NEW_TASK', payload: { title, desc } }),
    tickTimer: () => dispatch({ type: 'TICK_TIMER' }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resumeTimer: () => dispatch({ type: 'RESUME_TIMER' }),
    toggleTimer: () => {
      if (state.timer.active) {
        if (state.timer.running) {
          dispatch({ type: 'PAUSE_TIMER' });
        } else {
          dispatch({ type: 'RESUME_TIMER' });
        }
      } else {
        dispatch({ type: 'TOGGLE_SESSION_POPUP' });
      }
    },
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    setSessionMode: (mode: SessionMode) =>
      dispatch({ type: 'SET_SESSION_MODE', payload: mode }),
    setTimerMins: (mins: number) =>
      dispatch({ type: 'SET_TIMER_MINS', payload: mins }),
    setPomoWork: (mins: number) =>
      dispatch({ type: 'SET_POMO_WORK', payload: mins }),
    setPomoBreak: (mins: number) =>
      dispatch({ type: 'SET_POMO_BREAK', payload: mins }),
    setSessionBox: (idx: number) =>
      dispatch({ type: 'SET_SESSION_BOX', payload: idx }),
    toggleSessionPopup: () => dispatch({ type: 'TOGGLE_SESSION_POPUP' }),
    toggleCollection: () => dispatch({ type: 'TOGGLE_COLLECTION' }),
    toggleBlindbox: () => dispatch({ type: 'TOGGLE_BLINDBOX' }),
    toggleFigureDetail: (id?: string) =>
      dispatch({ type: 'TOGGLE_FIGURE_DETAIL', payload: id }),
    completeWorkPhase: (kind: 'timer-work' | 'pomo-work') =>
      dispatch({ type: 'COMPLETE_WORK_PHASE', payload: { kind } }),
    completeBreakPhase: () => dispatch({ type: 'COMPLETE_BREAK_PHASE' }),
    openBlindbox: () => dispatch({ type: 'OPEN_BLINDBOX', payload: 0 }),
    addFigureToCollection: (figure: Figure) =>
      dispatch({ type: 'ADD_FIGURE_TO_COLLECTION', payload: figure }),
    toggleShelf: (id: string) =>
      dispatch({ type: 'TOGGLE_SHELF', payload: id }),
    reorderShelf: (ids: string[]) =>
      dispatch({ type: 'REORDER_SHELF', payload: ids }),
    markJustDone: (id: number | null) =>
      dispatch({ type: 'MARK_JUST_DONE', payload: id }),
    startWork: () => {
      const t = state.timer;
      dispatch({
        type: 'SET_TIMER',
        payload: {
          mode: 'pomodoro',
          phase: 'work',
          total: t.work,
          left: t.work,
          running: true,
          active: true,
        },
      });
    },
    startSession: () => {
      if (state.sessionMode === 'timer') {
        const secs = state.timerMins * 60;
        dispatch({
          type: 'SET_TIMER',
          payload: {
            mode: 'timer',
            phase: 'work',
            total: secs,
            left: secs,
            running: true,
            active: true,
            work: secs,
            brk: 0,
            box: state.sessionBox,
          },
        });
      } else {
        const workSecs = state.pomoWork * 60;
        dispatch({
          type: 'SET_TIMER',
          payload: {
            mode: 'pomodoro',
            phase: 'work',
            total: workSecs,
            left: workSecs,
            running: true,
            active: true,
            work: workSecs,
            brk: state.pomoBreak * 60,
            box: state.sessionBox,
          },
        });
      }
      dispatch({ type: 'TOGGLE_SESSION_POPUP' });
    },
    peekSession: () => {
      const workSecs = 10;
      const breakSecs = state.sessionMode === 'pomodoro' ? state.pomoBreak * 60 : 0;
      dispatch({
        type: 'SET_TIMER',
        payload: {
          mode: state.sessionMode,
          phase: 'work',
          total: workSecs,
          left: workSecs,
          running: true,
          active: true,
          work: workSecs,
          brk: breakSecs,
          box: state.sessionBox,
        },
      });
      dispatch({ type: 'TOGGLE_SESSION_POPUP' });
    },
    reorderTasks: (tasks: Task[]) => dispatch({ type: 'REORDER_TASKS', payload: tasks }),
    closeComplete: () => dispatch({ type: 'SET_MODAL', payload: { key: 'showSessionComplete', value: false } }),
    blindBoxShake: () => dispatch({ type: 'BLIND_BOX_SHAKE' }),
    blindBoxReveal: (figure: Figure) => dispatch({ type: 'BLIND_BOX_REVEAL', payload: figure }),
    blindBoxNext: () => dispatch({ type: 'BLIND_BOX_NEXT' }),
  };
}
