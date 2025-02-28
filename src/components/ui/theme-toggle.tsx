
"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        // No-op as we only support light theme
        console.log("Light theme is the only option available");
      }}
    >
      <Moon className="h-4 w-4" />
      <span className="sr-only">Theme is set to light</span>
    </Button>
  )
}
