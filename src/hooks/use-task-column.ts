
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
  columnRef: React.RefObject<HTMLDivElement>;
}

export function useTaskColumnLogic({
  initialTasks,
  columnId,
  onMoveTask,
  onTaskUpdate,
  columnRef
}: UseTaskColumnProps) {
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
    handleAddTask: addTask,
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

  // Wrapper for addTask to use the current newTaskTitle
  const handleAddTask = () => {
    addTask(newTaskTitle);
    setNewTaskTitle("");
  };

  return {
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
    
    // Drag and Drop
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn,
    toggleTaskTimer
  };
}
