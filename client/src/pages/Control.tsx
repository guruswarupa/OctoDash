import { MovementControl } from "@/components/MovementControl";
import { ExtruderControl } from "@/components/ExtruderControl";
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
        <p className="text-muted-foreground">Manual printer movement and extrusion</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MovementControl onMove={handleMove} onHome={handleHome} />
        <ExtruderControl onExtrude={handleExtrude} onRetract={handleRetract} />
      </div>
    </div>
  );
}
