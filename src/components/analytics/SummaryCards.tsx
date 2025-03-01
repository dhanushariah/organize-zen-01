
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Flame, Tag, Clock } from "lucide-react";
import { TagStats, TimeStats } from "@/types/analytics";

interface SummaryCardsProps {
  weeklyCompletion: number;
  currentStreak: number;
  longestStreak: number;
  tagStats: TagStats;
  timeStats: TimeStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  weeklyCompletion,
  currentStreak,
  longestStreak,
  tagStats,
  timeStats
}) => {
  const totalSeconds = Object.values(timeStats).reduce((acc, seconds) => acc + seconds, 0);
  const formattedTime = totalSeconds / 3600 < 1 
    ? `${Math.round((totalSeconds / 60) * 10) / 10} min`
    : `${Math.round((totalSeconds / 3600) * 10) / 10} hrs`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckSquare className="mr-2 h-4 w-4 text-primary" />
            Task Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyCompletion}%</div>
          <p className="text-xs text-muted-foreground">This week</p>
          <Progress 
            value={weeklyCompletion} 
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
          <div className="text-2xl font-bold">{formattedTime}</div>
          <p className="text-xs text-muted-foreground">Total time tracked</p>
        </CardContent>
      </Card>
    </div>
  );
};
