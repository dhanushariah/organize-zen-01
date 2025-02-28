
import { Progress } from "@/components/ui/progress";

interface TaskColumnProgressProps {
  progress: number;
}

const TaskColumnProgress = ({ progress }: TaskColumnProgressProps) => {
  return (
    <div className="mb-4">
      <Progress 
        value={progress} 
        className={`h-2 rounded-full overflow-hidden ${progress > 0 ? 'progress-bar-glow' : ''}`}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Progress</span>
        <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default TaskColumnProgress;
