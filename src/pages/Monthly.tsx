
import TaskColumn from "@/components/task/TaskColumn";
import { format, addMonths, subMonths } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const generateMockTasks = (monthOffset: number) => {
  // In a real app, this would fetch data based on the month
  const baseTitle = monthOffset === 0 
    ? "Current Month - " 
    : monthOffset < 0 
      ? `${Math.abs(monthOffset)} Month${Math.abs(monthOffset) > 1 ? "s" : ""} Ago - `
      : `${monthOffset} Month${monthOffset > 1 ? "s" : ""} Ahead - `;
  
  return [
    { id: `m${monthOffset}-1`, title: `${baseTitle}Monthly Report`, tag: "work" },
    { id: `m${monthOffset}-2`, title: `${baseTitle}Family Dinner`, tag: "personal" },
    { id: `m${monthOffset}-3`, title: `${baseTitle}Project Deadline`, tag: "work" },
    { id: `m${monthOffset}-4`, title: `${baseTitle}Home Maintenance`, tag: "personal" },
    { id: `m${monthOffset}-5`, title: `${baseTitle}Quarterly Review`, tag: "work" },
    { id: `m${monthOffset}-6`, title: `${baseTitle}Weekend Trip`, tag: "personal" },
  ];
};

const Monthly = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [tasks, setTasks] = useState(generateMockTasks(0));
  const isMobile = useIsMobile();
  
  const today = new Date();
  const currentMonth = monthOffset === 0 
    ? today 
    : monthOffset > 0 
      ? addMonths(today, monthOffset)
      : subMonths(today, Math.abs(monthOffset));
  
  const monthDisplay = format(currentMonth, "MMMM yyyy");

  const navigateToPreviousMonth = () => {
    const newOffset = monthOffset - 1;
    setMonthOffset(newOffset);
    setTasks(generateMockTasks(newOffset));
  };

  const navigateToNextMonth = () => {
    const newOffset = monthOffset + 1;
    setMonthOffset(newOffset);
    setTasks(generateMockTasks(newOffset));
  };

  const navigateToCurrentMonth = () => {
    setMonthOffset(0);
    setTasks(generateMockTasks(0));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Monthly</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-secondary date-text">{monthDisplay}</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToPreviousMonth}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Prev</span>}
            </Button>
            
            {monthOffset !== 0 && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={navigateToCurrentMonth}
                className="h-8 px-2"
              >
                Current
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToNextMonth}
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
          title={`Month ${monthOffset === 0 ? '(Current)' : monthOffset < 0 ? `(${Math.abs(monthOffset)} month${Math.abs(monthOffset) > 1 ? 's' : ''} ago)` : `(${monthOffset} month${monthOffset > 1 ? 's' : ''} ahead)`}`} 
          tasks={tasks} 
          isLast 
          columnId="monthly"
        />
      </div>
    </div>
  );
};

export default Monthly;
