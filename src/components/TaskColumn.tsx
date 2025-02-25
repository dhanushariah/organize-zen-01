
import { Card } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  tag: "work" | "personal";
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
}

const TaskColumn = ({ title, tasks }: TaskColumnProps) => {
  return (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <h2 className="text-xl font-semibold text-secondary">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="task-card p-4">
            <div className="flex items-start justify-between">
              <p className="font-medium">{task.title}</p>
              <span className={`tag tag-${task.tag}`}>{task.tag}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
