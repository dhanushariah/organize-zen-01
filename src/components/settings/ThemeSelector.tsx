
import { useTheme } from "@/components/theme-provider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Laptop } from "lucide-react";

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
          onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem 
              value="light" 
              id="light" 
              className="sr-only" 
            />
            <Label 
              htmlFor="light"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'light' ? 'border-primary' : ''}`}
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
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'dark' ? 'border-primary' : ''}`}
            >
              <Moon className="mb-2 h-6 w-6" />
              <span>Dark</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem 
              value="system" 
              id="system" 
              className="sr-only" 
            />
            <Label 
              htmlFor="system"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${theme === 'system' ? 'border-primary' : ''}`}
            >
              <Laptop className="mb-2 h-6 w-6" />
              <span>System</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};
