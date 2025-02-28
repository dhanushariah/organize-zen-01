
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
  // Add a new task
  const handleAddTask = (title: string) => {
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
  };

  // Toggle task completion status
  const toggleTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
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

  // Update timers every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      
      const updatedTasks = tasks.map(task => {
        if (task.timerRunning && task.timerStart) {
          const startTime = task.timerStart;
          const elapsed = (task.timerElapsed || 0) + (now.getTime() - startTime.getTime());
          
          return {
            ...task,
            timerStart: now,
            timerElapsed: task.timerElapsed,
            timerDisplay: formatTimerDisplay(elapsed)
          };
        }
        return task;
      });
      
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        setTasks(updatedTasks);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [tasks, setTasks]);

  return {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTask,
    toggleTaskTimer
  };
}
