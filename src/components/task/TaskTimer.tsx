
import React, { useEffect, useState } from "react";
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
  const [displayTime, setDisplayTime] = useState(timerDisplay);
  
  // Update local state whenever the prop changes
  useEffect(() => {
    setDisplayTime(timerDisplay);
  }, [timerDisplay]);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 shrink-0 ${timerRunning ? 'text-primary' : ''}`}
        onClick={onToggleTimer}
        aria-label={timerRunning ? "Pause timer" : "Start timer"}
      >
        {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </Button>
      
      {displayTime && (
        <span className={`text-xs ${timerRunning ? 'timer-active' : 'text-muted-foreground'}`}>
          {displayTime}
        </span>
      )}
    </div>
  );
};
