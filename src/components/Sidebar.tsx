
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
    title: "Weekly View",
    path: "/weekly",
    icon: Calendar,
  },
  {
    title: "Monthly Plan",
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
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Time Frames</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    active={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
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
