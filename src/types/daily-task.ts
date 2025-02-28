
import { Task } from "./task";

export type ColumnTasks = {
  [key: string]: Task[];
};

export type TaskHistory = {
  date: string;
  tasks: ColumnTasks;
}

export type Column = {
  id: string;
  title: string;
}

export const DEFAULT_COLUMNS: Column[] = [
  { id: "nonNegotiables", title: "Non-negotiables" },
  { id: "today", title: "Today" },
  { id: "priority", title: "Priority" }
];

export const DEFAULT_COLUMN_TASKS: ColumnTasks = {
  nonNegotiables: [],
  today: [],
  priority: []
};
