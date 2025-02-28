
import TaskColumn from "@/components/TaskColumn";
import { format, startOfWeek, endOfWeek } from "date-fns";

const mockTasks = [
  { id: "1", title: "Weekly Planning", tag: "work" as const },
  { id: "2", title: "Gym Session", tag: "personal" as const },
  { id: "3", title: "Client Meeting", tag: "work" as const },
  { id: "4", title: "Language Class", tag: "personal" as const },
];

const Weekly = () => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const dateRange = `${format(weekStart, "MMM do")} - ${format(weekEnd, "MMM do, yyyy")}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Weekly</h1>
        <p className="text-secondary mt-2">{dateRange}</p>
      </div>
      <div className="flex justify-center">
        <TaskColumn title="Weekly Tasks" tasks={mockTasks} isLast />
      </div>
    </div>
  );
};

export default Weekly;
