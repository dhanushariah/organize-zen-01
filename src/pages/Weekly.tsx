
import TaskColumn from "@/components/task/TaskColumn";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const generateMockTasks = (weekOffset: number) => {
  // In a real app, this would fetch data based on the week
  const baseTitle = weekOffset === 0 
    ? "Current Week - " 
    : weekOffset < 0 
      ? `${Math.abs(weekOffset)} Week${Math.abs(weekOffset) > 1 ? "s" : ""} Ago - `
      : `${weekOffset} Week${weekOffset > 1 ? "s" : ""} Ahead - `;
  
  return [
    { id: `w${weekOffset}-1`, title: `${baseTitle}Weekly Planning`, tag: "work" },
    { id: `w${weekOffset}-2`, title: `${baseTitle}Gym Session`, tag: "personal" },
    { id: `w${weekOffset}-3`, title: `${baseTitle}Client Meeting`, tag: "work" },
    { id: `w${weekOffset}-4`, title: `${baseTitle}Language Class`, tag: "personal" },
  ];
};

const Weekly = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [tasks, setTasks] = useState(generateMockTasks(0));
  const isMobile = useIsMobile();
  
  const today = new Date();
  const currentWeekDate = weekOffset === 0 
    ? today 
    : weekOffset > 0 
      ? addWeeks(today, weekOffset)
      : subWeeks(today, Math.abs(weekOffset));
  
  const weekStart = startOfWeek(currentWeekDate);
  const weekEnd = endOfWeek(currentWeekDate);
  const dateRange = `${format(weekStart, "MMM do")} - ${format(weekEnd, "MMM do, yyyy")}`;

  const navigateToPreviousWeek = () => {
    const newOffset = weekOffset - 1;
    setWeekOffset(newOffset);
    setTasks(generateMockTasks(newOffset));
  };

  const navigateToNextWeek = () => {
    const newOffset = weekOffset + 1;
    setWeekOffset(newOffset);
    setTasks(generateMockTasks(newOffset));
  };

  const navigateToCurrentWeek = () => {
    setWeekOffset(0);
    setTasks(generateMockTasks(0));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Weekly</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-secondary date-text">{dateRange}</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToPreviousWeek}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Prev</span>}
            </Button>
            
            {weekOffset !== 0 && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={navigateToCurrentWeek}
                className="h-8 px-2"
              >
                Current
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToNextWeek}
              className="h-8 px-2"
            >
              {!isMobile && <span className="mr-1">Next</span>}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <TaskColumn 
          title={`Week ${weekOffset === 0 ? '(Current)' : weekOffset < 0 ? `(${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ago)` : `(${weekOffset} week${weekOffset > 1 ? 's' : ''} ahead)`}`} 
          tasks={tasks} 
          isLast 
          columnId="weekly"
        />
      </div>
    </div>
  );
};

export default Weekly;
