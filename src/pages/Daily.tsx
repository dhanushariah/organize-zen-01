
import TaskColumn from "@/components/TaskColumn";
import { format } from "date-fns";
import { useState } from "react";

type TaskType = {
  id: string;
  title: string;
  tag: string;
  tagColor?: string;
};

type ColumnTasks = {
  [key: string]: TaskType[];
};

const initialTasks = {
  nonNegotiables: [
    { id: "1", title: "Morning Exercise", tag: "personal" },
    { id: "2", title: "Team Stand-up", tag: "work" },
  ],
  today: [
    { id: "3", title: "Project Meeting", tag: "work" },
    { id: "4", title: "Grocery Shopping", tag: "personal" },
  ],
  priority: [
    { id: "5", title: "Client Presentation", tag: "work" },
    { id: "6", title: "Doctor's Appointment", tag: "personal" },
  ],
};

const Daily = () => {
  const [tasks, setTasks] = useState<ColumnTasks>(initialTasks);
  const today = new Date();
  const dateString = format(today, "EEEE, MMMM do, yyyy");

  const handleMoveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    // Find the task in the source column
    const taskToMove = tasks[sourceColumnId].find(task => task.id === taskId);
    
    if (!taskToMove) return;
    
    // Create updated task collections
    const updatedTasks = { ...tasks };
    
    // Remove from source column
    updatedTasks[sourceColumnId] = tasks[sourceColumnId].filter(task => task.id !== taskId);
    
    // Add to target column
    updatedTasks[targetColumnId] = [...tasks[targetColumnId], taskToMove];
    
    // Update state
    setTasks(updatedTasks);
  };

  const columns = [
    { id: "nonNegotiables", title: "Non-negotiables" },
    { id: "today", title: "Today" },
    { id: "priority", title: "Priority" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Daily Tasks</h1>
        <p className="text-secondary mt-2 date-text">{dateString}</p>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4 relative">
        {columns.map((column, index) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            tasks={tasks[column.id]}
            isLast={index === columns.length - 1}
            onMoveTask={handleMoveTask}
            columnId={column.id}
            otherColumns={columns.filter(c => c.id !== column.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Daily;
