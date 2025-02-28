
import { useDailyTasks } from "@/hooks/use-daily-tasks";
import DailyHeader from "@/components/daily/DailyHeader";
import TaskColumns from "@/components/daily/TaskColumns";

const Daily = () => {
  const {
    currentDate,
    activeTab,
    setActiveTab,
    handlePreviousDay,
    handleNextDay,
    handleMoveTask,
    handleTaskUpdate,
    isToday,
    displayTasks,
    columns
  } = useDailyTasks();

  return (
    <div className="space-y-8">
      <DailyHeader 
        currentDate={currentDate}
        isToday={isToday}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
      />
      
      <TaskColumns 
        columns={columns}
        displayTasks={displayTasks}
        activeTab={activeTab}
        handleMoveTask={handleMoveTask}
        handleTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default Daily;
