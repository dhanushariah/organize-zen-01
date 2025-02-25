
import TaskColumn from "@/components/TaskColumn";

const mockTasks = {
  monday: [
    { id: "1", title: "Weekly Planning", tag: "work" as const },
    { id: "2", title: "Gym Session", tag: "personal" as const },
  ],
  wednesday: [
    { id: "3", title: "Client Meeting", tag: "work" as const },
    { id: "4", title: "Language Class", tag: "personal" as const },
  ],
  friday: [
    { id: "5", title: "Team Review", tag: "work" as const },
    { id: "6", title: "Movie Night", tag: "personal" as const },
  ],
};

const Weekly = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Weekly View</h1>
        <p className="text-secondary mt-2">Plan your week ahead</p>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-4">
        <TaskColumn title="Monday" tasks={mockTasks.monday} />
        <TaskColumn title="Wednesday" tasks={mockTasks.wednesday} />
        <TaskColumn title="Friday" tasks={mockTasks.friday} />
      </div>
    </div>
  );
};

export default Weekly;
