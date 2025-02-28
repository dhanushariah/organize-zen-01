
import TaskColumn from "@/components/TaskColumn";
import { format, startOfWeek, endOfWeek } from "date-fns";

const mockTasks = [
  { id: "1", title: "Weekly Planning", tag: "work" },
  { id: "2", title: "Gym Session", tag: "personal" },
  { id: "3", title: "Client Meeting", tag: "work" },
  { id: "4", title: "Language Class", tag: "personal" },
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
        <p className="text-secondary mt-2 date-text">{dateRange}</p>
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
