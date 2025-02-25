
import TaskColumn from "@/components/TaskColumn";
import { format } from "date-fns";

const mockTasks = {
  week1: [
    { id: "1", title: "Monthly Report", tag: "work" as const },
    { id: "2", title: "Family Dinner", tag: "personal" as const },
  ],
  week2: [
    { id: "3", title: "Project Deadline", tag: "work" as const },
    { id: "4", title: "Home Maintenance", tag: "personal" as const },
  ],
  week3: [
    { id: "5", title: "Quarterly Review", tag: "work" as const },
    { id: "6", title: "Weekend Trip", tag: "personal" as const },
  ],
};

const Monthly = () => {
  const currentMonth = format(new Date(), "MMMM yyyy");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Monthly</h1>
        <p className="text-secondary mt-2">{currentMonth}</p>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4 relative">
        <TaskColumn title="Week 1" tasks={mockTasks.week1} />
        <TaskColumn title="Week 2" tasks={mockTasks.week2} />
        <TaskColumn title="Week 3" tasks={mockTasks.week3} isLast />
      </div>
    </div>
  );
};

export default Monthly;
