
import { useRef, useState } from "react";
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
  
  // Add state for selected tag
  const [selectedTag, setSelectedTag] = useState<string>("");
  
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
    toggleTaskTimer,
    updateTaskTag
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
  
  // Modified add task function to include the selected tag
  const handleAddTaskWithTag = () => {
    if (newTaskTitle.trim()) {
      handleAddTask(newTaskTitle, columnId, selectedTag);
      setNewTaskTitle("");
      // Optionally clear the selected tag after adding a task
      // setSelectedTag("");
    }
  };
  
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
    handleAddTask: handleAddTaskWithTag,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer,
    updateTaskTag,
    
    // Tag selection
    selectedTag,
    setSelectedTag,
    
    // Drag and drop operations
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  };
};
