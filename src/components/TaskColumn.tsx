
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  tag: "work" | "personal";
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isLast?: boolean;
}

const TaskColumn = ({ title, tasks, isLast }: TaskColumnProps) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <h2 className="text-xl font-semibold text-secondary">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="task-card p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={task.id}
                checked={completedTasks.includes(task.id)}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              <div className="flex flex-1 items-start justify-between">
                <label
                  htmlFor={task.id}
                  className={`font-medium cursor-pointer ${
                    completedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </label>
                <span className={`tag tag-${task.tag}`}>{task.tag}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!isLast && (
        <div className="hidden lg:block absolute right-0 top-0 h-full">
          <Separator orientation="vertical" className="h-full" />
        </div>
      )}
    </div>
  );
};

export default TaskColumn;
