import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Trash2, Download, Video, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export default function Timelapse() {
  const { toast } = useToast();
  const [timelapseType, setTimelapseType] = useState<string>("off");
  const [fps, setFps] = useState<number>(25);

  const { data: timelapses } = useQuery({
    queryKey: ["/api/timelapse"],
    queryFn: api.getTimelapses,
    refetchInterval: 5000,
  });

  const { data: config } = useQuery({
    queryKey: ["/api/timelapse/config"],
    queryFn: api.getTimelapseConfig,
  });

  useEffect(() => {
    if (config) {
      setTimelapseType(config.type || "off");
      setFps(config.fps || 25);
    }
  }, [config]);

  const deleteMutation = useMutation({
    mutationFn: (filename: string) => api.deleteTimelapse(filename),
    onSuccess: () => {
      toast({ title: "Timelapse deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/timelapse"] });
    },
    onError: () => toast({ title: "Failed to delete timelapse", variant: "destructive" }),
  });

  const configMutation = useMutation({
    mutationFn: () => api.setTimelapseConfig({ type: timelapseType, fps }),
    onSuccess: () => {
      toast({ title: "Timelapse config saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/timelapse/config"] });
    },
    onError: () => toast({ title: "Failed to save config", variant: "destructive" }),
  });

  const timelapseFiles = timelapses?.files || [];

  return (
    <div className="space-y-4 md:space-y-6 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" data-testid="heading-timelapse">
          Timelapse
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage timelapses and configuration
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Timelapse Settings
            </CardTitle>
            <CardDescription>Configure how timelapses are captured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timelapse-type">Capture Mode</Label>
              <Select
                value={timelapseType}
                onValueChange={setTimelapseType}
                data-testid="select-timelapse-type"
              >
                <SelectTrigger id="timelapse-type" className="h-11">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="zchange">On Z-Change</SelectItem>
                  <SelectItem value="timed">Timed Interval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fps">Frames Per Second</Label>
              <Input
                id="fps"
                type="number"
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value) || 25)}
                min={1}
                max={60}
                data-testid="input-fps"
                className="h-11"
              />
            </div>
            <Button
              onClick={() => configMutation.mutate()}
              disabled={configMutation.isPending}
              className="w-full"
              size="lg"
              data-testid="button-save-config"
            >
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5" />
              Saved Timelapses
            </CardTitle>
            <CardDescription>{timelapseFiles.length} timelapse(s) available</CardDescription>
          </CardHeader>
          <CardContent>
            {timelapseFiles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No timelapses yet</p>
            ) : (
              <div className="space-y-2">
                {timelapseFiles.map((file: any) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between gap-3 p-3 border rounded-lg hover-elevate"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" data-testid={`text-timelapse-${file.name}`}>
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {file.bytes ? `${(file.bytes / 1024 / 1024).toFixed(1)} MB` : "Unknown size"}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          try {
                            // Build a URL object and force current hostname (no port)
                            const u = new URL(file.url, window.location.href);
                            u.hostname = window.location.hostname;
                            u.port = "";
                            u.protocol = window.location.protocol;
                            window.open(u.toString(), "_blank");
                          } catch {
                            // Fallback: strip host part and use current origin without port
                            const originWithoutPort = `${window.location.protocol}//${window.location.hostname}`;
                            const path = file.url.replace(/^https?:\/\/[^/]+/, "");
                            window.open(originWithoutPort + path, "_blank");
                          }
                        }}
                        data-testid={`button-download-${file.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteMutation.mutate(file.name)}
                        data-testid={`button-delete-${file.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
