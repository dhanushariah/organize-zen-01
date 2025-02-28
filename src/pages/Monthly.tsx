
import TaskColumn from "@/components/task/TaskColumn";

const mockTasks = [
  { id: "1", title: "Monthly Budget Review", tag: "work" },
  { id: "2", title: "Home Maintenance", tag: "home" },
  { id: "3", title: "Monthly Health Check", tag: "health" },
];

const Monthly = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Monthly Tasks</h1>
        <p className="text-muted-foreground mt-2">Manage your tasks for the month</p>
      </div>
      
      <div className="flex justify-center">
        <TaskColumn 
          title="Monthly Tasks" 
          tasks={mockTasks} 
          isLast 
          columnId="monthly"
        />
      </div>
    </div>
  );
};

export default Monthly;
