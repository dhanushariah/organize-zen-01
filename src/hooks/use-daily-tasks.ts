import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Task } from "@/types/task";

type ColumnTasks = {
  [key: string]: Task[];
};

type TaskHistory = {
  date: string;
  tasks: ColumnTasks;
}

// Initial tasks for demonstration
const initialTasks = {
  nonNegotiables: [
    { id: "1", title: "Morning Exercise", tag: "personal" },
    { id: "2", title: "Team Stand-up", tag: "work" },
  ],
  today: [
    { id: "3", title: "Project Meeting", tag: "work" },
    { id: "4", title: "Grocery Shopping", tag: "personal" },
  ],
  priority: [
    { id: "5", title: "Client Presentation", tag: "work" },
    { id: "6", title: "Doctor's Appointment", tag: "personal" },
  ],
};

export const useDailyTasks = () => {
  const [tasks, setTasks] = useState<ColumnTasks>(initialTasks);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  
  // Define columns once
  const columns = [
    { id: "nonNegotiables", title: "Non-negotiables" },
    { id: "today", title: "Today" },
    { id: "priority", title: "Priority" }
  ];
  
  // Load task history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('taskHistory');
    if (savedHistory) {
      try {
        setTaskHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse task history", e);
      }
    }
  }, []);
  
  // Save tasks to history
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const historyIndex = taskHistory.findIndex(h => h.date === today);
    
    let updatedHistory = [...taskHistory];
    if (historyIndex >= 0) {
      updatedHistory[historyIndex] = {
        date: today,
        tasks: { ...tasks }
      };
    } else {
      updatedHistory.push({
        date: today,
        tasks: { ...tasks }
      });
    }
    
    // Keep only the last 30 days of history
    if (updatedHistory.length > 30) {
      updatedHistory = updatedHistory.slice(-30);
    }
    
    setTaskHistory(updatedHistory);
    localStorage.setItem('taskHistory', JSON.stringify(updatedHistory));
  }, [tasks, taskHistory]);
  
  // Navigation handlers
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

  // Task manipulation handlers
  const handleMoveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    const taskToMove = tasks[sourceColumnId].find(task => task.id === taskId);
    
    if (!taskToMove) return;
    
    const updatedTasks = { ...tasks };
    
    updatedTasks[sourceColumnId] = tasks[sourceColumnId].filter(task => task.id !== taskId);
    updatedTasks[targetColumnId] = [...tasks[targetColumnId], taskToMove];
    
    setTasks(updatedTasks);
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = { ...tasks };
    
    Object.keys(updatedTasks).forEach(columnId => {
      const columnTasks = updatedTasks[columnId];
      const taskIndex = columnTasks.findIndex(task => task.id === updatedTask.id);
      
      if (taskIndex >= 0) {
        if ('deleted' in updatedTask) {
          updatedTasks[columnId] = columnTasks.filter(task => task.id !== updatedTask.id);
        } else {
          updatedTasks[columnId][taskIndex] = updatedTask;
        }
      }
    });
    
    setTasks(updatedTasks);
  };
  
  // Get historical tasks for a specific date
  const getHistoricalTasks = () => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const historyEntry = taskHistory.find(h => h.date === dateKey);
    return historyEntry?.tasks || {
      nonNegotiables: [],
      today: [],
      priority: []
    };
  };
  
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const displayTasks = activeTab === "today" ? tasks : getHistoricalTasks();

  return {
    tasks,
    columns,
    currentDate,
    activeTab,
    setActiveTab,
    handlePreviousDay,
    handleNextDay,
    handleMoveTask,
    handleTaskUpdate,
    isToday,
    displayTasks
  };
};
