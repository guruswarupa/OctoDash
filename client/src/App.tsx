import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { HorizontalNav } from "@/components/HorizontalNav";
import { SwipeableLayout } from "@/components/SwipeableLayout";
import { WebSocketProvider, useWebSocket } from "@/contexts/WebSocketContext";
import Dashboard from "@/pages/Dashboard";
import Control from "@/pages/Control";
import Media from "@/pages/Media";
import Terminal from "@/pages/Terminal";
import GCodeViewer from "@/pages/GCodeViewer";
import NotFound from "@/pages/not-found";
import { memo, useMemo } from "react";

const MemoizedDashboard = memo(Dashboard);
const MemoizedControl = memo(Control);
const MemoizedMedia = memo(Media);
const MemoizedTerminal = memo(Terminal);
const MemoizedGCodeViewer = memo(GCodeViewer);

function AppContent() {
  const { isConnected } = useWebSocket();

  const pages = useMemo(() => ({
    gcode: <MemoizedGCodeViewer />,
    control: <MemoizedControl />,
    dashboard: <MemoizedDashboard />,
    media: <MemoizedMedia />,
    terminal: <MemoizedTerminal />,
  }), []);

  return (
    <div className="flex flex-col h-screen w-full">
      <main className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/:page?" component={() => (
            <SwipeableLayout>
              {pages}
            </SwipeableLayout>
          )} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark">
          <WebSocketProvider>
            <AppContent />
            <Toaster />
          </WebSocketProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
