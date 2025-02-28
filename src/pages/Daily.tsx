
import TaskColumn from "@/components/task/TaskColumn";
import { format, subDays } from "date-fns";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { Task } from "@/types/task";

type ColumnTasks = {
  [key: string]: Task[];
};

type TaskHistory = {
  date: string;
  tasks: ColumnTasks;
}

const initialTasks = {
  nonNegotiables: [
    { id: "1", title: "Morning Exercise", tag: "personal" },
    { id: "2", title: "Team Stand-up", tag: "work" },
  ],
  today: [
    { id: "3", title: "Project Meeting", tag: "work" },
    { id: "4", title: "Grocery Shopping", tag: "personal" },
  ],
  priority: [
    { id: "5", title: "Client Presentation", tag: "work" },
    { id: "6", title: "Doctor's Appointment", tag: "personal" },
  ],
};

const Daily = () => {
  const [tasks, setTasks] = useState<ColumnTasks>(initialTasks);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const dateString = format(currentDate, "EEEE, MMMM do, yyyy");
  
  useEffect(() => {
    const savedHistory = localStorage.getItem('taskHistory');
    if (savedHistory) {
      try {
        setTaskHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse task history", e);
      }
    }
  }, []);
  
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const historyIndex = taskHistory.findIndex(h => h.date === today);
    
    let updatedHistory = [...taskHistory];
    if (historyIndex >= 0) {
      updatedHistory[historyIndex] = {
        date: today,
        tasks: { ...tasks }
      };
    } else {
      updatedHistory.push({
        date: today,
        tasks: { ...tasks }
      });
    }
    
    if (updatedHistory.length > 30) {
      updatedHistory = updatedHistory.slice(-30);
    }
    
    setTaskHistory(updatedHistory);
    localStorage.setItem('taskHistory', JSON.stringify(updatedHistory));
  }, [tasks]);
  
  const handlePreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
    setActiveTab("history");
  };
  
  const handleNextDay = () => {
    const tomorrow = subDays(new Date(), -1);
    if (currentDate < tomorrow) {
      setCurrentDate(prev => subDays(prev, -1));
    } else {
      setCurrentDate(new Date());
      setActiveTab("today");
    }
  };

  const handleMoveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    const taskToMove = tasks[sourceColumnId].find(task => task.id === taskId);
    
    if (!taskToMove) return;
    
    const updatedTasks = { ...tasks };
    
    updatedTasks[sourceColumnId] = tasks[sourceColumnId].filter(task => task.id !== taskId);
    
    updatedTasks[targetColumnId] = [...tasks[targetColumnId], taskToMove];
    
    setTasks(updatedTasks);
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = { ...tasks };
    
    Object.keys(updatedTasks).forEach(columnId => {
      const columnTasks = updatedTasks[columnId];
      const taskIndex = columnTasks.findIndex(task => task.id === updatedTask.id);
      
      if (taskIndex >= 0) {
        if ('deleted' in updatedTask) {
          updatedTasks[columnId] = columnTasks.filter(task => task.id !== updatedTask.id);
        } else {
          updatedTasks[columnId][taskIndex] = updatedTask;
        }
      }
    });
    
    setTasks(updatedTasks);
  };

  const columns = [
    { id: "nonNegotiables", title: "Non-negotiables" },
    { id: "today", title: "Today" },
    { id: "priority", title: "Priority" }
  ];
  
  const getHistoricalTasks = () => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const historyEntry = taskHistory.find(h => h.date === dateKey);
    return historyEntry?.tasks || {
      nonNegotiables: [],
      today: [],
      priority: []
    };
  };
  
  const displayTasks = activeTab === "today" ? tasks : getHistoricalTasks();
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Daily Tasks</h1>
        <div className="flex items-center justify-center mt-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePreviousDay}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-secondary date-text px-2">{dateString}</p>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextDay}
            disabled={isToday}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="mx-auto">
            <TabsTrigger value="today" disabled={!isToday}>
              Today
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-1" />
              History
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex gap-8 overflow-x-auto pb-4 relative">
        {columns.map((column, index) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            tasks={displayTasks[column.id] || []}
            isLast={index === columns.length - 1}
            onMoveTask={activeTab === "today" ? handleMoveTask : undefined}
            columnId={column.id}
            otherColumns={activeTab === "today" ? columns.filter(c => c.id !== column.id) : []}
            onTaskUpdate={activeTab === "today" ? handleTaskUpdate : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Daily;
