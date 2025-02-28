
import { Task } from "@/types/task";

interface TaskActionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  completedTasks: string[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  onTaskUpdate?: (task: Task) => void;
}

export function useTaskActions({
  tasks,
  setTasks,
  completedTasks,
  setCompletedTasks,
  onTaskUpdate
}: TaskActionsProps) {
  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !completedTasks.includes(taskId);
        const updatedTask = {
          ...task,
          endTime: isCompleting ? new Date() : undefined,
          timerRunning: isCompleting ? false : task.timerRunning
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

  // Add a new task
  const handleAddTask = (newTaskTitle: string) => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `${Date.now()}`,
        title: newTaskTitle,
        tag: "personal"
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      
      if (onTaskUpdate) {
        onTaskUpdate(newTask);
      }
    }
  };

  // Update task title
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
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
    
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete && onTaskUpdate) {
      onTaskUpdate({...taskToDelete, deleted: true});
    }
  };

  // Toggle task timer
  const toggleTaskTimer = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const now = new Date();
        const isStarting = !task.timerRunning;
        
        const updatedTask = {
          ...task,
          timerRunning: isStarting,
          startTime: isStarting ? now : task.startTime,
          duration: task.duration || 0
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
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer
  };
}
