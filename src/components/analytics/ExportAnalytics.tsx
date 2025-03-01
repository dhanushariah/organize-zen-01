
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DownloadIcon,
  FileTextIcon,
  TagIcon, 
  ClockIcon,
  DatabaseIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { TaskHistory, TagStats, TimeStats } from "@/types/analytics";
import { 
  downloadCSV,
  generateTaskCompletionCSV,
  generateTagDistributionCSV,
  generateTimeTrackingCSV,
  generateFullTaskHistoryCSV
} from "@/utils/csv-export";

interface ExportAnalyticsProps {
  taskHistory: TaskHistory[];
  tagStats: TagStats;
  timeStats: TimeStats;
}

export const ExportAnalytics: React.FC<ExportAnalyticsProps> = ({
  taskHistory,
  tagStats,
  timeStats
}) => {
  const { toast } = useToast();
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const handleExport = (type: string) => {
    try {
      switch (type) {
        case "completion":
          downloadCSV(
            `task-completion-${currentDate}.csv`,
            generateTaskCompletionCSV(taskHistory)
          );
          break;
        case "tags":
          downloadCSV(
            `tag-distribution-${currentDate}.csv`,
            generateTagDistributionCSV(tagStats)
          );
          break;
        case "time":
          downloadCSV(
            `time-tracking-${currentDate}.csv`,
            generateTimeTrackingCSV(timeStats)
          );
          break;
        case "full":
          downloadCSV(
            `full-task-history-${currentDate}.csv`,
            generateFullTaskHistoryCSV(taskHistory)
          );
          break;
        default:
          throw new Error("Invalid export type");
      }
      
      toast({
        title: "Export successful",
        description: `Data exported as a CSV file.`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Could not export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Export Analytics Data</h2>
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleExport("completion")}
        >
          <FileTextIcon size={16} />
          Task Completion
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleExport("tags")}
        >
          <TagIcon size={16} />
          Tag Distribution
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleExport("time")}
        >
          <ClockIcon size={16} />
          Time Tracking
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleExport("full")}
        >
          <DatabaseIcon size={16} />
          Full History
        </Button>
      </div>
    </div>
  );
};
