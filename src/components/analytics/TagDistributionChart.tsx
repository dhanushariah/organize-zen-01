
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TagChartData } from "@/types/analytics";

interface TagDistributionChartProps {
  data: TagChartData[];
  title?: string;
  description?: string;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  labelFormatter?: (name: string, percent: number) => string;
}

export const TagDistributionChart: React.FC<TagDistributionChartProps> = ({ 
  data,
  title = "Task Distribution by Tag",
  description = "Number of tasks per tag",
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 80,
  labelFormatter = (name, percent) => `${name}: ${(percent * 100).toFixed(0)}%`,
}) => {
  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No tag data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={showLabels}
                label={showLabels ? ({ name, percent }) => labelFormatter(name, percent) : undefined}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    stroke="var(--background)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              {showTooltip && (
                <Tooltip 
                  formatter={(value) => [value, 'Tasks']}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)"
                  }}
                />
              )}
              {showLegend && (
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '10px' }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
