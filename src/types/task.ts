
export interface Task {
  id: string;
  title: string;
  timerRunning?: boolean;
  timerStart?: Date;
  timerElapsed?: number;
  timerDisplay?: string;
  deleted?: boolean;
}

// Add database table types for Supabase
export type Tables = {
  tasks: {
    id: string;
    user_id: string;
    title: string;
    column_id: string;
    timer_elapsed: number;
    timer_running: boolean;
    timer_display: string;
    created_at: string;
    updated_at: string;
  };
  task_history: {
    id: string;
    user_id: string;
    date: string;
    tasks: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
  profiles: {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    updated_at: string;
  };
};
