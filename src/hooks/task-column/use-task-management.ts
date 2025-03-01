
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/types/task";

interface UseTaskManagementProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: string[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  columnId: string;
  onTaskUpdate?: (task: Task) => void;
}

export function useTaskManagement({
  tasks,
  setTasks,
  completedTasks,
  setCompletedTasks,
  columnId,
  onTaskUpdate
}: UseTaskManagementProps) {
  // Add a new task
  const handleAddTask = (title: string, columnId: string) => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      title,
      timerRunning: false,
      columnId, // Store columnId with the task
      completed: false // Initialize as not completed
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
        const updatedTask = { 
          ...task, 
          title: newTitle,
          columnId // Ensure columnId is preserved when updating
        };
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
    // Toggle in the completed tasks array
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
    
    // Also update the task's completed property for persistence
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          completed: !completedTasks.includes(taskId)
        };
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
    toggleTask
  };
}
