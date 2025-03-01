
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTagsManager } from "@/hooks/use-tags-manager";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    <div className="flex gap-2 items-center">
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
            <Badge 
              variant={selectedTag ? "default" : "outline"}
              className={`cursor-pointer text-xs whitespace-nowrap ${
                tagColors[selectedTag || ""] ? `tag-${tagColors[selectedTag || ""]}` : ''
              } ${selectedTag ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {selectedTag || "Tag"}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="grid grid-cols-2 gap-1">
              {availableTags.map((tagOption) => (
                <Button 
                  key={tagOption}
                  variant={selectedTag === tagOption ? "default" : "outline"}
                  size="sm"
                  className={`text-xs justify-start ${
                    tagColors[tagOption] ? `tag-${tagColors[tagOption]}` : ''
                  } ${selectedTag === tagOption ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => onSelectTag(selectedTag === tagOption ? '' : tagOption)}
                >
                  {tagOption}
                </Button>
              ))}
            </div>
            {selectedTag && (
              <Button 
                variant="ghost" 
                className="w-full text-xs mt-1"
                onClick={() => onSelectTag('')}
              >
                Clear tag
              </Button>
            )}
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
