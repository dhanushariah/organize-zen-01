
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskColumnHeaderProps {
  title: string;
  progress: number;
}

const TaskColumnHeader = ({ 
  title, 
  progress 
}: TaskColumnHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default TaskColumnHeader;
