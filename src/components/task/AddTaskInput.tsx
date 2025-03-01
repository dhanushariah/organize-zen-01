
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag } from "lucide-react";
import { useTagsManager } from "@/hooks/use-tags-manager";

interface AddTaskInputProps {
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  onAddTask: () => void;
  onSelectTag?: (tag: string) => void;
  selectedTag?: string;
}

const AddTaskInput = ({ 
  newTaskTitle, 
  setNewTaskTitle, 
  onAddTask,
  onSelectTag,
  selectedTag
}: AddTaskInputProps) => {
  const { availableTags, tagColors } = useTagsManager();
  
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Add a new task..."
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && newTaskTitle.trim()) {
            onAddTask();
          }
        }}
        className="text-sm md:text-base"
      />
      
      {onSelectTag && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              size="icon" 
              variant="outline"
              className="shrink-0"
            >
              <Tag className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Select tag for new task</p>
              <div className="grid grid-cols-2 gap-1">
                {availableTags.map((tagOption) => (
                  <Button 
                    key={tagOption}
                    variant="outline"
                    size="sm"
                    className={`text-xs justify-start ${
                      selectedTag === tagOption ? 'border-primary' : ''
                    } ${tagColors[tagOption] ? `tag-${tagColors[tagOption]}` : ''}`}
                    onClick={() => onSelectTag(tagOption)}
                  >
                    {tagOption}
                  </Button>
                ))}
              </div>
              {selectedTag && (
                <Button 
                  variant="ghost" 
                  className="w-full text-xs"
                  onClick={() => onSelectTag('')}
                >
                  Clear tag
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      <Button 
        size="icon" 
        onClick={onAddTask} 
        disabled={!newTaskTitle.trim()}
        className="shrink-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AddTaskInput;
