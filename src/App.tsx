
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";
import Layout from "./components/Layout";
import Daily from "./pages/Daily";
import Weekly from "./pages/Weekly";
import Monthly from "./pages/Monthly";
import NextNinety from "./pages/NextNinety";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isMobileVersion, setIsMobileVersion] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  // Check screen size on mount to set appropriate default
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileVersion(isMobile);
      setShowToggle(true); // Only show toggle after we've checked screen size
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className={isMobileVersion ? 'mobile-view' : 'desktop-view'}>
          {showToggle && (
            <div className="fixed bottom-4 right-4 z-50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileVersion(!isMobileVersion)}
                className="bg-background shadow-lg"
              >
                {isMobileVersion ? (
                  <Monitor className="h-4 w-4 mr-2" />
                ) : (
                  <Smartphone className="h-4 w-4 mr-2" />
                )}
                {isMobileVersion ? "Desktop View" : "Mobile View"}
              </Button>
            </div>
          )}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout isMobileVersion={isMobileVersion} />}>
                <Route index element={<Daily />} />
                <Route path="weekly" element={<Weekly />} />
                <Route path="monthly" element={<Monthly />} />
                <Route path="next-90" element={<NextNinety />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
