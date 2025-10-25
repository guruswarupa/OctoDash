import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Navigation Arrow Buttons */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {currentNeighbors.up && (
          <button
            onClick={() => setLocation(currentNeighbors.up!)}
            className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto bg-background/80 hover:bg-background border border-border rounded-lg px-3 py-2 transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label={`Navigate to ${pageNames[currentNeighbors.up]}`}
          >
            <div className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
              <ArrowUp className="h-6 w-6" />
              <span className="text-xs hidden sm:inline font-medium">{pageNames[currentNeighbors.up]}</span>
            </div>
          </button>
        )}
        {currentNeighbors.down && (
          <button
            onClick={() => setLocation(currentNeighbors.down!)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto bg-background/80 hover:bg-background border border-border rounded-lg px-3 py-2 transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label={`Navigate to ${pageNames[currentNeighbors.down]}`}
          >
            <div className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
              <span className="text-xs hidden sm:inline font-medium">{pageNames[currentNeighbors.down]}</span>
              <ArrowDown className="h-6 w-6" />
            </div>
          </button>
        )}
        {currentNeighbors.left && (
          <button
            onClick={() => setLocation(currentNeighbors.left!)}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-background/80 hover:bg-background border border-border rounded-lg px-3 py-2 transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label={`Navigate to ${pageNames[currentNeighbors.left]}`}
          >
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-6 w-6" />
              <span className="text-xs hidden sm:inline font-medium">{pageNames[currentNeighbors.left]}</span>
            </div>
          </button>
        )}
        {currentNeighbors.right && (
          <button
            onClick={() => setLocation(currentNeighbors.right!)}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto bg-background/80 hover:bg-background border border-border rounded-lg px-3 py-2 transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label={`Navigate to ${pageNames[currentNeighbors.right]}`}
          >
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <span className="text-xs hidden sm:inline font-medium">{pageNames[currentNeighbors.right]}</span>
              <ArrowRight className="h-6 w-6" />
            </div>
          </button>
        )}
      </div>

      {/* Grid Container */}
      <div
        ref={containerRef}
        className="grid grid-cols-3 grid-rows-3 w-[300vw] h-[300vh] transition-transform duration-300"
        style={{
          transform: `translate(calc(-${currentPos.col - 1} * 100vw), calc(-${currentPos.row - 1} * 100vh))`,
        }}
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
