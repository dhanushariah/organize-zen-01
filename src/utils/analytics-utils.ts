
import { format, startOfWeek, endOfWeek, differenceInDays, isAfter, isBefore, parseISO } from "date-fns";
import { TaskHistory, TagStats, TimeStats, CompletionData, TagChartData, TimeChartData } from "@/types/analytics";

// Calculate streaks (days with at least one completed task)
export const calculateStreaks = (history: TaskHistory[]) => {
  if (!history || history.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let currentStreak = 0;
  let maxStreak = 0;
  let lastDate = new Date();
  let firstEntryProcessed = false;
  
  // Process each day in history
  for (let i = 0; i < sortedHistory.length; i++) {
    const entry = sortedHistory[i];
    const entryDate = new Date(entry.date);
    
    // Check if there are completed tasks for this day
    const hasCompletedTasks = Object.values(entry.tasks)
      .flat()
      .some(task => task.completed === true);
    
    // For the first entry (most recent)
    if (!firstEntryProcessed) {
      if (hasCompletedTasks) {
        currentStreak = 1;
        maxStreak = Math.max(maxStreak, currentStreak);
      }
      lastDate = entryDate;
      firstEntryProcessed = true;
      continue;
    }
    
    // For subsequent entries
    const dayDifference = differenceInDays(lastDate, entryDate);
    
    // If this is a consecutive day (1 day difference)
    if (dayDifference === 1) {
      if (hasCompletedTasks) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        // Break the streak if no completed tasks
        break;
      }
    } 
    // If there's a gap in days
    else if (dayDifference > 1) {
      break;
    }
    
    lastDate = entryDate;
  }
  
  return { currentStreak, longestStreak: maxStreak };
};

// Calculate tag statistics
export const calculateTagStats = (history: TaskHistory[]): TagStats => {
  const stats: TagStats = {};
  
  if (!history || history.length === 0) {
    return stats;
  }
  
  history.forEach(entry => {
    if (!entry.tasks) return;
    
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
  
  if (!history || history.length === 0) {
    return stats;
  }
  
  history.forEach(entry => {
    if (!entry.tasks) return;
    
    const date = format(new Date(entry.date), 'yyyy-MM-dd');
    let totalDuration = 0;
    
    Object.values(entry.tasks).flat().forEach(task => {
      if (task.duration) {
        totalDuration += task.duration;
      } else if (task.startTime && task.endTime) {
        const startTime = typeof task.startTime === 'string' ? new Date(task.startTime) : task.startTime;
        const endTime = typeof task.endTime === 'string' ? new Date(task.endTime) : task.endTime;
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;
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
  if (!taskHistory || taskHistory.length === 0) {
    return [];
  }
  
  return taskHistory.map(entry => {
    if (!entry.tasks) {
      return {
        date: format(new Date(entry.date), 'MMM dd'),
        completion: 0,
        tasks: 0
      };
    }
    
    const tasks = Object.values(entry.tasks).flat();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed === true).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      date: format(new Date(entry.date), 'MMM dd'),
      completion: Math.round(completionRate),
      tasks: totalTasks
    };
  })
  .sort((a, b) => {
    // Sort by date (newest last)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  })
  .slice(-7); // Get only the last 7 days
};

// Calculate task statistics by tag
export const getTagChartData = (tagStats: TagStats): TagChartData[] => {
  if (!tagStats || Object.keys(tagStats).length === 0) {
    return [];
  }
  
  const data = Object.entries(tagStats).map(([tag, count]) => ({
    name: tag,
    value: count
  }));
  
  return data.sort((a, b) => b.value - a.value);
};

// Calculate time spent data for chart
export const getTimeChartData = (timeStats: TimeStats): TimeChartData[] => {
  if (!timeStats || Object.keys(timeStats).length === 0) {
    return [];
  }
  
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
  if (!taskHistory || taskHistory.length === 0) {
    return 0;
  }
  
  const today = new Date();
  const startDay = startOfWeek(today);
  const endDay = endOfWeek(today);
  
  const weekEntries = taskHistory.filter(entry => {
    if (!entry.date) return false;
    
    const entryDate = new Date(entry.date);
    return !isBefore(entryDate, startDay) && !isAfter(entryDate, endDay);
  });
  
  let totalTasks = 0;
  let completedTasks = 0;
  
  weekEntries.forEach(entry => {
    if (!entry.tasks) return;
    
    const tasks = Object.values(entry.tasks).flat();
    totalTasks += tasks.length;
    completedTasks += tasks.filter(task => task.completed === true).length;
  });
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};
