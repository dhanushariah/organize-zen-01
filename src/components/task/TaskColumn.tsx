
import { useRef } from "react";
import { Task } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTaskState } from "@/hooks/task-column/use-task-state";
import { useTaskActions } from "@/hooks/task-column/use-task-actions";
import { useDragDrop } from "@/hooks/task-column/use-drag-drop";
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
  const columnRef = useRef<HTMLDivElement>(null);
  
  // Use the state hook
  const {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    progress,
    newTaskTitle,
    setNewTaskTitle,
    editingTask,
    setEditingTask,
    draggedTask,
    setDraggedTask
  } = useTaskState(initialTasks);

  // Use the actions hook
  const {
    toggleTask,
    handleAddTask: addTask,
    handleUpdateTask,
    handleDeleteTask,
    toggleTaskTimer
  } = useTaskActions({
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    onTaskUpdate
  });

  // Use the drag and drop hook
  const {
    handleDragStart,
    handleDragEnd,
    handleMoveTaskToColumn
  } = useDragDrop({
    columnId,
    columnRef,
    onMoveTask
  });

  // Wrapper for addTask to use the current newTaskTitle
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
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
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
};

export default TaskColumn;
