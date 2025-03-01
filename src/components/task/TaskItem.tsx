
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/task";
import { TaskContent } from "./TaskContent";
import { TaskActions } from "./TaskActions";
import { useTagsManager } from "@/hooks/use-tags-manager";

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
      className={`task-card p-3 md:p-4 cursor-move ${task.tag && tagColors[task.tag] ? `tag-${tagColors[task.tag]} tag-border` : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      id={`task-${task.id}`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <Checkbox
          id={task.id}
          checked={isCompleted}
          onCheckedChange={onToggle}
          className="mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground checkbox-item"
        />
        
        <div className="flex flex-1 items-start justify-between">
          <TaskContent
            taskId={task.id}
            title={task.title}
            isCompleted={isCompleted}
            editingTask={editingTask}
            timerRunning={task.timerRunning}
            timerDisplay={task.timerDisplay}
            tag={task.tag}
            tagColors={tagColors}
            onToggleTimer={onToggleTimer}
            onUpdate={onUpdate}
            setEditingTask={setEditingTask}
          />
          
          <TaskActions
            taskId={task.id}
            tag={task.tag}
            timerRunning={task.timerRunning}
            availableTags={availableTags}
            tagColors={tagColors}
            onToggleTimer={onToggleTimer}
            onDelete={onDelete}
            onUpdateTag={onUpdateTag}
          />
        </div>
      </div>
    </Card>
  );
};
