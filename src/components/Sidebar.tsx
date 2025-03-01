
import { Calendar, CheckSquare, Calendar as CalendarIcon, Clock, BarChart, Settings, LogOut, Crown, Heart } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

const items = [
  {
    title: "Daily Tasks",
    path: "/",
    icon: CheckSquare,
  },
  {
    title: "Weekly Tasks",
    path: "/weekly",
    icon: Calendar,
  },
  {
    title: "Monthly Tasks",
    path: "/monthly",
    icon: CalendarIcon,
  },
  {
    title: "Next 90 Days",
    path: "/next-90",
    icon: Clock,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart,
  },
];

const Sidebar = ({ isMobile = false, onNavigate, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth");
    if (onClose) onClose();
  };

  const handleItemClick = () => {
    if (onNavigate) onNavigate();
    if (onClose) onClose();
  };

  return (
    <SidebarContainer 
      className={isMobile ? "w-full border-none mobile-sidebar bg-background" : ""} 
      data-mobile={isMobile}
    >
      <SidebarContent className="bg-background">
        {!isMobile && (
          <div className="px-6 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              TaskSheet
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Pro</span>
            </h1>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className={`text-base px-6 mb-2 underline decoration-2 underline-offset-4 ${isMobile ? "opacity-100" : ""}`}>
            Time Frames
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={isMobile ? "mobile-sidebar-menu flex flex-col gap-1" : ""}>
              {items.map((item) => (
                <SidebarMenuItem key={item.path} className={isMobile ? "px-6 py-2 block" : "px-3 py-1"}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.path}
                    className={`sidebar-nav-button ${isMobile ? "h-10 mobile-nav-button" : ""}`}
                  >
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-3"
                      onClick={handleItemClick}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className={`text-base ${isMobile ? "font-medium" : ""}`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Upgrade to Pro Button */}
              <SidebarMenuItem className={isMobile ? "px-6 py-2 mt-6 block" : "px-3 py-1 mt-10"}>
                <SidebarMenuButton
                  asChild
                  className={`sidebar-nav-button upgrade-pro-button ${isMobile ? "h-10 mobile-nav-button" : ""}`}
                >
                  <Link 
                    to="/settings"
                    className="flex items-center gap-3"
                    onClick={handleItemClick}
                  >
                    <Crown className="w-5 h-5" />
                    <span className={`text-base ${isMobile ? "font-medium" : ""}`}>Upgrade to Pro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem className={isMobile ? "px-6 py-2 block" : "px-3 py-1"}>
                <SidebarMenuButton
                  asChild
                  data-active={location.pathname === "/settings"}
                  className={`sidebar-nav-button ${isMobile ? "h-10 mobile-nav-button" : ""}`}
                >
                  <Link 
                    to="/settings"
                    className="flex items-center gap-3"
                    onClick={handleItemClick}
                  >
                    <Settings className="w-5 h-5" />
                    <span className={`text-base ${isMobile ? "font-medium" : ""}`}>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className={isMobile ? "px-6 py-2 block" : "px-3 py-1"}>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className={`sidebar-nav-button w-full ${isMobile ? "h-10 mobile-nav-button" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span className={`text-base ${isMobile ? "font-medium" : ""}`}>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer with attribution */}
      <SidebarFooter className="px-3 py-3 mt-auto border-t">
        <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by NEO TECHINFRA
          </div>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
