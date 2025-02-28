
import { useState } from "react";
import { Edit, X, Clock, ArrowRightLeft, Check, Trash2, Palette, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { TagEditor } from "./TagEditor";

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  editingTask: boolean;
  editingTag: boolean;
  showColorPicker: boolean;
  isDragging: boolean;
  onToggle: () => void;
  onUpdate: (newTitle: string) => void;
  onUpdateTag: (newTag: string) => void;
  onUpdateTagColor: (color: string) => void;
  onDelete: () => void;
  onTagDelete: (tag: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMoveToColumn: (targetColumnId: string) => void;
  onToggleTimer: () => void;
  setEditingTask: (taskId: string | null) => void;
  setEditingTag: (taskId: string | null) => void;
  setShowColorPicker: (taskId: string | null) => void;
  closeTagEditor: () => void;
  otherColumns?: { id: string, title: string }[];
  availableTags: string[];
}

export const TaskItem = ({
  task,
  isCompleted,
  editingTask,
  editingTag,
  showColorPicker,
  isDragging,
  onToggle,
  onUpdate,
  onUpdateTag,
  onUpdateTagColor,
  onDelete,
  onTagDelete,
  onDragStart,
  onDragEnd,
  onMoveToColumn,
  onToggleTimer,
  setEditingTask,
  setEditingTag,
  setShowColorPicker,
  closeTagEditor,
  otherColumns = [],
  availableTags
}: TaskItemProps) => {
  return (
    <Card 
      className="task-card p-3 md:p-4 cursor-move"
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
          className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="flex flex-1 items-start justify-between">
          {editingTask ? (
            <Input
              defaultValue={task.title}
              onBlur={(e) => onUpdate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdate(e.currentTarget.value);
                }
              }}
              autoFocus
              className="text-sm md:text-base"
            />
          ) : (
            <div className="flex-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor={task.id}
                  className={`font-medium cursor-pointer text-sm md:text-base ${
                    isCompleted ? "line-through text-muted-foreground" : ""
                  }`}
                  onClick={() => setEditingTask(task.id)}
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onToggleTimer}
                  >
                    <Clock className={`h-3 w-3 ${task.timerRunning ? 'text-primary animate-pulse' : ''}`} />
                  </Button>
                  
                  {otherColumns && otherColumns.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                        >
                          <ArrowRightLeft className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {otherColumns.map(column => (
                          <DropdownMenuItem 
                            key={column.id}
                            onClick={() => onMoveToColumn(column.id)}
                          >
                            Move to {column.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {editingTag ? (
                  <TagEditor
                    taskId={task.id}
                    availableTags={availableTags}
                    onUpdateTag={onUpdateTag}
                    onUpdateTagColor={onUpdateTagColor}
                    onTagDelete={onTagDelete}
                    showColorPicker={showColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    closeTagEditor={closeTagEditor}
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <span 
                      className={`tag ${task.tagColor ? `tag-${task.tagColor}` : `tag-${task.tag}`} cursor-pointer flex items-center`}
                      onClick={() => setEditingTag(task.id)}
                    >
                      {task.tag}
                      <Edit className="ml-1 h-3 w-3" />
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDelete}
                      className="h-6 w-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
