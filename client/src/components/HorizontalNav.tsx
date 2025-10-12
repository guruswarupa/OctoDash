import { useLocation, Link } from "wouter";
import {
  Home,
  Gauge,
  FolderOpen,
  Terminal,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Settings", url: "/settings", icon: Settings, position: "top" as const },
  { title: "Control", url: "/control", icon: Gauge, position: "left" as const },
  { title: "Dashboard", url: "/", icon: Home, position: "center" as const },
  { title: "Media", url: "/media", icon: FolderOpen, position: "right" as const },
  { title: "Terminal", url: "/terminal", icon: Terminal, position: "bottom" as const },
];

export function HorizontalNav() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-2xl mx-auto px-4 py-3">
        {/* Plus pattern grid layout */}
        <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.url;
            const Icon = item.icon;
            
            const gridPosition = {
              top: "col-start-2 row-start-1",
              left: "col-start-1 row-start-2",
              center: "col-start-2 row-start-2",
              right: "col-start-3 row-start-2",
              bottom: "col-start-2 row-start-3",
            }[item.position];
            
            return (
              <Link
                key={item.url}
                href={item.url}
                data-testid={`link-nav-${item.title.toLowerCase()}`}
                className={cn(
                  "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:py-3 text-sm font-medium transition-colors relative",
                  "hover-elevate rounded-lg min-h-[44px]",
                  gridPosition,
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm whitespace-nowrap hidden sm:inline">{item.title}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
