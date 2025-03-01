
import { Task } from "@/types/task";
import { useEffect } from "react";

interface UseTaskTimerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskUpdate?: (task: Task) => void;
}

export function useTaskTimer({
  tasks,
  setTasks,
  onTaskUpdate
}: UseTaskTimerProps) {
  // Timer display formatting helper
  const formatTimerDisplay = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Toggle timer for a task
  const toggleTaskTimer = (taskId: string) => {
    const now = new Date();
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        // If task is already completed, don't start the timer
        if (task.completed) {
          return task;
        }
        
        // Calculate elapsed time
        const startTime = task.timerRunning ? undefined : now;
        const elapsed = task.timerElapsed || 0;
        
        // Toggle timer state
        const timerRunning = !task.timerRunning;
        
        // Calculate new elapsed time if stopping timer
        const newElapsed = !timerRunning 
          ? elapsed + (task.timerStart ? (now.getTime() - task.timerStart.getTime()) : 0)
          : elapsed;
        
        const updatedTask = {
          ...task,
          timerRunning,
          timerStart: startTime,
          timerElapsed: newElapsed,
          timerDisplay: formatTimerDisplay(newElapsed)
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

  // Update timers every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      let tasksChanged = false;
      
      const updatedTasks = tasks.map(task => {
        if (task.timerRunning && task.timerStart) {
          const startTime = task.timerStart;
          const baseElapsed = task.timerElapsed || 0;
          const currentElapsed = now.getTime() - startTime.getTime();
          const totalElapsed = baseElapsed + currentElapsed;
          
          const updatedTask = {
            ...task,
            timerDisplay: formatTimerDisplay(totalElapsed)
          };
          
          // Only update the task in Supabase every 10 seconds to avoid too many requests
          if (Math.floor(totalElapsed / 10000) !== Math.floor((baseElapsed + (currentElapsed - 1000)) / 10000)) {
            if (onTaskUpdate) {
              const persistTask = {
                ...updatedTask,
                timerElapsed: totalElapsed
              };
              onTaskUpdate(persistTask);
            }
          }
          
          tasksChanged = true;
          return updatedTask;
        }
        return task;
      });
      
      if (tasksChanged) {
        setTasks(updatedTasks);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [tasks, setTasks, onTaskUpdate]);

  return {
    toggleTaskTimer,
    formatTimerDisplay
  };
}
