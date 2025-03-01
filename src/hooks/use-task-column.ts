
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

export const useTaskColumn = ({
  initialTasks,
  columnId,
  onMoveTask,
  onTaskUpdate
}: UseTaskColumnProps) => {
  // Create a reference for the column element (used for drag and drop)
  const columnRef = useRef<HTMLDivElement>(null);
  
  // Use the task state hook to manage tasks state
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
  
  // Use the task actions hook to handle task operations
  const {
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTask,
    toggleTaskTimer
  } = useTaskActions({
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    columnId,
    onTaskUpdate
  });
  
  // Use the drag drop hook to handle drag and drop operations
  const {
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  } = useDragDrop({
    columnId,
    columnRef,
    onMoveTask,
    draggedTask,
    setDraggedTask
  });
  
  return {
    columnRef,
    tasks,
    completedTasks,
    progress,
    newTaskTitle,
    setNewTaskTitle,
    editingTask,
    setEditingTask,
    draggedTask,
    
    // Task operations
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer,
    
    // Drag and drop operations
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  };
};
