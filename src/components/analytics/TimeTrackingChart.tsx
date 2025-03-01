
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TimeChartData } from "@/types/analytics";

interface TimeTrackingChartProps {
  data: TimeChartData[];
}

export const TimeTrackingChart: React.FC<TimeTrackingChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracked</CardTitle>
        <CardDescription>Hours tracked per day</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
  );
};
