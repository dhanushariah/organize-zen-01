
import { useState } from "react";
import { Edit, X, Check, Trash2, Play, Pause, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/task";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
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

export const TaskItem = ({
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
}: TaskItemProps) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<Record<string, string>>({});
  
  // Load available tags from localStorage
  useState(() => {
    const savedTags = localStorage.getItem('availableTags');
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    } else {
      setAvailableTags(['work', 'personal', 'home', 'study', 'health']);
    }
    
    // Load tag colors
    const savedTagColors = localStorage.getItem('tagColors');
    if (savedTagColors) {
      setTagColors(JSON.parse(savedTagColors));
    }
  });
  
  return (
    <Card 
      className={`task-card p-3 md:p-4 cursor-move ${task.tag && tagColors[task.tag] ? `tag-${tagColors[task.tag]} tag-border` : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      id={`task-${task.id}`}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-primary"
            onClick={onToggleTimer}
            aria-label={task.timerRunning ? "Pause timer" : "Start timer"}
          >
            {task.timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
        
          <Checkbox
            id={task.id}
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="mt-0.5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground checkbox-item"
          />
        </div>
        
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
              <div className="flex flex-col gap-1">
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
                  {task.timerDisplay && (
                    <span className={`text-xs ${task.timerRunning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
                      {task.timerDisplay}
                    </span>
                  )}
                </div>
                
                {task.tag && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs w-fit ${tagColors[task.tag] ? `tag-badge tag-${tagColors[task.tag]}` : ''}`}
                  >
                    {task.tag}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {onUpdateTag && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Select tag</p>
                        <div className="grid grid-cols-2 gap-1">
                          {availableTags.map((tag) => (
                            <Button 
                              key={tag}
                              variant="outline"
                              size="sm"
                              className={`text-xs justify-start ${
                                task.tag === tag ? 'border-primary' : ''
                              } ${tagColors[tag] ? `tag-${tagColors[tag]}` : ''}`}
                              onClick={() => onUpdateTag(tag)}
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                        {task.tag && (
                          <Button 
                            variant="ghost" 
                            className="w-full text-xs"
                            onClick={() => onUpdateTag('')}
                          >
                            Clear tag
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
