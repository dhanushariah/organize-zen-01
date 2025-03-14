
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/task";
import { TaskContent } from "./TaskContent";
import { TaskActions } from "./TaskActions";
import { useTagsManager } from "@/hooks/use-tags-manager";
import { TaskTimer } from "./TaskTimer";
import { Badge } from "@/components/ui/badge";

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  editingTask: boolean;
  isDragging: boolean;
  onToggle: () => void;
  onUpdate: (newTitle: string) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveToColumn: (targetColumnId: string) => void;
  onToggleTimer: () => void;
  onUpdateTag?: (tag: string) => void;
  setEditingTask: (taskId: string | null) => void;
  otherColumns?: { id: string, title: string }[];
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isCompleted,
  editingTask,
  isDragging,
  onToggle,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  onMoveToColumn,
  onToggleTimer,
  onUpdateTag,
  setEditingTask,
  otherColumns = []
}) => {
  const { availableTags, tagColors } = useTagsManager();
  
  return (
    <Card 
      className={`task-card p-3 md:p-4 cursor-move border shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      id={`task-${task.id}`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        {/* Timer button before checkbox */}
        <div className="mt-0.5">
          <TaskTimer 
            timerRunning={task.timerRunning} 
            timerDisplay={task.timerDisplay}
            onToggleTimer={onToggleTimer}
          />
        </div>

        <Checkbox
          id={task.id}
          checked={isCompleted}
          onCheckedChange={onToggle}
          className="mt-0.5 border-primary data-[state=checked]:bg-[hsl(var(--checkbox-check))] data-[state=checked]:text-primary-foreground checkbox-item"
        />
        
        <div className="flex flex-1 items-start justify-between">
          <TaskContent
            taskId={task.id}
            title={task.title}
            isCompleted={isCompleted}
            editingTask={editingTask}
            tag={task.tag}
            tagColors={tagColors}
            onUpdate={onUpdate}
            setEditingTask={setEditingTask}
          />
          
          <TaskActions
            taskId={task.id}
            tag={task.tag}
            availableTags={availableTags}
            tagColors={tagColors}
            onDelete={onDelete}
            onUpdateTag={onUpdateTag}
          />
        </div>
      </div>
    </Card>
  );
};
