import { useLocation, Link } from "wouter";
import {
  Home,
  Gauge,
  FolderOpen,
  Terminal,
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Settings", url: "/settings", icon: Settings, direction: "top" as const },
  { title: "Control", url: "/control", icon: Gauge, direction: "left" as const },
  { title: "Dashboard", url: "/", icon: Home, direction: "center" as const },
  { title: "Media", url: "/media", icon: FolderOpen, direction: "right" as const },
  { title: "Terminal", url: "/terminal", icon: Terminal, direction: "down" as const },
];

const directionArrows = {
  top: ArrowUp,
  left: ArrowLeft,
  center: null,
  right: ArrowRight,
  down: ArrowDown,
};

export function HorizontalNav() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-center items-center gap-1 px-2 sm:px-4 py-2">
        {navItems.map((item) => {
          const isActive = location === item.url;
          const Icon = item.icon;
          const DirectionArrow = directionArrows[item.direction];
          
          return (
            <Link
              key={item.url}
              href={item.url}
              data-testid={`link-nav-${item.title.toLowerCase()}`}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-sm font-medium transition-colors relative",
                "hover-elevate rounded-lg min-h-[44px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{item.title}</span>
              {DirectionArrow && (
                <DirectionArrow className="h-3 w-3 opacity-50 hidden md:inline" />
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
