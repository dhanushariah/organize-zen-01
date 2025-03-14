
import React from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Define the type for allowed color variants
type ColorVariant = "default" | "secondary" | "destructive" | "outline" | "red" | "blue" | "green" | "yellow" | "purple" | "pink" | "indigo" | "gray";

interface TaskActionsProps {
  taskId: string;
  tag?: string;
  availableTags: string[];
  tagColors: Record<string, string>;
  onDelete: () => void;
  onUpdateTag?: (tag: string) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  taskId,
  tag,
  availableTags,
  tagColors,
  onDelete,
  onUpdateTag
}) => {
  // Helper function to get the appropriate tag color and ensure it's a valid variant
  const getTagColor = (tagName: string): ColorVariant => {
    const color = tagColors[tagName];
    const validColors: ColorVariant[] = ["default", "secondary", "destructive", "outline", "red", "blue", "green", "yellow", "purple", "pink", "indigo", "gray"];
    
    return validColors.includes(color as ColorVariant) ? color as ColorVariant : "gray";
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {onUpdateTag && (
        <Popover>
          <PopoverTrigger asChild>
            {tag ? (
              <Badge 
                variant={getTagColor(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2 py-0 flex items-center"
              >
                <Tag className="h-3 w-3 mr-1" /> Add Tag
              </Button>
            )}
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
                    }`}
                    onClick={() => onUpdateTag(tagOption)}
                  >
                    <Badge 
                      variant={getTagColor(tagOption)}
                      className="mr-1"
                    >
                      •
                    </Badge>
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
