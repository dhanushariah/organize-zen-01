
import { useTheme } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sun } from "lucide-react";

export const ThemeSelector = () => {
  const { theme } = useTheme();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Theme</h2>
      <Separator className="mb-4" />
      
      <div className="space-y-4">
        <p className="text-muted-foreground">Light theme is enabled by default</p>
        
        <RadioGroup 
          value={theme} 
          className="grid grid-cols-1 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="light" 
              id="light" 
              className="sr-only" 
              checked
              disabled
            />
            <Label 
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-popover p-4 cursor-pointer"
            >
              <Sun className="mb-2 h-6 w-6" />
              <span>Light</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};
