
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Flag, Edit, Check, Trash2, Palette, MoveHorizontal, ArrowRightLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  tag: string;
  tagColor?: string;
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isLast?: boolean;
  onMoveTask?: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  columnId: string;
  otherColumns?: { id: string, title: string }[];
}

const DEFAULT_TAGS = ["work", "personal", "home", "study", "health"];
const TAG_COLORS = ["red", "blue", "green", "purple", "yellow", "pink", "indigo", "teal"];

const TaskColumn = ({ 
  title, 
  tasks: initialTasks, 
  isLast, 
  onMoveTask,
  columnId,
  otherColumns = []
}: TaskColumnProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(DEFAULT_TAGS);
  const [newTagName, setNewTagName] = useState("");
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (tasks.length > 0) {
      const newProgress = (completedTasks.length / tasks.length) * 100;
      setProgress(newProgress);
    } else {
      setProgress(0);
    }
  }, [completedTasks, tasks]);

  // Initialize drag events
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (columnRef.current) {
        columnRef.current.classList.add('task-drop-target');
      }
    };

    const handleDragLeave = () => {
      if (columnRef.current) {
        columnRef.current.classList.remove('task-drop-target');
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (columnRef.current) {
        columnRef.current.classList.remove('task-drop-target');
      }

      const taskId = e.dataTransfer?.getData('text/plain');
      const sourceColumn = e.dataTransfer?.getData('source-column');
      
      if (taskId && sourceColumn && sourceColumn !== columnId && onMoveTask) {
        onMoveTask(taskId, sourceColumn, columnId);
      }
    };

    const column = columnRef.current;
    if (column) {
      column.addEventListener('dragover', handleDragOver);
      column.addEventListener('dragleave', handleDragLeave);
      column.addEventListener('drop', handleDrop);

      return () => {
        column.removeEventListener('dragover', handleDragOver);
        column.removeEventListener('dragleave', handleDragLeave);
        column.removeEventListener('drop', handleDrop);
      };
    }
  }, [columnId, onMoveTask]);

  useEffect(() => {
    // Update tasks when initialTasks changes
    setTasks(initialTasks);
  }, [initialTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev =>
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: `${Date.now()}`,
        title: newTaskTitle,
        tag: "personal"
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const handleUpdateTask = (taskId: string, newTitle: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, title: newTitle }
        : task
    ));
    setEditingTask(null);
  };

  const handleUpdateTag = (taskId: string, newTag: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, tag: newTag }
        : task
    ));
    setEditingTag(null);
    setShowColorPicker(false);
  };

  const handleUpdateTagColor = (taskId: string, color: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, tagColor: color }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
  };

  const handleAddNewTag = () => {
    if (newTagName.trim() && !availableTags.includes(newTagName.toLowerCase())) {
      setAvailableTags([...availableTags, newTagName.toLowerCase()]);
      setNewTagName("");
      setAddingNewTag(false);
    }
  };

  const handleDeleteTag = (tagToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAvailableTags(availableTags.filter(tag => tag !== tagToDelete));
    
    // Update tasks with the deleted tag to use 'personal' tag instead
    setTasks(tasks.map(task => 
      task.tag === tagToDelete 
        ? { ...task, tag: "personal" }
        : task
    ));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.setData('source-column', columnId);
    setDraggedTask(taskId);
    
    // Add a slight delay for visual feedback
    setTimeout(() => {
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.classList.add('task-dragging');
      }
    }, 0);
  };

  const handleDragEnd = (taskId: string) => {
    setDraggedTask(null);
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
      taskElement.classList.remove('task-dragging');
    }
  };

  const closeTagEditor = () => {
    setEditingTag(null);
    setShowColorPicker(false);
    setAddingNewTag(false);
  };

  const handleMoveTaskToColumn = (taskId: string, targetColumnId: string) => {
    if (onMoveTask) {
      onMoveTask(taskId, columnId, targetColumnId);
    }
  };

  return (
    <div 
      className="flex-1 min-w-[280px] md:min-w-[300px] max-w-md relative"
      ref={columnRef}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
        {progress === 100 && (
          <div className="flex items-center">
            <Flag className="h-5 w-5 text-primary mr-1" />
            <span className="text-sm text-primary font-medium">Complete!</span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <Progress 
          value={progress} 
          className={`h-2 rounded-full overflow-hidden ${progress > 0 ? 'progress-bar-glow' : ''}`}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className="task-card p-3 md:p-4 cursor-move"
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={() => handleDragEnd(task.id)}
            id={`task-${task.id}`}
          >
            <div className="flex items-start gap-2 md:gap-3">
              <Checkbox
                id={task.id}
                checked={completedTasks.includes(task.id)}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <div className="flex flex-1 items-start justify-between">
                {editingTask === task.id ? (
                  <Input
                    defaultValue={task.title}
                    onBlur={(e) => handleUpdateTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateTask(task.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                    className="text-sm md:text-base"
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={task.id}
                        className={`font-medium cursor-pointer text-sm md:text-base ${
                          completedTasks.includes(task.id) ? "line-through text-muted-foreground" : ""
                        }`}
                        onClick={() => setEditingTask(task.id)}
                      >
                        {task.title}
                      </label>
                      {otherColumns && otherColumns.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                            >
                              <ArrowRightLeft className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {otherColumns.map(column => (
                              <DropdownMenuItem 
                                key={column.id}
                                onClick={() => handleMoveTaskToColumn(task.id, column.id)}
                              >
                                Move to {column.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {editingTag === task.id ? (
                        <div className="flex flex-col gap-2 relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Select Tag</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5"
                              onClick={closeTagEditor}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {availableTags.map(tag => (
                              <Button 
                                key={tag}
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleUpdateTag(task.id, tag)}
                                className="h-6 px-2 text-xs flex items-center gap-1"
                              >
                                {tag}
                                <Trash2 
                                  className="h-3 w-3 text-destructive" 
                                  onClick={(e) => handleDeleteTag(tag, e)}
                                />
                              </Button>
                            ))}
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => setAddingNewTag(true)}
                              className="h-6 px-2 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              New
                            </Button>
                          </div>
                          
                          {addingNewTag && (
                            <div className="flex items-center gap-1 mt-1">
                              <Input
                                placeholder="Tag name"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="h-6 text-xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddNewTag();
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleAddNewTag}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => setShowColorPicker(!showColorPicker)}
                              className="h-6 px-2 text-xs flex items-center w-full justify-between"
                            >
                              <span className="flex items-center">
                                <Palette className="h-3 w-3 mr-1" />
                                Choose Color
                              </span>
                              {showColorPicker ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                            </Button>
                          </div>
                          
                          {showColorPicker && (
                            <div className="mt-1 p-2 bg-background rounded-md border border-border">
                              <div className="flex flex-wrap gap-2">
                                {TAG_COLORS.map(color => (
                                  <Button 
                                    key={color}
                                    variant="outline" 
                                    className={`h-8 w-8 p-0 tag-${color}`}
                                    onClick={() => handleUpdateTagColor(task.id, color)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span 
                            className={`tag ${task.tagColor ? `tag-${task.tagColor}` : `tag-${task.tag}`} cursor-pointer flex items-center`}
                            onClick={() => setEditingTag(task.id)}
                          >
                            {task.tag}
                            <Edit className="ml-1 h-3 w-3" />
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskTitle.trim()) {
                handleAddTask();
              }
            }}
            className="text-sm md:text-base"
          />
          <Button 
            size="icon" 
            onClick={handleAddTask} 
            disabled={!newTaskTitle.trim()}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 h-[70%]">
          <Separator orientation="vertical" className="h-full" />
        </div>
      )}
    </div>
  );
};

export default TaskColumn;
