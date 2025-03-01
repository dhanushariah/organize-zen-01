
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
  const [localTimerRunning, setLocalTimerRunning] = useState(timerRunning);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Parse the initial display time into seconds
  useEffect(() => {
    setDisplayTime(timerDisplay);
    setLocalTimerRunning(timerRunning);
    
    // Parse the display time to get the initial elapsed time in milliseconds
    if (timerDisplay) {
      const timeRegex = /(\d+)h\s*(\d+)m\s*(\d+)s|(\d+)m\s*(\d+)s|(\d+)s/;
      const match = timerDisplay.match(timeRegex);
      
      if (match) {
        let totalSeconds = 0;
        
        if (match[1] && match[2] && match[3]) {
          // Format: 1h 2m 3s
          totalSeconds = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
        } else if (match[4] && match[5]) {
          // Format: 2m 3s
          totalSeconds = parseInt(match[4]) * 60 + parseInt(match[5]);
        } else if (match[6]) {
          // Format: 3s
          totalSeconds = parseInt(match[6]);
        }
        
        setElapsedTime(totalSeconds * 1000); // Convert to milliseconds
      }
    }
  }, [timerDisplay, timerRunning]);
  
  // Handle timer running state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (localTimerRunning) {
      setStartTime(Date.now() - elapsedTime);
      
      interval = setInterval(() => {
        if (startTime !== null) {
          const currentElapsed = Date.now() - startTime;
          setElapsedTime(currentElapsed);
          
          // Format the time for display
          const seconds = Math.floor((currentElapsed / 1000) % 60);
          const minutes = Math.floor((currentElapsed / (1000 * 60)) % 60);
          const hours = Math.floor(currentElapsed / (1000 * 60 * 60));
          
          let formattedTime = "";
          if (hours > 0) {
            formattedTime = `${hours}h ${minutes}m ${seconds}s`;
          } else if (minutes > 0) {
            formattedTime = `${minutes}m ${seconds}s`;
          } else {
            formattedTime = `${seconds}s`;
          }
          
          setDisplayTime(formattedTime);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [localTimerRunning, startTime, elapsedTime]);
  
  // Handle the timer toggle
  const handleToggleTimer = () => {
    setLocalTimerRunning(!localTimerRunning);
    onToggleTimer();
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 shrink-0 ${localTimerRunning ? 'text-primary animate-pulse' : ''}`}
        onClick={handleToggleTimer}
        aria-label={localTimerRunning ? "Pause timer" : "Start timer"}
      >
        {localTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </Button>
      
      {displayTime && (
        <span className={`text-xs ${localTimerRunning ? 'text-primary' : 'text-muted-foreground'}`}>
          {displayTime}
        </span>
      )}
    </div>
  );
};
