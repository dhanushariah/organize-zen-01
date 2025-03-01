
export interface Task {
  id: string;
  title: string;
  timerRunning?: boolean;
  timerStart?: Date;
  timerElapsed?: number;
  timerDisplay?: string;
  deleted?: boolean;
  columnId?: string; // Added to track which column a task belongs to
  tag?: string; // Added for tagging tasks
  completed?: boolean; // Added to track completion status
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
    tag: string | null;
    completed: boolean;
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
