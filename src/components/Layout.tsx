
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  isMobileVersion?: boolean;
}

const Layout = ({ isMobileVersion }: LayoutProps) => {
  const isMobile = isMobileVersion !== undefined ? isMobileVersion : useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {!isMobile && <Sidebar />}

        <div className="flex-1 p-4 md:p-6">
          {isMobile && (
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
              <h1 className="text-xl font-bold">TaskSheet</h1>
              <ThemeToggle />
            </div>
          )}

          {!isMobile && (
            <div className="flex justify-end mb-6">
              <ThemeToggle />
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="p-0 border-r">
              <Sidebar isMobile onNavigate={handleNavigate} onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
