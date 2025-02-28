
export interface Task {
  id: string;
  title: string;
  timerRunning?: boolean;
  timerStart?: Date;
  timerElapsed?: number;
  timerDisplay?: string;
  deleted?: boolean;
}
