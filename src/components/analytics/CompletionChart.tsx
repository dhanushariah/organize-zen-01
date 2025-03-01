
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { CompletionData } from "@/types/analytics";

interface CompletionChartProps {
  data: CompletionData[];
}

export const CompletionChart: React.FC<CompletionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Rate</CardTitle>
        <CardDescription>Daily task completion over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
  );
};
