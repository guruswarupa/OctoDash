import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableLayoutProps {
  children: {
    gcode: React.ReactNode;
    control: React.ReactNode;
    dashboard: React.ReactNode;
    media: React.ReactNode;
    terminal: React.ReactNode;
  };
}

const pageRoutes = {
  "/gcode": { x: 0, y: 0, neighbors: { down: "/" } },
  "/control": { x: -1, y: 0, neighbors: { right: "/" } },
  "/": { x: 0, y: 0, neighbors: { up: "/gcode", left: "/control", right: "/media", down: "/terminal" } },
  "/media": { x: 1, y: 0, neighbors: { left: "/" } },
  "/terminal": { x: 0, y: 1, neighbors: { up: "/" } },
};

export function SwipeableLayout({ children }: SwipeableLayoutProps) {
  const [location, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Calculate position based on current route
  const getPositionForRoute = (route: string) => {
    const routes: Record<string, { col: number; row: number }> = {
      "/gcode": { col: 2, row: 1 },
      "/control": { col: 1, row: 2 },
      "/": { col: 2, row: 2 },
      "/media": { col: 3, row: 2 },
      "/terminal": { col: 2, row: 3 },
    };
    return routes[route] || routes["/"];
  };

  const currentPos = getPositionForRoute(location);
  const currentNeighbors = (pageRoutes[location as keyof typeof pageRoutes]?.neighbors || {}) as {
    up?: string;
    down?: string;
    left?: string;
    right?: string;
  };

  // Page name mapping
  const pageNames: Record<string, string> = {
    "/gcode": "3D Model",
    "/control": "Control",
    "/": "Dashboard",
    "/media": "Media",
    "/terminal": "Terminal",
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startPos.x;
    const deltaY = e.touches[0].clientY - startPos.y;

    setOffset({ x: deltaX, y: deltaY });
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // minimum swipe distance

    // Determine swipe direction (inverted: swipe left shows right page, etc.)
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > threshold && currentNeighbors.left) {
        setLocation(currentNeighbors.left);
      } else if (offset.x < -threshold && currentNeighbors.right) {
        setLocation(currentNeighbors.right);
      }
    } else {
      // Vertical swipe
      if (offset.y > threshold && currentNeighbors.up) {
        setLocation(currentNeighbors.up);
      } else if (offset.y < -threshold && currentNeighbors.down) {
        setLocation(currentNeighbors.down);
      }
    }

    setOffset({ x: 0, y: 0 });
  };

  // Handle mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleTouchEnd();
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Navigation Arrows */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {currentNeighbors.up && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
              <ArrowUp className="h-6 w-6 animate-bounce" />
              <span className="text-xs hidden sm:inline">{pageNames[currentNeighbors.up]}</span>
            </div>
          </div>
        )}
        {currentNeighbors.down && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
              <span className="text-xs hidden sm:inline">{pageNames[currentNeighbors.down]}</span>
              <ArrowDown className="h-6 w-6 animate-bounce" />
            </div>
          </div>
        )}
        {currentNeighbors.left && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1 text-muted-foreground/40">
              <ArrowLeft className="h-6 w-6 animate-pulse" />
              <span className="text-xs hidden sm:inline">{pageNames[currentNeighbors.left]}</span>
            </div>
          </div>
        )}
        {currentNeighbors.right && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1 text-muted-foreground/40">
              <span className="text-xs hidden sm:inline">{pageNames[currentNeighbors.right]}</span>
              <ArrowRight className="h-6 w-6 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Swipeable Grid Container */}
      <div
        ref={containerRef}
        className={cn(
          "grid grid-cols-3 grid-rows-3 w-[300vw] h-[300vh] transition-transform duration-300",
          isDragging && "transition-none"
        )}
        style={{
          transform: `translate(calc(-${currentPos.col - 1} * 100vw + ${offset.x}px), calc(-${currentPos.row - 1} * 100vh + ${offset.y}px))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Empty cells */}
        <div className="w-screen h-screen" />
        <div className="w-screen h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 h-full overflow-auto scrollbar-hide">
            {children.gcode}
          </div>
        </div>
        <div className="w-screen h-screen" />

        <div className="w-screen h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 h-full overflow-auto scrollbar-hide">
            {children.control}
          </div>
        </div>
        <div className="w-screen h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 h-full overflow-auto scrollbar-hide">
            {children.dashboard}
          </div>
        </div>
        <div className="w-screen h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 h-full overflow-auto scrollbar-hide">
            {children.media}
          </div>
        </div>

        <div className="w-screen h-screen" />
        <div className="w-screen h-screen bg-background">
          <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 h-full overflow-auto scrollbar-hide">
            {children.terminal}
          </div>
        </div>
        <div className="w-screen h-screen" />
      </div>
    </div>
  );
}
