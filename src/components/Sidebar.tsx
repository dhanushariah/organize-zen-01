
import { Calendar, CheckSquare, Calendar as CalendarIcon, Clock } from "lucide-react";
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

const items = [
  {
    title: "Daily Tasks",
    path: "/",
    icon: CheckSquare,
  },
  {
    title: "Weekly",
    path: "/weekly",
    icon: Calendar,
  },
  {
    title: "Monthly",
    path: "/monthly",
    icon: CalendarIcon,
  },
  {
    title: "Next 90 Days",
    path: "/next-90",
    icon: Clock,
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <SidebarContent>
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">TaskSheet</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base px-6 mb-2">Time Frames</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.path} className="px-3 py-1">
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === item.path}
                    className="sidebar-nav-button"
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="w-6 h-6" />
                      <span className="text-base">{item.title}</span>
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
