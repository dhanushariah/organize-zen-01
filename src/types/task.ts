
export interface Task {
  id: string;
  title: string;
  tag?: string;
  tagColor?: string;
  createdAt?: Date;
  endTime?: Date;
  startTime?: Date;
  timerRunning?: boolean;
  duration?: number;
  timerDisplay?: string;
  deleted?: boolean;
}
