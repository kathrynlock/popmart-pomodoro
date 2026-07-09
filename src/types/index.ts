export type TaskStatus = 'backlog' | 'progress' | 'done';
export type Rarity = 'common' | 'rare' | 'secret';
export type SessionMode = 'timer' | 'pomodoro';
export type SessionPhase = 'work' | 'break';
export type BlindBoxPhase = 'ready' | 'shake' | 'reveal' | 'empty';

export interface Task {
  id: number;
  title: string;
  desc: string;
  status: TaskStatus;
}

export interface Figure {
  id: string;
  name: string;
  rarity: Rarity;
  img: string;
  color: string;
  weight: number; // for randomization
}

export interface FigureSet {
  id: string;
  name: string;
  series: string;
  active: boolean;
  figures: Figure[];
}

export interface BlindBox {
  id: number;
  color: string;
  name: string;
}

export interface Session {
  mode: SessionMode;
  phase: SessionPhase;
  work: number; // seconds
  brk: number; // seconds
  total: number; // seconds
  left: number; // seconds
  running: boolean;
  active: boolean;
  box: number; // index into BOX array
}

export interface AppState {
  tasks: Task[];
  collection: Record<string, number>; // figureId -> count
  displayed: string[]; // figured ids on shelf
  selectedFigureId: string | null;
  draggingId: string | null;
  pending: number[]; // blind box indices to open
  timer: Session;
  sessionMode: SessionMode;
  timerMins: number;
  pomoWork: number;
  pomoBreak: number;
  sessionBox: number;
  justDone: number | null; // task id
  showSessionPopup: boolean;
  showSessionComplete: boolean;
  showCollection: boolean;
  showAddTask: boolean;
  showBlindbox: boolean;
  showFigureDetail: boolean;
  addTarget: TaskStatus;
  newTaskTitle: string;
  newTaskDesc: string;
  bbPhase: BlindBoxPhase;
  bbFigure: Figure | null;
  bbBox: number;
  completeKind: 'timer-work' | 'pomo-work' | 'pomo-break' | null;
}
