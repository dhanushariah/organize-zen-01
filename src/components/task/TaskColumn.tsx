
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTaskColumn } from "@/hooks/use-task-column";
import TaskColumnHeader from "./TaskColumnHeader";
import TaskColumnProgress from "./TaskColumnProgress";
import AddTaskInput from "./AddTaskInput";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isLast?: boolean;
  onMoveTask?: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  columnId: string;
  otherColumns?: { id: string, title: string }[];
  onTaskUpdate?: (task: Task) => void;
}

const TaskColumn = ({ 
  title, 
  tasks: initialTasks, 
  isLast, 
  onMoveTask,
  columnId,
  otherColumns = [],
  onTaskUpdate
}: TaskColumnProps) => {
  const isMobile = useIsMobile();
  
  // Use the comprehensive task column hook
  const {
    columnRef,
    tasks,
    completedTasks,
    progress,
    newTaskTitle,
    setNewTaskTitle,
    editingTask,
    setEditingTask,
    draggedTask,
    toggleTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer,
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  } = useTaskColumn({
    initialTasks,
    columnId,
    onMoveTask,
    onTaskUpdate
  });

  // Wrapper for addTask to check for empty inputs
  const onAddTask = () => {
    if (newTaskTitle.trim()) {
      handleAddTask(newTaskTitle);
      setNewTaskTitle("");
    }
  };

  return (
    <div 
      className="flex-1 min-w-[280px] md:min-w-[300px] max-w-md relative"
      ref={columnRef}
    >
      <TaskColumnHeader 
        title={title}
        progress={progress}
      />
      
      <TaskColumnProgress progress={progress} />
      
      <div className="space-y-3 md:space-y-4">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id}
            task={task}
            isCompleted={completedTasks.includes(task.id)}
            onToggle={() => toggleTask(task.id)}
            onUpdate={(newTitle) => handleUpdateTask(task.id, newTitle)}
            onDelete={() => handleDeleteTask(task.id)}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={() => handleDragEnd(task.id)}
            onMoveToColumn={(targetColumnId) => handleMoveTaskToColumn(task.id, targetColumnId)}
            onToggleTimer={() => toggleTaskTimer(task.id)}
            editingTask={editingTask === task.id}
            setEditingTask={setEditingTask}
            otherColumns={otherColumns}
            isDragging={draggedTask === task.id}
          />
        ))}
        
        <AddTaskInput 
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          onAddTask={onAddTask}
        />
      </div>
    </div>
  );
};

export default TaskColumn;
