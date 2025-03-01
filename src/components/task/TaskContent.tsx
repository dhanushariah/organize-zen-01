
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TaskTimer } from "./TaskTimer";

interface TaskContentProps {
  taskId: string;
  title: string;
  isCompleted: boolean;
  editingTask: boolean;
  timerRunning?: boolean;
  timerDisplay?: string;
  tag?: string;
  tagColors: Record<string, string>;
  onToggleTimer: () => void;
  onUpdate: (newTitle: string) => void;
  setEditingTask: (taskId: string | null) => void;
}

export const TaskContent: React.FC<TaskContentProps> = ({
  taskId,
  title,
  isCompleted,
  editingTask,
  timerRunning,
  timerDisplay,
  tag,
  tagColors,
  onToggleTimer,
  onUpdate,
  setEditingTask
}) => {
  if (editingTask) {
    return (
      <Input
        defaultValue={title}
        onBlur={(e) => onUpdate(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onUpdate(e.currentTarget.value);
          }
        }}
        autoFocus
        className="text-sm md:text-base"
      />
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <label
          htmlFor={taskId}
          className={`font-medium cursor-pointer text-sm md:text-base ${
            isCompleted ? "line-through text-muted-foreground" : ""
          }`}
          onClick={() => setEditingTask(taskId)}
        >
          {title}
        </label>
        {timerDisplay && <TaskTimer timerRunning={timerRunning} timerDisplay={timerDisplay} onToggleTimer={onToggleTimer} />}
      </div>
      
      {tag && (
        <Badge 
          variant="outline" 
          className={`text-xs w-fit ${tagColors[tag] ? `tag-badge tag-${tagColors[tag]}` : ''}`}
        >
          {tag}
        </Badge>
      )}
    </div>
  );
};
