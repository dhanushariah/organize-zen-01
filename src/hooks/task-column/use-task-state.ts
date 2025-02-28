
import { useState, useEffect } from "react";
import { Task } from "@/types/task";

// Define default tags
export const DEFAULT_TAGS = ["work", "personal", "home", "study", "health"];

export function useTaskState(initialTasks: Task[]) {
  // Core task state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Task editing state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  // Tag management state
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(DEFAULT_TAGS);
  const [newTagName, setNewTagName] = useState("");
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string | null>(null);

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

  // Sort tasks based on tag
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === null) return 0;
    if (sortBy === a.tag) return -1;
    if (sortBy === b.tag) return 1;
    return 0;
  });

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
    editingTag,
    setEditingTag,
    availableTags,
    setAvailableTags,
    newTagName,
    setNewTagName,
    addingNewTag,
    setAddingNewTag,
    showColorPicker,
    setShowColorPicker,
    
    // Drag and drop state
    draggedTask,
    setDraggedTask,
    
    // Sorting
    sortBy,
    setSortBy,
    sortedTasks
  };
}
