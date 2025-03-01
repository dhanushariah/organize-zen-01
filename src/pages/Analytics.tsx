
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsData } from "@/hooks/use-analytics-data";
import { 
  getCompletionByDay, 
  getTagChartData, 
  getTimeChartData, 
  getCurrentWeekCompletion 
} from "@/utils/analytics-utils";
import { SummaryCards } from "@/components/analytics/SummaryCards";
import { CompletionChart } from "@/components/analytics/CompletionChart";
import { TagDistributionChart } from "@/components/analytics/TagDistributionChart";
import { TimeTrackingChart } from "@/components/analytics/TimeTrackingChart";
import { StreakTracker } from "@/components/analytics/StreakTracker";

// Custom theme colors for charts
const CHART_COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Amber Yellow
  '#EC4899', // Pink
  '#6366F1'  // Indigo
];

const Analytics = () => {
  const { taskHistory, currentStreak, longestStreak, tagStats, timeStats } = useAnalyticsData();
  
  // Calculate data for charts
  const completionData = getCompletionByDay(taskHistory);
  const tagChartData = getTagChartData(tagStats);
  const timeChartData = getTimeChartData(timeStats);
  const weeklyCompletion = getCurrentWeekCompletion(taskHistory);
  
  // Chart customization options
  const tagChartOptions = {
    colors: CHART_COLORS,
    showLabels: true,
    innerRadius: 30,
    outerRadius: 80,
    showLegend: true,
    showTooltip: true
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track your productivity and task completion</p>
      </div>
      
      <SummaryCards 
        weeklyCompletion={weeklyCompletion}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        tagStats={tagStats}
        timeStats={timeStats}
      />
      
      <Tabs defaultValue="completion" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="completion">Task Completion</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completion" className="mt-4">
          <CompletionChart data={completionData} />
        </TabsContent>
        
        <TabsContent value="tags" className="mt-4">
          <TagDistributionChart 
            data={tagChartData}
            title="Task Distribution by Tag"
            description="Breakdown of tasks by tag category"
            {...tagChartOptions}
          />
        </TabsContent>
        
        <TabsContent value="time" className="mt-4">
          <TimeTrackingChart data={timeChartData} />
        </TabsContent>
      </Tabs>
      
      <StreakTracker 
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        taskHistory={taskHistory}
      />
    </div>
  );
};

export default Analytics;
