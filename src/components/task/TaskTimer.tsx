
import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskTimerProps {
  timerRunning?: boolean;
  timerDisplay?: string;
  onToggleTimer: () => void;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({
  timerRunning = false,
  timerDisplay = "0s",
  onToggleTimer
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-primary"
        onClick={onToggleTimer}
        aria-label={timerRunning ? "Pause timer" : "Start timer"}
      >
        {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </Button>
      
      {timerDisplay && (
        <span className={`text-xs ${timerRunning ? 'animate-pulse text-primary' : 'text-muted-foreground'}`}>
          {timerDisplay}
        </span>
      )}
    </div>
  );
};
