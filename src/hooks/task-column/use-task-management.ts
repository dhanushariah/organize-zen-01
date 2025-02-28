
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/types/task";

interface UseTaskManagementProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: string[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  onTaskUpdate?: (task: Task) => void;
}

export function useTaskManagement({
  tasks,
  setTasks,
  completedTasks,
  setCompletedTasks,
  onTaskUpdate
}: UseTaskManagementProps) {
  // Add a new task
  const handleAddTask = (title: string) => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      title,
      timerRunning: false
    };
    
    setTasks([...tasks, newTask]);
    if (onTaskUpdate) {
      onTaskUpdate(newTask);
    }
  };

  // Update a task
  const handleUpdateTask = (taskId: string, newTitle: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, title: newTitle };
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setCompletedTasks(completedTasks.filter(id => id !== taskId));
    
    if (onTaskUpdate) {
      // Mark for deletion with a special property
      onTaskUpdate({ id: taskId, title: "", deleted: true });
    }
  };

  // Toggle task completion status
  const toggleTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  return {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTask
  };
}
