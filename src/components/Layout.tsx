
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

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

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/");
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
              <div className="w-6" />
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="p-0 border-r">
              <Sidebar isMobile onNavigate={handleNavigate} onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="fixed top-4 right-16 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="mr-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>

          <ThemeToggle />

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
