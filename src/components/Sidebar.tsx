
import { Calendar, CheckSquare, Calendar as CalendarIcon, Clock, BarChart, Settings, LogOut, Crown, Heart } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
    <div className={`sidebar-container ${isMobile ? "mobile-sidebar" : "desktop-sidebar"}`}>
      {!isMobile && (
        <div className="sidebar-header">
          <h1 className="text-2xl font-bold text-primary flex items-center">
            TaskSheet
            <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Pro</span>
          </h1>
        </div>
      )}
      
      <div className="sidebar-content">
        <div className="sidebar-group">
          <h3 className={`sidebar-group-label ${isMobile ? "mobile-group-label" : ""}`}>
            Time Frames
          </h3>
          
          <nav className={`sidebar-nav ${isMobile ? "mobile-sidebar-nav" : ""}`}>
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-link ${location.pathname === item.path ? "active" : ""} ${isMobile ? "mobile-nav-link" : ""}`}
                onClick={handleItemClick}
              >
                <item.icon className="sidebar-icon" />
                <span className="sidebar-link-text">{item.title}</span>
              </Link>
            ))}
            
            {/* Upgrade to Pro Button */}
            <Link
              to="/settings"
              className={`sidebar-nav-link upgrade-pro ${isMobile ? "mobile-nav-link" : ""}`}
              onClick={handleItemClick}
            >
              <Crown className="sidebar-icon" />
              <span className="sidebar-link-text">Upgrade to Pro</span>
            </Link>
            
            <Link
              to="/settings"
              className={`sidebar-nav-link ${location.pathname === "/settings" ? "active" : ""} ${isMobile ? "mobile-nav-link" : ""}`}
              onClick={handleItemClick}
            >
              <Settings className="sidebar-icon" />
              <span className="sidebar-link-text">Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className={`sidebar-nav-link logout ${isMobile ? "mobile-nav-link" : ""}`}
            >
              <LogOut className="sidebar-icon" />
              <span className="sidebar-link-text">Logout</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Footer with attribution */}
      <div className="sidebar-footer">
        <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by NEO TECHINFRA
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
