
export interface Task {
  id: string;
  title: string;
  tag: string;
  tagColor?: string;
  startTime?: Date;
  endTime?: Date;
  timerRunning?: boolean;
  duration?: number; // duration in seconds
  deleted?: boolean;
}
