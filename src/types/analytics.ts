
import { Task } from "./task";
import { ColumnTasks } from "./daily-task";

export type TaskHistory = {
  date: string;
  tasks: ColumnTasks;
};

export type TagStats = {
  [key: string]: number;
};

export type TimeStats = {
  [key: string]: number;
};

export type CompletionData = {
  date: string;
  completion: number;
  tasks: number;
};

export type TagChartData = {
  name: string;
  value: number;
};

export type TimeChartData = {
  date: string;
  hours: number;
};
