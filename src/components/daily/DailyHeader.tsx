import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DailyHeaderProps {
  currentDate: Date;
  isToday: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
}

const DailyHeader = ({
  currentDate,
  isToday,
  activeTab,
  setActiveTab,
  handlePreviousDay,
  handleNextDay,
}: DailyHeaderProps) => {
  const dateString = format(currentDate, "EEEE, MMMM do, yyyy");

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Daily Tasks</h1>
      <div className="flex items-center justify-center mt-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePreviousDay}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-secondary-foreground font-medium date-text px-2">{dateString}</p>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNextDay}
          disabled={isToday}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DailyHeader;
