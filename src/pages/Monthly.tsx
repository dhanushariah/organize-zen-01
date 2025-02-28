
import TaskColumn from "@/components/TaskColumn";
import { format } from "date-fns";

const mockTasks = [
  { id: "1", title: "Monthly Report", tag: "work" as const },
  { id: "2", title: "Family Dinner", tag: "personal" as const },
  { id: "3", title: "Project Deadline", tag: "work" as const },
  { id: "4", title: "Home Maintenance", tag: "personal" as const },
  { id: "5", title: "Quarterly Review", tag: "work" as const },
  { id: "6", title: "Weekend Trip", tag: "personal" as const },
];

const Monthly = () => {
  const currentMonth = format(new Date(), "MMMM yyyy");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Monthly</h1>
        <p className="text-secondary mt-2">{currentMonth}</p>
      </div>
      <div className="flex justify-center">
        <TaskColumn title="Monthly Tasks" tasks={mockTasks} isLast />
      </div>
    </div>
  );
};

export default Monthly;
