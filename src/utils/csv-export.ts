
import { format } from "date-fns";
import { TaskHistory, TagStats, TimeStats } from "@/types/analytics";

// Helper to create and download a CSV file
export const downloadCSV = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate CSV for task completion data
export const generateTaskCompletionCSV = (taskHistory: TaskHistory[]): string => {
  const headers = ["Date", "Total Tasks", "Completed Tasks", "Completion Rate (%)"];
  const rows = taskHistory.map(entry => {
    const tasks = Object.values(entry.tasks).flat();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed || task.endTime).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return [
      format(new Date(entry.date), "yyyy-MM-dd"),
      totalTasks.toString(),
      completedTasks.toString(),
      completionRate.toString()
    ];
  });
  
  return [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
};

// Generate CSV for tag distribution data
export const generateTagDistributionCSV = (tagStats: TagStats): string => {
  const headers = ["Tag", "Count"];
  const rows = Object.entries(tagStats).map(([tag, count]) => [tag, count.toString()]);
  
  return [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
};

// Generate CSV for time tracking data
export const generateTimeTrackingCSV = (timeStats: TimeStats): string => {
  const headers = ["Date", "Total Time (seconds)", "Total Time (hours)"];
  const rows = Object.entries(timeStats).map(([date, seconds]) => [
    date,
    seconds.toString(),
    (seconds / 3600).toFixed(2)
  ]);
  
  return [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
};

// Generate comprehensive CSV with all task data
export const generateFullTaskHistoryCSV = (taskHistory: TaskHistory[]): string => {
  const headers = [
    "Date", 
    "Task ID", 
    "Task Title", 
    "Column", 
    "Tag", 
    "Completed", 
    "Start Time", 
    "End Time", 
    "Duration (seconds)"
  ];
  
  let rows: string[][] = [];
  
  taskHistory.forEach(entry => {
    const date = format(new Date(entry.date), "yyyy-MM-dd");
    
    Object.entries(entry.tasks).forEach(([columnId, tasks]) => {
      tasks.forEach(task => {
        rows.push([
          date,
          task.id || '',
          task.title || '',
          columnId,
          task.tag || '',
          (task.completed || task.endTime) ? 'Yes' : 'No',
          task.startTime ? format(new Date(task.startTime), "yyyy-MM-dd HH:mm:ss") : '',
          task.endTime ? format(new Date(task.endTime), "yyyy-MM-dd HH:mm:ss") : '',
          task.duration?.toString() || ''
        ]);
      });
    });
  });
  
  return [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
};
