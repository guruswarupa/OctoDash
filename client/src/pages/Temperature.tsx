import { TemperatureControl } from "@/components/TemperatureControl";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Temperature() {
  const { status } = useWebSocket();
  const { toast } = useToast();

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="heading-temperature">Temperature</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor and control printer temperatures</p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
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
    </div>
  );
}
