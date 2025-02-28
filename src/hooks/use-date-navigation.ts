
import { useState } from "react";
import { format, subDays } from "date-fns";

export function useDateNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  
  const handlePreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
    setActiveTab("history");
  };
  
  const handleNextDay = () => {
    const tomorrow = subDays(new Date(), -1);
    if (currentDate < tomorrow) {
      setCurrentDate(prev => subDays(prev, -1));
    } else {
      setCurrentDate(new Date());
      setActiveTab("today");
    }
  };
  
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  
  return {
    currentDate,
    activeTab,
    setActiveTab,
    handlePreviousDay,
    handleNextDay,
    isToday
  };
}
