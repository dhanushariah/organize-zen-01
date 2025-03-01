
import React from "react";
import { Play, Pause, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TaskActionsProps {
  taskId: string;
  tag?: string;
  timerRunning?: boolean;
  availableTags: string[];
  tagColors: Record<string, string>;
  onToggleTimer: () => void;
  onDelete: () => void;
  onUpdateTag?: (tag: string) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  taskId,
  tag,
  timerRunning,
  availableTags,
  tagColors,
  onToggleTimer,
  onDelete,
  onUpdateTag
}) => {
  return (
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
                {availableTags.map((tagOption) => (
                  <Button 
                    key={tagOption}
                    variant="outline"
                    size="sm"
                    className={`text-xs justify-start ${
                      tag === tagOption ? 'border-primary' : ''
                    } ${tagColors[tagOption] ? `tag-${tagColors[tagOption]}` : ''}`}
                    onClick={() => onUpdateTag(tagOption)}
                  >
                    {tagOption}
                  </Button>
                ))}
              </div>
              {tag && (
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
  );
};
