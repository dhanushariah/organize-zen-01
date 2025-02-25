
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
    <div className="flex-1 min-w-[280px] md:min-w-[300px] relative">
      <h2 className="text-lg md:text-xl font-semibold text-secondary mb-4">{title}</h2>
      <div className="space-y-3 md:space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="task-card p-3 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <Checkbox
                id={task.id}
                checked={completedTasks.includes(task.id)}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
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
                    className="text-sm md:text-base"
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <label
                      htmlFor={task.id}
                      className={`font-medium cursor-pointer text-sm md:text-base ${
                        completedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""
                      }`}
                      onClick={() => setEditingTask(task.id)}
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2 shrink-0">
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
            className="text-sm md:text-base"
          />
          <Button 
            size="icon" 
            onClick={handleAddTask} 
            disabled={!newTaskTitle.trim()}
            className="shrink-0"
          >
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
