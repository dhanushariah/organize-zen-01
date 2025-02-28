
import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Menu, ChevronLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    navigate("/auth");
  };

  useEffect(() => {
    // Close sidebar on resize if mobile
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {!isMobile && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {isMobile && (
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
              <h1 className="text-xl font-bold text-primary">TaskSheet</h1>
              <div className="flex gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="flex justify-end items-center p-4 border-b">
              <div className="flex gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="p-0 border-r w-[80%] max-w-[300px]">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h1 className="text-xl font-bold text-primary">TaskSheet</h1>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar isMobile onNavigate={handleNavigate} onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
