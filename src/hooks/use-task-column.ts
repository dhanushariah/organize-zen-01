
import { useRef } from "react";
import { Task } from "@/types/task";
import { useTaskState } from "./task-column/use-task-state";
import { useTaskActions } from "./task-column/use-task-actions";
import { useTagManagement } from "./task-column/use-tag-management";
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
    draggedTask,
    setDraggedTask,
    sortBy,
    setSortBy,
    sortedTasks
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

  // Get tag management handlers
  const {
    handleUpdateTag,
    handleUpdateTagColor,
    handleAddNewTag,
    handleDeleteTag
  } = useTagManagement({
    tasks,
    setTasks,
    availableTags,
    setAvailableTags,
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

  // Close tag editor
  const closeTagEditor = () => {
    setEditingTag(null);
    setShowColorPicker(null);
    setAddingNewTag(false);
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
    draggedTask,
    setDraggedTask,
    sortBy,
    setSortBy,
    
    // Task Actions
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleUpdateTag,
    handleUpdateTagColor,
    handleDeleteTask,
    handleAddNewTag,
    handleDeleteTag,
    
    // Drag and Drop
    handleDragStart,
    handleDragEnd,
    closeTagEditor,
    handleMoveTaskToColumn,
    toggleTaskTimer,
    
    // Derived State
    sortedTasks
  };
}
