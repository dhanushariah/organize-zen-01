
import React from "react";
import { Progress } from "@/components/ui/progress";

interface TaskColumnProgressProps {
  progress: number;
}

const TaskColumnProgress: React.FC<TaskColumnProgressProps> = ({ progress }) => {
  const roundedProgress = Math.round(progress);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
        <p>Progress</p>
        <p>{roundedProgress}%</p>
      </div>
      <Progress 
        value={progress} 
        className="h-1.5" 
        aria-label={`${roundedProgress}% of tasks completed`}
      />
    </div>
  );
};

export default TaskColumnProgress;
