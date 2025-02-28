
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  isMobileVersion?: boolean;
}

const Layout = ({ isMobileVersion = false }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const shouldUseMobileLayout = isMobileVersion || isMobile;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground transition-colors font-poppins">
        {!shouldUseMobileLayout ? (
          // Desktop layout
          <>
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 animate-fade-in">
              <div className="fixed top-4 right-4 z-50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="bg-background"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
              <Outlet />
            </main>
          </>
        ) : (
          // Mobile layout
          <>
            <div className="w-full">
              <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="mr-2">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[80%] sm:w-[350px]">
                      <Sidebar isMobile={true} onNavigate={() => setIsSidebarOpen(false)} />
                    </SheetContent>
                  </Sheet>
                  
                  <div className="flex-1 text-center">
                    <h1 className="text-xl font-bold">TaskSheet</h1>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="ml-2"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </header>
              
              <main className="container py-4 px-2 animate-fade-in">
                <Outlet />
              </main>
            </div>
          </>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
