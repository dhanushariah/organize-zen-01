
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { format, addDays } from "date-fns";
import { TaskHistory } from "@/types/analytics";

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  taskHistory: TaskHistory[];
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ 
  currentStreak, 
  longestStreak, 
  taskHistory 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak Tracking</CardTitle>
        <CardDescription>Your task completion streak</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Current Streak</h3>
            <div className="flex items-center mt-1">
              <Flame className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-2xl font-bold">{currentStreak} days</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Longest Streak</h3>
            <div className="flex items-center mt-1">
              <Flame className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-2xl font-bold">{longestStreak} days</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Last 7 Days</h3>
          <div className="flex gap-1">
            {Array.from({length: 7}).map((_, i) => {
              const date = format(addDays(new Date(), -6 + i), 'yyyy-MM-dd');
              const entry = taskHistory.find(h => h.date === date);
              const hasCompletedTasks = entry && Object.values(entry.tasks)
                .flat()
                .some(task => task.endTime);
              
              return (
                <div 
                  key={i} 
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs ${
                    hasCompletedTasks ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                  title={format(addDays(new Date(), -6 + i), 'MMM dd, yyyy')}
                >
                  {format(addDays(new Date(), -6 + i), 'dd')}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
