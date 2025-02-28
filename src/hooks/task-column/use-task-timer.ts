
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
    let timerIntervalId: number | null = null;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        // Calculate elapsed time
        const now = new Date();
        const startTime = task.timerRunning ? (task.timerStart || now) : now;
        const elapsed = task.timerElapsed || 0;
        
        // Toggle timer state
        const timerRunning = !task.timerRunning;
        
        const updatedTask = {
          ...task,
          timerRunning,
          timerStart: timerRunning ? now : undefined,
          timerElapsed: timerRunning ? elapsed : elapsed + (task.timerRunning ? (now.getTime() - startTime.getTime()) : 0),
          timerDisplay: formatTimerDisplay(timerRunning ? elapsed : elapsed + (task.timerRunning ? (now.getTime() - startTime.getTime()) : 0))
        };
        
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
  };

  // Update timers every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      
      const updatedTasks = tasks.map(task => {
        if (task.timerRunning && task.timerStart) {
          const startTime = task.timerStart;
          const elapsed = (task.timerElapsed || 0) + (now.getTime() - startTime.getTime());
          
          const updatedTask = {
            ...task,
            timerStart: now,
            timerElapsed: task.timerElapsed,
            timerDisplay: formatTimerDisplay(elapsed)
          };
          
          // Only update the task in Supabase every 10 seconds to avoid too many requests
          if (Math.floor(elapsed / 10000) !== Math.floor((task.timerElapsed || 0) / 10000)) {
            if (onTaskUpdate) {
              onTaskUpdate(updatedTask);
            }
          }
          
          return updatedTask;
        }
        return task;
      });
      
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
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
