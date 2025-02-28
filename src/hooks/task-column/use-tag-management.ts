
import { Task } from "@/types/task";

interface TagManagementProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  availableTags: string[];
  setAvailableTags: React.Dispatch<React.SetStateAction<string[]>>;
  onTaskUpdate?: (task: Task) => void;
}

export function useTagManagement({
  tasks,
  setTasks,
  availableTags,
  setAvailableTags,
  onTaskUpdate
}: TagManagementProps) {
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

  // Add a new tag
  const handleAddNewTag = (newTagName: string) => {
    if (newTagName.trim() && !availableTags.includes(newTagName.toLowerCase())) {
      setAvailableTags([...availableTags, newTagName.toLowerCase()]);
      return true;
    }
    return false;
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

  return {
    handleUpdateTag,
    handleUpdateTagColor,
    handleAddNewTag,
    handleDeleteTag
  };
}
