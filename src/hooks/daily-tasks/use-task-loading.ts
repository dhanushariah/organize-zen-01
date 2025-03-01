import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ColumnTasks, TaskHistory, DEFAULT_COLUMN_TASKS } from "@/types/daily-task";
import { fetchTasks, fetchTaskHistory, saveTasks, saveTaskHistory } from "@/services/task-service";
import { format } from "date-fns";

export function useTaskLoading() {
  const [tasks, setTasks] = useState<ColumnTasks>(DEFAULT_COLUMN_TASKS);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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

  return {
    tasks,
    setTasks,
    taskHistory,
    isLoading
  };
}
