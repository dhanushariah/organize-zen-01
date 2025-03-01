
import { DEFAULT_COLUMNS } from "@/types/daily-task";
import { useDateNavigation } from "../use-date-navigation";
import { useTaskLoading } from "./use-task-loading";
import { useTaskManipulation } from "./use-task-manipulation";
import { useTaskHistory } from "./use-task-history";

export const useDailyTasks = () => {
  // Use the date navigation hook
  const {
    currentDate,
    activeTab,
    setActiveTab,
    handlePreviousDay,
    handleNextDay,
    isToday
  } = useDateNavigation();
  
  // Use the task loading hook
  const {
    tasks,
    setTasks,
    taskHistory,
    isLoading
  } = useTaskLoading();
  
  // Use the task manipulation hook
  const {
    handleMoveTask,
    handleTaskUpdate
  } = useTaskManipulation(tasks, setTasks);
  
  // Use the task history hook
  const { getHistoricalTasks } = useTaskHistory(currentDate, activeTab, taskHistory);
  
  // Determine which tasks to display
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
