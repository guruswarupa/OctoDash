import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import type { PrinterStatus, Job, JobProgress, LayerData } from "@shared/schema";

interface WebSocketData {
  status: PrinterStatus | null;
  job: Job | null;
  progress: JobProgress | null;
  layerData: LayerData | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketData>({
  status: null,
  job: null,
  progress: null,
  layerData: null,
  isConnected: false,
});

export function useWebSocket() {
  return useContext(WebSocketContext);
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [data, setData] = useState<WebSocketData>({
    status: null,
    job: null,
    progress: null,
    layerData: null,
    isConnected: false,
  });
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setData((prev) => ({ ...prev, isConnected: true }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "update") {
            setData((prev) => ({
              ...prev,
              status: message.data.status,
              job: message.data.job.job,
              progress: message.data.job.progress,
              layerData: message.data.layerData || null,
            }));
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setData((prev) => ({ ...prev, isConnected: false }));
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={data}>
      {children}
    </WebSocketContext.Provider>
  );
}
