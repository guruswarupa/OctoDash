import { useLocation } from "wouter";
import {
  Home,
  Gauge,
  Thermometer,
  FileText,
  Camera,
  Video,
  Terminal,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Control", url: "/control", icon: Gauge },
  { title: "Temperature", url: "/temperature", icon: Thermometer },
  { title: "Files", url: "/files", icon: FileText },
  { title: "Camera", url: "/webcam", icon: Camera },
  { title: "Timelapse", url: "/timelapse", icon: Video },
  { title: "Terminal", url: "/terminal", icon: Terminal },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function HorizontalNav() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 px-2 sm:px-4 min-w-max">
          {navItems.map((item) => {
            const isActive = location === item.url;
            const Icon = item.icon;
            
            return (
              <a
                key={item.url}
                href={item.url}
                data-testid={`link-nav-${item.title.toLowerCase()}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 sm:py-4 text-sm font-medium transition-colors relative",
                  "hover-elevate rounded-t-lg min-h-[44px]",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="whitespace-nowrap text-xs sm:text-sm">{item.title}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
