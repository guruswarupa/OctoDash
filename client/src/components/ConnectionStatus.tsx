import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  serverUrl?: string;
}

export function ConnectionStatus({ isConnected, serverUrl = "localhost:5000" }: ConnectionStatusProps) {
  return (
    <Badge
      variant={isConnected ? "default" : "secondary"}
      className={isConnected ? "bg-chart-1 text-white" : ""}
      data-testid="badge-connection-status"
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          Disconnected
        </>
      )}
    </Badge>
  );
}
