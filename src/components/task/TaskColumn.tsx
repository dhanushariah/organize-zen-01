
import { useRef } from "react";
import { Plus, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { useTaskState } from "@/hooks/task-column/use-task-state";
import { useTaskActions } from "@/hooks/task-column/use-task-actions";
import { useTagManagement } from "@/hooks/task-column/use-tag-management";
import { useDragDrop } from "@/hooks/task-column/use-drag-drop";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isLast?: boolean;
  onMoveTask?: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  columnId: string;
  otherColumns?: { id: string, title: string }[];
  onTaskUpdate?: (task: Task) => void;
}

const TaskColumn = ({ 
  title, 
  tasks: initialTasks, 
  isLast, 
  onMoveTask,
  columnId,
  otherColumns = [],
  onTaskUpdate
}: TaskColumnProps) => {
  const isMobile = useIsMobile();
  const columnRef = useRef<HTMLDivElement>(null);
  
  // Use the state hook
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

  // Use the actions hook
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

  // Use the tag management hook
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

  // Use the drag and drop hook
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
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
      setNewTaskTitle("");
    }
  };

  // Close tag editor
  const closeTagEditor = () => {
    setEditingTag(null);
    setShowColorPicker(null);
    setAddingNewTag(false);
  };

  return (
    <div 
      className="flex-1 min-w-[280px] md:min-w-[300px] max-w-md relative"
      ref={columnRef}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {sortBy ? `Sorted: ${sortBy}` : "Sort by Tag"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background border shadow-md">
              <DropdownMenuItem onClick={() => setSortBy(null)}>
                No sorting
              </DropdownMenuItem>
              {availableTags.map(tag => (
                <DropdownMenuItem key={tag} onClick={() => setSortBy(tag)}>
                  {tag}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {progress === 100 && (
            <div className="flex items-center">
              <Flag className="h-5 w-5 text-primary mr-1" />
              <span className="text-sm text-primary font-medium">Complete!</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <Progress 
          value={progress} 
          className={`h-2 rounded-full overflow-hidden ${progress > 0 ? 'progress-bar-glow' : ''}`}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {sortedTasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            isCompleted={completedTasks.includes(task.id)}
            onToggle={() => toggleTask(task.id)}
            onUpdate={(newTitle) => handleUpdateTask(task.id, newTitle)}
            onUpdateTag={(newTag) => handleUpdateTag(task.id, newTag)}
            onUpdateTagColor={(color) => handleUpdateTagColor(task.id, color)}
            onDelete={() => handleDeleteTask(task.id)}
            onTagDelete={handleDeleteTag}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={() => handleDragEnd(task.id)}
            onMoveToColumn={(targetColumnId) => handleMoveTaskToColumn(task.id, targetColumnId)}
            onToggleTimer={() => toggleTaskTimer(task.id)}
            editingTask={editingTask === task.id}
            editingTag={editingTag === task.id}
            showColorPicker={showColorPicker === task.id}
            setEditingTask={setEditingTask}
            setEditingTag={setEditingTag}
            setShowColorPicker={setShowColorPicker}
            closeTagEditor={closeTagEditor}
            otherColumns={otherColumns}
            availableTags={availableTags}
            isDragging={draggedTask === task.id}
          />
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskTitle.trim()) {
                handleAddTask();
              }
            }}
            className="text-sm md:text-base"
          />
          <Button 
            size="icon" 
            onClick={handleAddTask} 
            disabled={!newTaskTitle.trim()}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 h-[70%]">
          <Separator orientation="vertical" className="h-full" />
        </div>
      )}
    </div>
  );
};

export default TaskColumn;
