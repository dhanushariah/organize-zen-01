
import { useState, useEffect } from "react";
import { Task } from "@/types/task";

export function useTaskState(initialTasks: Task[]) {
  // Core task state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Task editing state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Calculate progress based on completed tasks
  useEffect(() => {
    if (tasks.length > 0) {
      const newProgress = (completedTasks.length / tasks.length) * 100;
      setProgress(newProgress);
    } else {
      setProgress(0);
    }
  }, [completedTasks, tasks]);

  // Update tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return {
    // Task state
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    progress,
    
    // UI state
    newTaskTitle,
    setNewTaskTitle,
    editingTask,
    setEditingTask,
    
    // Drag and drop state
    draggedTask,
    setDraggedTask
  };
}
