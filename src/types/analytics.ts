
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
  color?: string;
};

export type TimeChartData = {
  date: string;
  hours: number;
};

export type ChartCustomization = {
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
};
