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
import { useWebSocket } from "@/hooks/useWebSocket";
import Dashboard from "@/pages/Dashboard";
import Control from "@/pages/Control";
import Media from "@/pages/Media";
import Terminal from "@/pages/Terminal";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex flex-col h-screen w-full">
      <main className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/" component={() => (
            <SwipeableLayout>
              {{
                settings: <Settings />,
                control: <Control />,
                dashboard: <Dashboard />,
                media: <Media />,
                terminal: <Terminal />,
              }}
            </SwipeableLayout>
          )} />
          <Route path="/control" component={() => (
            <SwipeableLayout>
              {{
                settings: <Settings />,
                control: <Control />,
                dashboard: <Dashboard />,
                media: <Media />,
                terminal: <Terminal />,
              }}
            </SwipeableLayout>
          )} />
          <Route path="/media" component={() => (
            <SwipeableLayout>
              {{
                settings: <Settings />,
                control: <Control />,
                dashboard: <Dashboard />,
                media: <Media />,
                terminal: <Terminal />,
              }}
            </SwipeableLayout>
          )} />
          <Route path="/settings" component={() => (
            <SwipeableLayout>
              {{
                settings: <Settings />,
                control: <Control />,
                dashboard: <Dashboard />,
                media: <Media />,
                terminal: <Terminal />,
              }}
            </SwipeableLayout>
          )} />
          <Route path="/terminal" component={() => (
            <SwipeableLayout>
              {{
                settings: <Settings />,
                control: <Control />,
                dashboard: <Dashboard />,
                media: <Media />,
                terminal: <Terminal />,
              }}
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
          <AppContent />
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
