
import { useState, useEffect } from "react";
import { TaskHistory, TagStats, TimeStats } from "@/types/analytics";
import { 
  calculateStreaks, 
  calculateTagStats, 
  calculateTimeStats 
} from "@/utils/analytics-utils";
import { useTaskLoading } from "@/hooks/daily-tasks/use-task-loading";

export function useAnalyticsData() {
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [tagStats, setTagStats] = useState<TagStats>({});
  const [timeStats, setTimeStats] = useState<TimeStats>({});
  
  // Use task loading hook to get the latest task history
  const { taskHistory: loadedTaskHistory, isLoading } = useTaskLoading();
  
  // Load history and calculate stats
  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;
    
    // Use loaded task history if available
    if (loadedTaskHistory && loadedTaskHistory.length > 0) {
      setTaskHistory(loadedTaskHistory);
      
      // Calculate streaks
      const { currentStreak: current, longestStreak: longest } = calculateStreaks(loadedTaskHistory);
      setCurrentStreak(current);
      setLongestStreak(longest);
      
      // Calculate tag statistics
      setTagStats(calculateTagStats(loadedTaskHistory));
      
      // Calculate time spent statistics
      setTimeStats(calculateTimeStats(loadedTaskHistory));
    } else {
      // Fall back to localStorage if needed
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
    }
  }, [loadedTaskHistory, isLoading]);

  return {
    taskHistory,
    currentStreak,
    longestStreak,
    tagStats,
    timeStats,
    isLoading
  };
}
