
import { Task } from "@/types/task";
import { useTaskManagement } from "./use-task-management";
import { useTaskTimer } from "./use-task-timer";

interface TaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: string[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  columnId: string;
  onTaskUpdate?: (task: Task) => void;
}

export function useTaskActions({
  tasks,
  setTasks,
  completedTasks,
  setCompletedTasks,
  columnId,
  onTaskUpdate
}: TaskActionsProps) {
  // Use the task management hook
  const {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTask
  } = useTaskManagement({
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    columnId,
    onTaskUpdate
  });

  // Use the task timer hook
  const {
    toggleTaskTimer
  } = useTaskTimer({
    tasks,
    setTasks,
    onTaskUpdate
  });
  
  // Function to update task tag
  const updateTaskTag = (taskId: string, tag: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, tag };
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  return {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTask,
    toggleTaskTimer,
    updateTaskTag
  };
}
