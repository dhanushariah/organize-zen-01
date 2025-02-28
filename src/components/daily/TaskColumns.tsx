
import { Task } from "@/types/task";
import TaskColumn from "@/components/task/TaskColumn";

interface TaskColumnsProps {
  columns: { id: string; title: string }[];
  displayTasks: { [key: string]: Task[] };
  activeTab: string;
  handleMoveTask?: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
  handleTaskUpdate?: (task: Task) => void;
}

const TaskColumns = ({
  columns,
  displayTasks,
  activeTab,
  handleMoveTask,
  handleTaskUpdate,
}: TaskColumnsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-4 relative">
      {columns.map((column, index) => (
        <TaskColumn
          key={column.id}
          title={column.title}
          tasks={displayTasks[column.id] || []}
          isLast={index === columns.length - 1}
          onMoveTask={activeTab === "today" ? handleMoveTask : undefined}
          columnId={column.id}
          otherColumns={activeTab === "today" ? columns.filter(c => c.id !== column.id) : []}
          onTaskUpdate={activeTab === "today" ? handleTaskUpdate : undefined}
        />
      ))}
    </div>
  );
};

export default TaskColumns;
