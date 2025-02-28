
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTaskInputProps {
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  onAddTask: () => void;
}

const AddTaskInput = ({ newTaskTitle, setNewTaskTitle, onAddTask }: AddTaskInputProps) => {
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
