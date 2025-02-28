
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, differenceInDays, isAfter, isBefore, addDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckSquare, Clock, Tag, Flame } from "lucide-react";
import { 
  Chart,
  ChartContainer, 
  ChartTitle, 
  ChartTooltip, 
  ChartLegend,
  ChartContent,
  ChartStatusIndicator,
  ChartError,
  ChartTooltipContent,
  ChartAxisOptions,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";

// Types for our data
type Task = {
  id: string;
  title: string;
  tag: string;
  tagColor?: string;
  startTime?: Date;
  endTime?: Date;
  timerRunning?: boolean;
  duration?: number;
  deleted?: boolean;
};

type ColumnTasks = {
  [key: string]: Task[];
};

type TaskHistory = {
  date: string;
  tasks: ColumnTasks;
};

const Analytics = () => {
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [tagStats, setTagStats] = useState<{[key: string]: number}>({});
  const [timeStats, setTimeStats] = useState<{[key: string]: number}>({});
  
  // Load history and calculate stats
  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('taskHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory) as TaskHistory[];
        setTaskHistory(history);
        
        // Calculate streaks
        calculateStreaks(history);
        
        // Calculate tag statistics
        calculateTagStats(history);
        
        // Calculate time spent statistics
        calculateTimeStats(history);
      } catch (e) {
        console.error("Failed to parse task history", e);
      }
    }
  }, []);
  
  // Calculate streaks (days with at least one completed task)
  const calculateStreaks = (history: TaskHistory[]) => {
    // Sort history by date
    const sortedHistory = [...history].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let currentStreak = 0;
    let maxStreak = 0;
    let previousDate: Date | null = null;
    
    sortedHistory.forEach(entry => {
      const entryDate = new Date(entry.date);
      const hasCompletedTasks = Object.values(entry.tasks)
        .flat()
        .some(task => task.endTime);
      
      if (hasCompletedTasks) {
        // If this is first entry or consecutive with previous date
        if (!previousDate || differenceInDays(entryDate, previousDate) === 1) {
          currentStreak++;
        } else if (differenceInDays(entryDate, previousDate) > 1) {
          // Streak broken
          currentStreak = 1;
        }
        
        maxStreak = Math.max(maxStreak, currentStreak);
        previousDate = entryDate;
      } else if (previousDate && differenceInDays(entryDate, previousDate) > 1) {
        // Day with no completed tasks breaks the streak
        currentStreak = 0;
      }
    });
    
    setCurrentStreak(currentStreak);
    setLongestStreak(maxStreak);
  };
  
  // Calculate tag statistics
  const calculateTagStats = (history: TaskHistory[]) => {
    const stats: {[key: string]: number} = {};
    
    history.forEach(entry => {
      Object.values(entry.tasks).flat().forEach(task => {
        if (task.tag) {
          stats[task.tag] = (stats[task.tag] || 0) + 1;
        }
      });
    });
    
    setTagStats(stats);
  };
  
  // Calculate time spent statistics
  const calculateTimeStats = (history: TaskHistory[]) => {
    const stats: {[key: string]: number} = {};
    
    history.forEach(entry => {
      const date = format(new Date(entry.date), 'yyyy-MM-dd');
      let totalDuration = 0;
      
      Object.values(entry.tasks).flat().forEach(task => {
        if (task.duration) {
          totalDuration += task.duration;
        } else if (task.startTime && task.endTime) {
          const duration = (new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / 1000;
          totalDuration += duration;
        }
      });
      
      stats[date] = totalDuration;
    });
    
    setTimeStats(stats);
  };
  
  // Calculate task completion percentages by day
  const getCompletionByDay = () => {
    return taskHistory.map(entry => {
      const tasks = Object.values(entry.tasks).flat();
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.endTime).length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        date: format(new Date(entry.date), 'MMM dd'),
        completion: Math.round(completionRate),
        tasks: totalTasks
      };
    }).sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).slice(0, 7).reverse();
  };
  
  // Calculate task statistics by tag
  const getTagChartData = () => {
    const data = Object.entries(tagStats).map(([tag, count]) => ({
      name: tag,
      value: count
    }));
    
    return data.sort((a, b) => b.value - a.value);
  };
  
  // Calculate time spent data for chart
  const getTimeChartData = () => {
    return Object.entries(timeStats)
      .map(([date, seconds]) => ({
        date: format(new Date(date), 'MMM dd'),
        hours: Math.round((seconds / 3600) * 10) / 10
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
  };
  
  // Get current week's completion rate
  const getCurrentWeekCompletion = () => {
    const today = new Date();
    const startDay = startOfWeek(today);
    const endDay = endOfWeek(today);
    
    const weekEntries = taskHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return !isBefore(entryDate, startDay) && !isAfter(entryDate, endDay);
    });
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    weekEntries.forEach(entry => {
      const tasks = Object.values(entry.tasks).flat();
      totalTasks += tasks.length;
      completedTasks += tasks.filter(task => task.endTime).length;
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // COLORS for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track your productivity and task completion</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckSquare className="mr-2 h-4 w-4 text-primary" />
              Task Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrentWeekCompletion()}%</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <Progress 
              value={getCurrentWeekCompletion()} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flame className="mr-2 h-4 w-4 text-primary" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Best: {longestStreak} days</p>
            <Progress 
              value={longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Tag className="mr-2 h-4 w-4 text-primary" />
              Top Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(tagStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([tag, count]) => (
                  <Badge key={tag} variant="outline" className="mr-1">
                    {tag} ({count})
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Time Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(timeStats).reduce((acc, seconds) => acc + seconds, 0) / 3600 < 1 
                ? `${Math.round((Object.values(timeStats).reduce((acc, seconds) => acc + seconds, 0) / 60) * 10) / 10} min`
                : `${Math.round((Object.values(timeStats).reduce((acc, seconds) => acc + seconds, 0) / 3600) * 10) / 10} hrs`
              }
            </div>
            <p className="text-xs text-muted-foreground">Total time tracked</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="completion" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="completion">Task Completion</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>Daily task completion over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCompletionByDay()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value}%`}/>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, 'Completion']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="completion" 
                    name="Completion Rate" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tags" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution by Tag</CardTitle>
              <CardDescription>Number of tasks per tag</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getTagChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getTagChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracked</CardTitle>
              <CardDescription>Hours tracked per day</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getTimeChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value}h`} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} hours`, 'Time Tracked']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    name="Hours" 
                    stroke="#82ca9d" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Streak Tracking</CardTitle>
          <CardDescription>Your task completion streak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Current Streak</h3>
              <div className="flex items-center mt-1">
                <Flame className="h-5 w-5 mr-2 text-red-500" />
                <span className="text-2xl font-bold">{currentStreak} days</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Longest Streak</h3>
              <div className="flex items-center mt-1">
                <Flame className="h-5 w-5 mr-2 text-orange-500" />
                <span className="text-2xl font-bold">{longestStreak} days</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Last 7 Days</h3>
            <div className="flex gap-1">
              {Array.from({length: 7}).map((_, i) => {
                const date = format(addDays(new Date(), -6 + i), 'yyyy-MM-dd');
                const entry = taskHistory.find(h => h.date === date);
                const hasCompletedTasks = entry && Object.values(entry.tasks)
                  .flat()
                  .some(task => task.endTime);
                
                return (
                  <div 
                    key={i} 
                    className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs ${
                      hasCompletedTasks ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                    title={format(addDays(new Date(), -6 + i), 'MMM dd, yyyy')}
                  >
                    {format(addDays(new Date(), -6 + i), 'dd')}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
