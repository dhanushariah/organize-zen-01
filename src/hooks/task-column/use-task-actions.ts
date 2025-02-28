
import { Task } from "@/types/task";
import { formatDuration } from "date-fns";

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

  // Calculate and format time duration
  const formatTimeDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  };

  // Toggle task timer
  const toggleTaskTimer = (taskId: string) => {
    const now = new Date();
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isStarting = !task.timerRunning;
        
        let elapsedTime = task.duration || 0;
        
        // If stopping the timer, calculate time elapsed since it started
        if (!isStarting && task.startTime) {
          const elapsedSeconds = Math.floor((now.getTime() - new Date(task.startTime).getTime()) / 1000);
          elapsedTime += elapsedSeconds;
        }
        
        const updatedTask = {
          ...task,
          timerRunning: isStarting,
          startTime: isStarting ? now : task.startTime,
          duration: elapsedTime,
          timerDisplay: isStarting ? formatTimeDuration(elapsedTime) : undefined
        };
        
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // If any timer is running, set up interval to update the display
    if (updatedTasks.some(task => task.timerRunning)) {
      setupTimerInterval(updatedTasks, setTasks);
    }
  };

  // Set up timer interval to update running timers
  const setupTimerInterval = (currentTasks: Task[], setTasksFunction: React.Dispatch<React.SetStateAction<Task[]>>) => {
    // Clear any existing interval
    if (window.timerInterval) {
      clearInterval(window.timerInterval);
    }
    
    // Set up new interval if any timer is running
    if (currentTasks.some(task => task.timerRunning)) {
      window.timerInterval = setInterval(() => {
        setTasksFunction(prevTasks => 
          prevTasks.map(task => {
            if (task.timerRunning && task.startTime) {
              const startTime = new Date(task.startTime);
              const now = new Date();
              const baseDuration = task.duration || 0;
              const runningSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
              const totalSeconds = baseDuration + runningSeconds;
              
              return {
                ...task,
                timerDisplay: formatTimeDuration(totalSeconds)
              };
            }
            return task;
          })
        );
      }, 1000);
    }
  };

  return {
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer
  };
}

// Add the timerInterval property to the Window interface
declare global {
  interface Window {
    timerInterval: number | undefined;
  }
}
