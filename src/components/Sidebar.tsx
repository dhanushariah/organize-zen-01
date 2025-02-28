
import { Calendar, CheckSquare, Calendar as CalendarIcon, Clock, BarChart, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
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
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  }
];

const Sidebar = ({ isMobile = false, onNavigate }: SidebarProps) => {
  const location = useLocation();

  return (
    <SidebarContainer className={isMobile ? "w-full border-none mobile-sidebar" : ""}>
      <SidebarContent>
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">TaskSheet</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base px-6 mb-2 underline decoration-2 underline-offset-4">
            Time Frames
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={isMobile ? "flex flex-col gap-4 py-4" : ""}>
              {items.map((item) => (
                <SidebarMenuItem key={item.path} className={isMobile ? "px-6 py-2" : "px-3 py-1"}>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.path}
                    className={`sidebar-nav-button ${isMobile ? "h-10" : ""}`}
                  >
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-3"
                      onClick={onNavigate}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className={`text-base ${isMobile ? "font-medium" : ""}`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
