
import TaskColumn from "@/components/TaskColumn";
import { format } from "date-fns";

const mockTasks = [
  { id: "1", title: "Monthly Report", tag: "work" },
  { id: "2", title: "Family Dinner", tag: "personal" },
  { id: "3", title: "Project Deadline", tag: "work" },
  { id: "4", title: "Home Maintenance", tag: "personal" },
  { id: "5", title: "Quarterly Review", tag: "work" },
  { id: "6", title: "Weekend Trip", tag: "personal" },
];

const Monthly = () => {
  const currentMonth = format(new Date(), "MMMM yyyy");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Monthly</h1>
        <p className="text-secondary mt-2 date-text">{currentMonth}</p>
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
