
import { useState, useEffect } from "react";
import { TaskHistory, TagStats, TimeStats } from "@/types/analytics";
import { 
  calculateStreaks, 
  calculateTagStats, 
  calculateTimeStats 
} from "@/utils/analytics-utils";

export function useAnalyticsData() {
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [tagStats, setTagStats] = useState<TagStats>({});
  const [timeStats, setTimeStats] = useState<TimeStats>({});
  
  // Load history and calculate stats
  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('taskHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory) as TaskHistory[];
        setTaskHistory(history);
        
        // Calculate streaks
        const { currentStreak: current, longestStreak: longest } = calculateStreaks(history);
        setCurrentStreak(current);
        setLongestStreak(longest);
        
        // Calculate tag statistics
        setTagStats(calculateTagStats(history));
        
        // Calculate time spent statistics
        setTimeStats(calculateTimeStats(history));
      } catch (e) {
        console.error("Failed to parse task history", e);
      }
    }
  }, []);

  return {
    taskHistory,
    currentStreak,
    longestStreak,
    tagStats,
    timeStats
  };
}
