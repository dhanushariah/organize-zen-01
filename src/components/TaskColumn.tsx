
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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

const TaskColumn = ({ title, tasks: initialTasks, isLast }: TaskColumnProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `${Date.now()}`,
        title: newTaskTitle,
        tag: "personal" as const
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const handleUpdateTask = (taskId: string, newTitle: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, title: newTitle }
        : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
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
                {editingTask === task.id ? (
                  <Input
                    defaultValue={task.title}
                    onBlur={(e) => handleUpdateTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateTask(task.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <label
                      htmlFor={task.id}
                      className={`font-medium cursor-pointer ${
                        completedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""
                      }`}
                      onClick={() => setEditingTask(task.id)}
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={`tag tag-${task.tag}`}>{task.tag}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-6 w-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskTitle.trim()) {
                handleAddTask();
              }
            }}
          />
          <Button size="icon" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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
