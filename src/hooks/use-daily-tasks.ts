
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { ColumnTasks, TaskHistory, DEFAULT_COLUMNS, DEFAULT_COLUMN_TASKS } from "@/types/daily-task";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useDateNavigation } from "./use-date-navigation";
import { fetchTasks, fetchTaskHistory, saveTasks, saveTaskHistory } from "@/services/task-service";

export const useDailyTasks = () => {
  const [tasks, setTasks] = useState<ColumnTasks>(DEFAULT_COLUMN_TASKS);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use the date navigation hook
  const {
    currentDate,
    activeTab,
    setActiveTab,
    handlePreviousDay,
    handleNextDay,
    isToday
  } = useDateNavigation();
  
  // Load tasks from Supabase
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const columnTasks = await fetchTasks(user.id);
        
        if (columnTasks) {
          setTasks(columnTasks);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast({
          title: "Failed to load tasks",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [user, toast]);
  
  // Load task history from Supabase
  useEffect(() => {
    const loadTaskHistory = async () => {
      if (!user) return;
      
      try {
        const history = await fetchTaskHistory(user.id);
        setTaskHistory(history);
      } catch (error) {
        console.error("Error loading task history:", error);
      }
    };
    
    loadTaskHistory();
  }, [user]);
  
  // Task manipulation handlers
  const handleMoveTask = async (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    const taskToMove = tasks[sourceColumnId].find(task => task.id === taskId);
    
    if (!taskToMove) return;
    
    const updatedTasks = { ...tasks };
    
    updatedTasks[sourceColumnId] = tasks[sourceColumnId].filter(task => task.id !== taskId);
    updatedTasks[targetColumnId] = [...tasks[targetColumnId], taskToMove];
    
    setTasks(updatedTasks);
    if (user) {
      await saveTasks(user.id, updatedTasks);
    }
  };
  
  const handleTaskUpdate = async (updatedTask: Task) => {
    const updatedTasks = { ...tasks };
    
    let taskFound = false;
    for (const columnId in updatedTasks) {
      const columnTasks = updatedTasks[columnId];
      const taskIndex = columnTasks.findIndex(task => task.id === updatedTask.id);
      
      if (taskIndex >= 0) {
        taskFound = true;
        if ('deleted' in updatedTask) {
          updatedTasks[columnId] = columnTasks.filter(task => task.id !== updatedTask.id);
        } else {
          updatedTasks[columnId][taskIndex] = updatedTask;
        }
        break;
      }
    }
    
    if (taskFound) {
      setTasks(updatedTasks);
      if (user) {
        // Ensure we save the tasks to Supabase
        await saveTasks(user.id, updatedTasks);
      }
    } else if (!('deleted' in updatedTask)) {
      // If task wasn't found in any column and it's not a deletion, it's a new task
      // Add it to the "today" column by default
      updatedTasks["today"] = [...updatedTasks["today"], updatedTask];
      setTasks(updatedTasks);
      
      if (user) {
        // Ensure we save the tasks to Supabase
        await saveTasks(user.id, updatedTasks);
      }
    }
  };
  
  // Save task history when tasks change
  useEffect(() => {
    const updateHistory = async () => {
      if (!user || isLoading) return;
      
      const today = format(new Date(), 'yyyy-MM-dd');
      if (user) {
        await saveTaskHistory(user.id, today, tasks);
      }
      
      // Update the history state as well
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
    };
    
    if (!isLoading) {
      updateHistory();
    }
  }, [tasks, user, isLoading, taskHistory]);
  
  // Get historical tasks for a specific date
  const getHistoricalTasks = () => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const historyEntry = taskHistory.find(h => h.date === dateKey);
    return historyEntry?.tasks || DEFAULT_COLUMN_TASKS;
  };
  
  const displayTasks = activeTab === "today" ? tasks : getHistoricalTasks();
  
  return {
    tasks,
    columns: DEFAULT_COLUMNS,
    currentDate,
    activeTab,
    setActiveTab,
    handlePreviousDay,
    handleNextDay,
    handleMoveTask,
    handleTaskUpdate,
    isToday,
    displayTasks,
    isLoading
  };
};
