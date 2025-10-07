import { PrinterStatusCard } from "@/components/PrinterStatusCard";
import { TemperatureCard } from "@/components/TemperatureCard";
import { PrintProgressCard } from "@/components/PrintProgressCard";
import { QuickControlsCard } from "@/components/QuickControlsCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { status, job, progress } = useWebSocket();
  const { toast } = useToast();

  const startMutation = useMutation({
    mutationFn: api.startJob,
    onSuccess: () => toast({ title: "Print started" }),
    onError: () => toast({ title: "Failed to start print", variant: "destructive" }),
  });

  const pauseMutation = useMutation({
    mutationFn: api.pauseJob,
    onSuccess: () => toast({ title: "Print paused" }),
    onError: () => toast({ title: "Failed to pause print", variant: "destructive" }),
  });

  const resumeMutation = useMutation({
    mutationFn: api.resumeJob,
    onSuccess: () => toast({ title: "Print resumed" }),
    onError: () => toast({ title: "Failed to resume print", variant: "destructive" }),
  });

  const cancelMutation = useMutation({
    mutationFn: api.cancelJob,
    onSuccess: () => toast({ title: "Print cancelled" }),
    onError: () => toast({ title: "Failed to cancel print", variant: "destructive" }),
  });

  const getStatus = (): "operational" | "printing" | "offline" | "error" => {
    if (!status) return "offline";
    if (status.state.flags.error) return "error";
    if (status.state.flags.printing) return "printing";
    if (status.state.flags.operational) return "operational";
    return "offline";
  };

  const isPrinting = status?.state.flags.printing || false;
  const isPaused = status?.state.flags.paused || false;

  const formatTime = (seconds: number | null | undefined): string => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="heading-dashboard">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor your printer status and progress</p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
        <PrinterStatusCard 
          status={getStatus()} 
          printerName={status?.state.text || "Unknown Printer"} 
        />
        <TemperatureCard 
          title="Hotend" 
          current={Math.round(status?.temperature.tool0?.actual || 0)} 
          target={Math.round(status?.temperature.tool0?.target || 0)} 
          icon="hotend" 
        />
        <TemperatureCard 
          title="Bed" 
          current={Math.round(status?.temperature.bed?.actual || 0)} 
          target={Math.round(status?.temperature.bed?.target || 0)} 
          icon="bed" 
        />
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2">
        {job && job.file.name && (
          <PrintProgressCard
            filename={job.file.display || job.file.name}
            progress={Math.round(progress?.completion || 0)}
            timeElapsed={formatTime(progress?.printTime || 0)}
            timeRemaining={formatTime(progress?.printTimeLeft || 0)}
          />
        )}
        <QuickControlsCard
          isPrinting={isPrinting}
          isPaused={isPaused}
          onPlay={() => isPaused ? resumeMutation.mutate() : startMutation.mutate()}
          onPause={() => pauseMutation.mutate()}
          onStop={() => cancelMutation.mutate()}
          onEmergencyStop={() => cancelMutation.mutate()}
        />
      </div>
    </div>
  );
}
