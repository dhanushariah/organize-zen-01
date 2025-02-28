
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Task, Tables } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

type ColumnTasks = {
  [key: string]: Task[];
};

type TaskHistory = {
  date: string;
  tasks: ColumnTasks;
}

export const useDailyTasks = () => {
  const [tasks, setTasks] = useState<ColumnTasks>({
    nonNegotiables: [],
    today: [],
    priority: []
  });
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Define columns once
  const columns = [
    { id: "nonNegotiables", title: "Non-negotiables" },
    { id: "today", title: "Today" },
    { id: "priority", title: "Priority" }
  ];
  
  // Load tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        // Group tasks by column
        const columnTasks: ColumnTasks = {
          nonNegotiables: [],
          today: [],
          priority: []
        };
        
        if (data) {
          data.forEach((task: Tables['tasks']) => {
            if (columnTasks[task.column_id]) {
              columnTasks[task.column_id].push({
                id: task.id,
                title: task.title,
                timerRunning: task.timer_running,
                timerElapsed: task.timer_elapsed,
                timerDisplay: task.timer_display
              });
            }
          });
        }
        
        setTasks(columnTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Failed to load tasks",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [user, toast]);
  
  // Load task history from Supabase
  useEffect(() => {
    const fetchTaskHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('task_history')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        const history: TaskHistory[] = [];
        
        if (data) {
          data.forEach((item: Tables['task_history']) => {
            history.push({
              date: item.date,
              tasks: item.tasks as ColumnTasks
            });
          });
        }
        
        setTaskHistory(history);
      } catch (error) {
        console.error("Error fetching task history:", error);
      }
    };
    
    fetchTaskHistory();
  }, [user]);
  
  // Save tasks to Supabase
  const saveTasks = async (updatedTasks: ColumnTasks) => {
    if (!user) return;
    
    try {
      // First, delete all tasks for this user (could be optimized in the future)
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Then insert all tasks
      const tasksToInsert = [];
      
      for (const columnId in updatedTasks) {
        for (const task of updatedTasks[columnId]) {
          tasksToInsert.push({
            id: task.id,
            user_id: user.id,
            title: task.title,
            column_id: columnId,
            timer_elapsed: task.timerElapsed || 0,
            timer_running: task.timerRunning || false,
            timer_display: task.timerDisplay || "",
          });
        }
      }
      
      if (tasksToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('tasks')
          .insert(tasksToInsert);
          
        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
      toast({
        title: "Failed to save tasks",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  // Save task history to Supabase
  const saveTaskHistory = async (date: string, taskData: ColumnTasks) => {
    if (!user) return;
    
    try {
      // Check if history for this date already exists
      const { data, error: fetchError } = await supabase
        .from('task_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date);
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (data && data.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('task_history')
          .update({ tasks: taskData })
          .eq('id', data[0].id);
          
        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('task_history')
          .insert({
            user_id: user.id,
            date,
            tasks: taskData
          });
          
        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error("Error saving task history:", error);
    }
  };
  
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
  const handleMoveTask = async (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    const taskToMove = tasks[sourceColumnId].find(task => task.id === taskId);
    
    if (!taskToMove) return;
    
    const updatedTasks = { ...tasks };
    
    updatedTasks[sourceColumnId] = tasks[sourceColumnId].filter(task => task.id !== taskId);
    updatedTasks[targetColumnId] = [...tasks[targetColumnId], taskToMove];
    
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
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
      await saveTasks(updatedTasks);
    }
  };
  
  // Save task history when tasks change
  useEffect(() => {
    const saveHistory = async () => {
      if (!user || isLoading) return;
      
      const today = format(new Date(), 'yyyy-MM-dd');
      await saveTaskHistory(today, tasks);
      
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
      saveHistory();
    }
  }, [tasks, user, isLoading]);
  
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
    displayTasks,
    isLoading
  };
};
