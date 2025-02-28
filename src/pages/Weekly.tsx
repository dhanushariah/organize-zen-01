
import TaskColumn from "@/components/task/TaskColumn";

const mockTasks = [
  { id: "1", title: "Prepare Weekly Report", tag: "work" },
  { id: "2", title: "Team Meeting", tag: "work" },
  { id: "3", title: "Weekly Exercise Plan", tag: "health" },
];

const Weekly = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Weekly Tasks</h1>
        <p className="text-muted-foreground mt-2">Manage your tasks for the week</p>
      </div>
      
      <div className="flex justify-center">
        <TaskColumn 
          title="Weekly Tasks" 
          tasks={mockTasks} 
          isLast 
          columnId="weekly"
        />
      </div>
    </div>
  );
};

export default Weekly;
