import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useWebSocket } from "@/hooks/useWebSocket";
import Dashboard from "@/pages/Dashboard";
import Control from "@/pages/Control";
import Temperature from "@/pages/Temperature";
import Files from "@/pages/Files";
import Webcam from "@/pages/Webcam";
import Timelapse from "@/pages/Timelapse";
import Terminal from "@/pages/Terminal";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/control" component={Control} />
      <Route path="/temperature" component={Temperature} />
      <Route path="/files" component={Files} />
      <Route path="/webcam" component={Webcam} />
      <Route path="/timelapse" component={Timelapse} />
      <Route path="/terminal" component={Terminal} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between p-2 sm:p-4 border-b gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ConnectionStatus isConnected={isConnected} />
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <Router />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark">
          <SidebarProvider style={style as React.CSSProperties} defaultOpen={false}>
            <AppContent />
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
