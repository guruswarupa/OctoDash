import { MovementControl } from "@/components/MovementControl";
import { ExtruderControl } from "@/components/ExtruderControl";
import { FanControl } from "@/components/FanControl";
import { SpeedFlowControl } from "@/components/SpeedFlowControl";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Control() {
  const { toast } = useToast();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-control">Control</h1>
        <p className="text-muted-foreground">Manual printer control and adjustments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MovementControl onMove={handleMove} onHome={handleHome} />
        <ExtruderControl onExtrude={handleExtrude} onRetract={handleRetract} />
        <FanControl onSetSpeed={(speed) => fanMutation.mutate(speed)} />
        <SpeedFlowControl 
          onSetSpeed={(speed) => speedMutation.mutate(speed)}
          onSetFlow={(flow) => flowMutation.mutate(flow)}
        />
      </div>
    </div>
  );
}
