
import { supabase } from "@/integrations/supabase/client";
import { Task, Tables } from "@/types/task";
import { ColumnTasks, TaskHistory } from "@/types/daily-task";
import { Json } from "@/integrations/supabase/types";

// Fetch tasks from Supabase
export const fetchTasks = async (userId: string): Promise<ColumnTasks | null> => {
  try {
    console.log("Fetching tasks for user:", userId);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Supabase error fetching tasks:", error);
      throw error;
    }
    
    // Group tasks by column
    const columnTasks: ColumnTasks = {
      nonNegotiables: [],
      today: [],
      priority: []
    };
    
    if (data && data.length > 0) {
      console.log("Tasks retrieved from Supabase:", data);
      data.forEach((task: Tables['tasks']) => {
        if (columnTasks[task.column_id]) {
          columnTasks[task.column_id].push({
            id: task.id,
            title: task.title,
            timerRunning: task.timer_running,
            timerElapsed: task.timer_elapsed,
            timerDisplay: task.timer_display,
            tag: task.tag || undefined,
            completed: task.completed
          });
        } else {
          console.warn(`Task with unknown column_id: ${task.column_id}`, task);
        }
      });
    }
    
    console.log("Organized column tasks:", columnTasks);
    return columnTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return null;
  }
};

// Fetch task history from Supabase
export const fetchTaskHistory = async (userId: string): Promise<TaskHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error("Supabase error fetching task history:", error);
      throw error;
    }
    
    const history: TaskHistory[] = [];
    
    if (data && data.length > 0) {
      data.forEach((item: Tables['task_history']) => {
        history.push({
          date: item.date,
          tasks: item.tasks as unknown as ColumnTasks
        });
      });
    }
    
    return history;
  } catch (error) {
    console.error("Error fetching task history:", error);
    return [];
  }
};

// Save tasks to Supabase
export const saveTasks = async (userId: string, updatedTasks: ColumnTasks): Promise<boolean> => {
  try {
    console.log("Saving tasks for user:", userId, updatedTasks);
    
    // First, delete all tasks for this user
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId);
      
    if (deleteError) {
      console.error("Supabase error deleting tasks:", deleteError);
      throw deleteError;
    }
    
    // Then insert all tasks
    const tasksToInsert = [];
    
    for (const columnId in updatedTasks) {
      for (const task of updatedTasks[columnId]) {
        tasksToInsert.push({
          id: task.id,
          user_id: userId,
          title: task.title,
          column_id: columnId,
          timer_elapsed: task.timerElapsed || 0,
          timer_running: task.timerRunning || false,
          timer_display: task.timerDisplay || "",
          tag: task.tag || null,
          completed: task.completed || false
        });
      }
    }
    
    if (tasksToInsert.length > 0) {
      console.log("Tasks to insert:", tasksToInsert);
      const { error: insertError } = await supabase
        .from('tasks')
        .insert(tasksToInsert);
        
      if (insertError) {
        console.error("Supabase error inserting tasks:", insertError);
        throw insertError;
      }
    }
    
    console.log("Tasks saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving tasks:", error);
    return false;
  }
};

// Save task history to Supabase
export const saveTaskHistory = async (userId: string, date: string, taskData: ColumnTasks): Promise<boolean> => {
  try {
    // Convert ColumnTasks to Json type for Supabase
    const tasksJson = taskData as unknown as Json;
    
    // Check if history for this date already exists
    const { data, error: fetchError } = await supabase
      .from('task_history')
      .select('id')
      .eq('user_id', userId)
      .eq('date', date);
      
    if (fetchError) {
      console.error("Supabase error fetching history:", fetchError);
      throw fetchError;
    }
    
    if (data && data.length > 0) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('task_history')
        .update({ tasks: tasksJson })
        .eq('id', data[0].id);
        
      if (updateError) {
        console.error("Supabase error updating history:", updateError);
        throw updateError;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('task_history')
        .insert({
          user_id: userId,
          date,
          tasks: tasksJson
        });
        
      if (insertError) {
        console.error("Supabase error inserting history:", insertError);
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving task history:", error);
    return false;
  }
};
