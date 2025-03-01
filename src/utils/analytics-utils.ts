
import { format, startOfWeek, endOfWeek, differenceInDays, isAfter, isBefore } from "date-fns";
import { TaskHistory, TagStats, TimeStats, CompletionData, TagChartData, TimeChartData } from "@/types/analytics";

// Calculate streaks (days with at least one completed task)
export const calculateStreaks = (history: TaskHistory[]) => {
  // Sort history by date
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let currentStreak = 0;
  let maxStreak = 0;
  let previousDate: Date | null = null;
  
  sortedHistory.forEach(entry => {
    const entryDate = new Date(entry.date);
    const hasCompletedTasks = Object.values(entry.tasks)
      .flat()
      .some(task => task.completed || task.endTime);
    
    if (hasCompletedTasks) {
      // If this is first entry or consecutive with previous date
      if (!previousDate || differenceInDays(entryDate, previousDate) === 1) {
        currentStreak++;
      } else if (differenceInDays(entryDate, previousDate) > 1) {
        // Streak broken
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      previousDate = entryDate;
    } else if (previousDate && differenceInDays(entryDate, previousDate) > 1) {
      // Day with no completed tasks breaks the streak
      currentStreak = 0;
    }
  });
  
  return { currentStreak, longestStreak: maxStreak };
};

// Calculate tag statistics
export const calculateTagStats = (history: TaskHistory[]): TagStats => {
  const stats: TagStats = {};
  
  history.forEach(entry => {
    Object.values(entry.tasks).flat().forEach(task => {
      if (task.tag && typeof task.tag === 'string') {
        stats[task.tag] = (stats[task.tag] || 0) + 1;
      }
    });
  });
  
  return stats;
};

// Calculate time spent statistics
export const calculateTimeStats = (history: TaskHistory[]): TimeStats => {
  const stats: TimeStats = {};
  
  history.forEach(entry => {
    const date = format(new Date(entry.date), 'yyyy-MM-dd');
    let totalDuration = 0;
    
    Object.values(entry.tasks).flat().forEach(task => {
      if (task.duration) {
        totalDuration += task.duration;
      } else if (task.startTime && task.endTime) {
        const duration = (new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / 1000;
        totalDuration += duration;
      } else if (task.timerElapsed) {
        totalDuration += task.timerElapsed / 1000; // Convert milliseconds to seconds
      }
    });
    
    stats[date] = totalDuration;
  });
  
  return stats;
};

// Calculate task completion percentages by day
export const getCompletionByDay = (taskHistory: TaskHistory[]): CompletionData[] => {
  return taskHistory.map(entry => {
    const tasks = Object.values(entry.tasks).flat();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed || task.endTime).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      date: format(new Date(entry.date), 'MMM dd'),
      completion: Math.round(completionRate),
      tasks: totalTasks
    };
  }).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 7).reverse();
};

// Calculate task statistics by tag
export const getTagChartData = (tagStats: TagStats): TagChartData[] => {
  const data = Object.entries(tagStats).map(([tag, count]) => ({
    name: tag,
    value: count
  }));
  
  return data.sort((a, b) => b.value - a.value);
};

// Calculate time spent data for chart
export const getTimeChartData = (timeStats: TimeStats): TimeChartData[] => {
  return Object.entries(timeStats)
    .map(([date, seconds]) => ({
      date: format(new Date(date), 'MMM dd'),
      hours: Math.round((seconds / 3600) * 10) / 10
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);
};

// Get current week's completion rate
export const getCurrentWeekCompletion = (taskHistory: TaskHistory[]): number => {
  const today = new Date();
  const startDay = startOfWeek(today);
  const endDay = endOfWeek(today);
  
  const weekEntries = taskHistory.filter(entry => {
    const entryDate = new Date(entry.date);
    return !isBefore(entryDate, startDay) && !isAfter(entryDate, endDay);
  });
  
  let totalTasks = 0;
  let completedTasks = 0;
  
  weekEntries.forEach(entry => {
    const tasks = Object.values(entry.tasks).flat();
    totalTasks += tasks.length;
    completedTasks += tasks.filter(task => task.completed || task.endTime).length;
  });
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};
