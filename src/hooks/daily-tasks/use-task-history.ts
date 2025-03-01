
import { format } from "date-fns";
import { TaskHistory, ColumnTasks, DEFAULT_COLUMN_TASKS } from "@/types/daily-task";

export function useTaskHistory(
  currentDate: Date,
  activeTab: string,
  taskHistory: TaskHistory[]
) {
  const getHistoricalTasks = () => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const historyEntry = taskHistory.find(h => h.date === dateKey);
    return historyEntry?.tasks || DEFAULT_COLUMN_TASKS;
  };

  const displayTasks = activeTab === "today" ? null : getHistoricalTasks();

  return {
    getHistoricalTasks,
    displayTasks
  };
}
