
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TaskColumnHeaderProps {
  title: string;
  progress: number;
  sortBy: string | null;
  setSortBy: (tag: string | null) => void;
  availableTags: string[];
}

const TaskColumnHeader = ({ 
  title, 
  progress, 
  sortBy, 
  setSortBy, 
  availableTags 
}: TaskColumnHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg md:text-xl font-bold">{title}</h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              {sortBy ? `Sorted: ${sortBy}` : "Sort by Tag"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background border shadow-md">
            <DropdownMenuItem onClick={() => setSortBy(null)}>
              No sorting
            </DropdownMenuItem>
            {availableTags.map(tag => (
              <DropdownMenuItem key={tag} onClick={() => setSortBy(tag)}>
                {tag}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {progress === 100 && (
          <div className="flex items-center">
            <Flag className="h-5 w-5 text-primary mr-1" />
            <span className="text-sm text-primary font-medium">Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumnHeader;
