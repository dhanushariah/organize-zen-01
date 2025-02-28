
import TaskColumn from "@/components/task/TaskColumn";

const mockTasks = [
  { id: "1", title: "Launch Product", tag: "work" },
  { id: "2", title: "Start Course", tag: "personal" },
  { id: "3", title: "Market Analysis", tag: "work" },
  { id: "4", title: "Vacation Plans", tag: "personal" },
  { id: "5", title: "Q4 Planning", tag: "work" },
  { id: "6", title: "Home Renovation", tag: "personal" },
];

const NextNinety = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Next 90 Days</h1>
        <p className="text-secondary mt-2 date-text">Long-term planning made simple</p>
      </div>
      <div className="flex justify-center">
        <TaskColumn 
          title="Next 90 Days Tasks" 
          tasks={mockTasks} 
          isLast 
          columnId="next-90"
        />
      </div>
    </div>
  );
};

export default NextNinety;
