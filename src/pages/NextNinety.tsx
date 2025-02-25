
import TaskColumn from "@/components/TaskColumn";

const mockTasks = {
  month1: [
    { id: "1", title: "Launch Product", tag: "work" as const },
    { id: "2", title: "Start Course", tag: "personal" as const },
  ],
  month2: [
    { id: "3", title: "Market Analysis", tag: "work" as const },
    { id: "4", title: "Vacation Plans", tag: "personal" as const },
  ],
  month3: [
    { id: "5", title: "Q4 Planning", tag: "work" as const },
    { id: "6", title: "Home Renovation", tag: "personal" as const },
  ],
};

const NextNinety = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Next 90 Days</h1>
        <p className="text-secondary mt-2">Long-term planning made simple</p>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4">
        <TaskColumn title="Month 1" tasks={mockTasks.month1} />
        <TaskColumn title="Month 2" tasks={mockTasks.month2} />
        <TaskColumn title="Month 3" tasks={mockTasks.month3} />
      </div>
    </div>
  );
};

export default NextNinety;
