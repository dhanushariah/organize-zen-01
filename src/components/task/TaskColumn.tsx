
import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { useTaskColumnLogic } from "@/hooks/use-task-column";

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
  
  const {
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
    handleDeleteTag,
    handleDragStart,
    handleDragEnd,
    closeTagEditor,
    handleMoveTaskToColumn,
    toggleTaskTimer,
    sortedTasks
  } = useTaskColumnLogic({
    initialTasks,
    columnId,
    onMoveTask,
    onTaskUpdate,
    columnRef
  });

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
            <DropdownMenuContent>
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
              <flag className="h-5 w-5 text-primary mr-1" />
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
