
import { useRef } from "react";
import { Task } from "@/types/task";
import { useTaskState } from "./task-column/use-task-state";
import { useTaskActions } from "./task-column/use-task-actions";
import { useDragDrop } from "./task-column/use-drag-drop";

interface UseTaskColumnProps {
  initialTasks: Task[];
  columnId: string;
  onMoveTask?: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  onTaskUpdate?: (task: Task) => void;
}

export function useTaskColumn({
  initialTasks,
  columnId,
  onMoveTask,
  onTaskUpdate
}: UseTaskColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  
  // Get all state from the useTaskState hook
  const {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    progress,
    newTaskTitle,
    setNewTaskTitle,
    editingTask,
    setEditingTask,
    draggedTask,
    setDraggedTask
  } = useTaskState(initialTasks);

  // Get task action handlers
  const {
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer
  } = useTaskActions({
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    onTaskUpdate
  });

  // Get drag and drop handlers
  const {
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  } = useDragDrop({
    columnId,
    columnRef,
    onMoveTask
  });

  return {
    // Refs
    columnRef,
    
    // State
    tasks,
    setTasks,
    completedTasks,
    progress,
    newTaskTitle,
    setNewTaskTitle,
    editingTask,
    setEditingTask,
    draggedTask,
    setDraggedTask,
    
    // Task Actions
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer,
    
    // Drag and Drop
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  };
}
