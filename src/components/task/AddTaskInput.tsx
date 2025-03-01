
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-3">
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
        
        <Button 
          size="icon" 
          onClick={onAddTask} 
          disabled={!newTaskTitle.trim()}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {onSelectTag && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {availableTags.map((tagOption) => (
              <Badge 
                key={tagOption}
                variant={selectedTag === tagOption ? "default" : "outline"}
                className={`cursor-pointer text-xs ${
                  tagColors[tagOption] ? `tag-${tagColors[tagOption]}` : ''
                } ${selectedTag === tagOption ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => onSelectTag(selectedTag === tagOption ? '' : tagOption)}
              >
                {tagOption}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskInput;
