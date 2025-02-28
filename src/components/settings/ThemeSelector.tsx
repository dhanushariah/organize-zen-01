
import { useTheme } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Theme</h2>
      <Separator className="mb-4" />
      
      <div className="space-y-4">
        <p className="text-muted-foreground">Choose your preferred theme</p>
        
        <RadioGroup 
          value={theme} 
          onValueChange={(value) => setTheme(value as "light" | "dark")}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="light" 
              id="light" 
              className="sr-only" 
            />
            <Label 
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
            >
              <Sun className="mb-2 h-6 w-6" />
              <span>Light</span>
            </Label>
          </div>

          <div>
            <RadioGroupItem 
              value="dark" 
              id="dark" 
              className="sr-only" 
            />
            <Label 
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
            >
              <Moon className="mb-2 h-6 w-6" />
              <span>Dark</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};
