
import { useState, useEffect, useRef } from "react";
import { Task } from "@/types/task";

// Define default tags
const DEFAULT_TAGS = ["work", "personal", "home", "study", "health"];

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
  // State for tasks and UI
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(DEFAULT_TAGS);
  const [newTagName, setNewTagName] = useState("");
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
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

  // Handle drag and drop functionality
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (columnRef.current) {
        columnRef.current.classList.add('task-drop-target');
      }
    };

    const handleDragLeave = () => {
      if (columnRef.current) {
        columnRef.current.classList.remove('task-drop-target');
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (columnRef.current) {
        columnRef.current.classList.remove('task-drop-target');
      }

      const taskId = e.dataTransfer?.getData('text/plain');
      const sourceColumn = e.dataTransfer?.getData('source-column');
      
      if (taskId && sourceColumn && sourceColumn !== columnId && onMoveTask) {
        onMoveTask(taskId, sourceColumn, columnId);
      }
    };

    const column = columnRef.current;
    if (column) {
      column.addEventListener('dragover', handleDragOver);
      column.addEventListener('dragleave', handleDragLeave);
      column.addEventListener('drop', handleDrop);

      return () => {
        column.removeEventListener('dragover', handleDragOver);
        column.removeEventListener('dragleave', handleDragLeave);
        column.removeEventListener('drop', handleDrop);
      };
    }
  }, [columnId, onMoveTask, columnRef]);

  // Update tasks when initialTasks changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !completedTasks.includes(taskId);
        const updatedTask = {
          ...task,
          endTime: isCompleting ? new Date() : undefined,
          timerRunning: isCompleting ? false : task.timerRunning
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

  // Add a new task
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `${Date.now()}`,
        title: newTaskTitle,
        tag: "personal"
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTaskTitle("");
      
      if (onTaskUpdate) {
        onTaskUpdate(newTask);
      }
    }
  };

  // Update task title
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
    setEditingTask(null);
  };

  // Update task tag
  const handleUpdateTag = (taskId: string, newTag: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, tag: newTag };
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setEditingTag(null);
    setShowColorPicker(null);
  };

  // Update tag color
  const handleUpdateTagColor = (taskId: string, color: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, tagColor: color };
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
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
    
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete && onTaskUpdate) {
      onTaskUpdate({...taskToDelete, deleted: true});
    }
  };

  // Add a new tag
  const handleAddNewTag = () => {
    if (newTagName.trim() && !availableTags.includes(newTagName.toLowerCase())) {
      setAvailableTags([...availableTags, newTagName.toLowerCase()]);
      setNewTagName("");
      setAddingNewTag(false);
    }
  };

  // Delete a tag
  const handleDeleteTag = (tagToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setAvailableTags(availableTags.filter(tag => tag !== tagToDelete));
    
    const updatedTasks = tasks.map(task => {
      if (task.tag === tagToDelete) {
        const updatedTask = { ...task, tag: "personal" };
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.setData('source-column', columnId);
    setDraggedTask(taskId);
    
    setTimeout(() => {
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.classList.add('task-dragging');
      }
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = (taskId: string) => {
    setDraggedTask(null);
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.classList.remove('task-dragging');
    }
  };

  // Close tag editor
  const closeTagEditor = () => {
    setEditingTag(null);
    setShowColorPicker(null);
    setAddingNewTag(false);
  };

  // Move task to a different column
  const handleMoveTaskToColumn = (taskId: string, targetColumnId: string) => {
    if (onMoveTask) {
      onMoveTask(taskId, columnId, targetColumnId);
    }
  };

  // Toggle task timer
  const toggleTaskTimer = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const now = new Date();
        const isStarting = !task.timerRunning;
        
        const updatedTask = {
          ...task,
          timerRunning: isStarting,
          startTime: isStarting ? now : task.startTime,
          duration: task.duration || 0
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

  // Sort tasks based on tag
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === null) return 0;
    if (sortBy === a.tag) return -1;
    if (sortBy === b.tag) return 1;
    return 0;
  });

  return {
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
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleUpdateTag,
    handleUpdateTagColor,
    handleDeleteTask,
    handleAddNewTag,
    handleDeleteTag,
    handleDragStart,
    handleDragEnd,
    closeTagEditor,
    handleMoveTaskToColumn,
    toggleTaskTimer,
    sortedTasks
  };
}
