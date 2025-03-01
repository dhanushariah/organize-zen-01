
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
      {/* Removed the progress percentage display from here */}
    </div>
  );
};

export default TaskColumnHeader;
