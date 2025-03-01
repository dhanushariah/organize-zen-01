import { Task } from "@/types/task";
import { ColumnTasks } from "@/types/daily-task";
import { useAuth } from "@/contexts/AuthContext";
import { saveTasks } from "@/services/task-service";

export function useTaskManipulation(tasks: ColumnTasks, setTasks: React.Dispatch<React.SetStateAction<ColumnTasks>>) {
  const { user } = useAuth();
  
  const handleMoveTask = async (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    if (sourceColumnId === targetColumnId) return;
    
    const taskToMove = tasks[sourceColumnId]?.find(task => task.id === taskId);
    
    if (!taskToMove) {
      console.error(`Task with ID ${taskId} not found in column ${sourceColumnId}`);
      return;
    }
    
    const updatedTasks = { ...tasks };
    
    // Remove the task from the source column
    updatedTasks[sourceColumnId] = tasks[sourceColumnId].filter(task => task.id !== taskId);
    
    // Add the task to the target column
    updatedTasks[targetColumnId] = [...tasks[targetColumnId], taskToMove];
    
    console.log(`Moving task ${taskId} from ${sourceColumnId} to ${targetColumnId}`, updatedTasks);
    
    setTasks(updatedTasks);
    if (user) {
      await saveTasks(user.id, updatedTasks);
    }
  };
  
  const handleTaskUpdate = async (updatedTask: Task) => {
    console.log("Handling task update:", updatedTask);
    const updatedTasks = { ...tasks };
    
    let taskFound = false;
    let sourceColumnId = '';
    
    // First, check if this task exists in any column
    for (const columnId in updatedTasks) {
      const columnTasks = updatedTasks[columnId];
      const taskIndex = columnTasks.findIndex(task => task.id === updatedTask.id);
      
      if (taskIndex >= 0) {
        taskFound = true;
        sourceColumnId = columnId;
        
        if ('deleted' in updatedTask) {
          // If task is marked for deletion, remove it from the column
          updatedTasks[columnId] = columnTasks.filter(task => task.id !== updatedTask.id);
          console.log(`Deleting task ${updatedTask.id} from column ${columnId}`);
        } else {
          // Otherwise, update the existing task
          updatedTasks[columnId][taskIndex] = updatedTask;
          console.log(`Updating task ${updatedTask.id} in column ${columnId}`);
        }
        break;
      }
    }
    
    if (taskFound) {
      setTasks(updatedTasks);
      if (user) {
        await saveTasks(user.id, updatedTasks);
      }
    } else if (!('deleted' in updatedTask) && updatedTask.columnId) {
      // This is a new task with a specified column
      const targetColumnId = updatedTask.columnId;
      if (updatedTasks[targetColumnId]) {
        updatedTasks[targetColumnId] = [...updatedTasks[targetColumnId], updatedTask];
        console.log(`Adding new task ${updatedTask.id} to specified column ${targetColumnId}`);
        
        setTasks(updatedTasks);
        if (user) {
          await saveTasks(user.id, updatedTasks);
        }
      } else {
        console.error(`Invalid column ID: ${targetColumnId}`);
      }
    } else if (!('deleted' in updatedTask)) {
      // This is a new task without a specified column, add it to "today" by default
      updatedTasks["today"] = [...updatedTasks["today"], updatedTask];
      console.log(`Adding new task ${updatedTask.id} to default column "today"`);
      
      setTasks(updatedTasks);
      if (user) {
        await saveTasks(user.id, updatedTasks);
      }
    }
  };

  return {
    handleMoveTask,
    handleTaskUpdate
  };
}
