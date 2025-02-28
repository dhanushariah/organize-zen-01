
import { Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme } = useTheme();

  // Since we only support light theme, this toggle button is just for display
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        // No-op since we only support light theme
        console.log("Light theme is the only option available");
      }}
      className="fixed top-4 right-4 z-50"
    >
      <Moon className="h-5 w-5" />
      <span className="sr-only">Theme is set to light</span>
    </Button>
  );
}
