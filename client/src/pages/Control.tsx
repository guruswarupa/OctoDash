import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovementControl } from "@/components/MovementControl";
import { ExtruderControl } from "@/components/ExtruderControl";
import { FanControl } from "@/components/FanControl";
import { SpeedFlowControl } from "@/components/SpeedFlowControl";
import { TemperatureControl } from "@/components/TemperatureControl";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Gauge, Thermometer } from "lucide-react";

export default function Control() {
  const { toast } = useToast();
  const { status } = useWebSocket();
  const [activeTab, setActiveTab] = useState("movement");

  const jogMutation = useMutation({
    mutationFn: (axes: Record<string, number>) => api.jog(axes),
    onError: () => toast({ title: "Movement failed", variant: "destructive" }),
  });

  const homeMutation = useMutation({
    mutationFn: (axes: string[]) => api.home(axes),
    onSuccess: () => toast({ title: "Homing complete" }),
    onError: () => toast({ title: "Homing failed", variant: "destructive" }),
  });

  const extrudeMutation = useMutation({
    mutationFn: (amount: number) => api.extrude(amount),
    onError: () => toast({ title: "Extrusion failed", variant: "destructive" }),
  });

  const fanMutation = useMutation({
    mutationFn: (speed: number) => api.setFanSpeed(speed),
    onSuccess: () => toast({ title: "Fan speed set" }),
    onError: () => toast({ title: "Failed to set fan speed", variant: "destructive" }),
  });

  const speedMutation = useMutation({
    mutationFn: (percentage: number) => api.setFeedrate(percentage),
    onSuccess: () => toast({ title: "Print speed adjusted" }),
    onError: () => toast({ title: "Failed to adjust speed", variant: "destructive" }),
  });

  const flowMutation = useMutation({
    mutationFn: (percentage: number) => api.setFlowrate(percentage),
    onSuccess: () => toast({ title: "Flow rate adjusted" }),
    onError: () => toast({ title: "Failed to adjust flow", variant: "destructive" }),
  });

  const setToolTempMutation = useMutation({
    mutationFn: (temp: number) => api.setToolTemperature(temp),
    onSuccess: () => toast({ title: "Hotend temperature set" }),
    onError: () => toast({ title: "Failed to set temperature", variant: "destructive" }),
  });

  const setBedTempMutation = useMutation({
    mutationFn: (temp: number) => api.setBedTemperature(temp),
    onSuccess: () => toast({ title: "Bed temperature set" }),
    onError: () => toast({ title: "Failed to set temperature", variant: "destructive" }),
  });

  const handleMove = (axis: string, distance: number, direction: number) => {
    const axes: Record<string, number> = {};
    axes[axis] = distance * direction;
    jogMutation.mutate(axes);
  };

  const handleHome = (axis: string) => {
    const axes = axis === "xy" ? ["x", "y"] : [axis];
    homeMutation.mutate(axes);
  };

  const handleExtrude = (amount: number) => {
    extrudeMutation.mutate(amount);
  };

  const handleRetract = (amount: number) => {
    extrudeMutation.mutate(-amount);
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" data-testid="heading-control">
          Control & Temperature
        </h1>
        <p className="text-sm text-muted-foreground">
          Manual printer control, adjustments, and temperature management
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="movement" data-testid="tab-movement" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Movement</span>
          </TabsTrigger>
          <TabsTrigger value="temperature" data-testid="tab-temperature" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <span className="hidden sm:inline">Temperature</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movement" className="mt-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            <MovementControl onMove={handleMove} onHome={handleHome} />
            <ExtruderControl onExtrude={handleExtrude} onRetract={handleRetract} />
            <FanControl onSetSpeed={(speed) => fanMutation.mutate(speed)} />
            <SpeedFlowControl 
              onSetSpeed={(speed) => speedMutation.mutate(speed)}
              onSetFlow={(flow) => flowMutation.mutate(flow)}
            />
          </div>
        </TabsContent>

        <TabsContent value="temperature" className="mt-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <TemperatureControl
              type="hotend"
              currentTemp={Math.round(status?.temperature.tool0?.actual || 0)}
              targetTemp={Math.round(status?.temperature.tool0?.target || 0)}
              onSetTemp={(temp) => setToolTempMutation.mutate(temp)}
            />
            <TemperatureControl
              type="bed"
              currentTemp={Math.round(status?.temperature.bed?.actual || 0)}
              targetTemp={Math.round(status?.temperature.bed?.target || 0)}
              onSetTemp={(temp) => setBedTempMutation.mutate(temp)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
