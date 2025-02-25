
import TaskColumn from "@/components/TaskColumn";

const mockTasks = {
  nonNegotiables: [
    { id: "1", title: "Morning Exercise", tag: "personal" as const },
    { id: "2", title: "Team Stand-up", tag: "work" as const },
  ],
  today: [
    { id: "3", title: "Project Meeting", tag: "work" as const },
    { id: "4", title: "Grocery Shopping", tag: "personal" as const },
  ],
  priority: [
    { id: "5", title: "Client Presentation", tag: "work" as const },
    { id: "6", title: "Doctor's Appointment", tag: "personal" as const },
  ],
};

const Daily = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Daily Tasks</h1>
        <p className="text-secondary mt-2">Organize your day efficiently</p>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4">
        <TaskColumn title="Non-negotiables" tasks={mockTasks.nonNegotiables} />
        <TaskColumn title="Today" tasks={mockTasks.today} />
        <TaskColumn title="Priority" tasks={mockTasks.priority} />
      </div>
    </div>
  );
};

export default Daily;
