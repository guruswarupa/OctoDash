import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Power, RotateCcw, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ConnectionSettings } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { toast } = useToast();
  const [serverUrl, setServerUrl] = useState("http://localhost:5000");
  const [apiKey, setApiKey] = useState("");
  const [autoConnect, setAutoConnect] = useState(true);

  const { data: settings } = useQuery<ConnectionSettings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setServerUrl(settings.serverUrl);
      setApiKey(settings.apiKey);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: () => api.saveSettings({ serverUrl, apiKey }),
    onSuccess: () => {
      toast({ title: "Settings saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: () => toast({ title: "Failed to save settings", variant: "destructive" }),
  });

  const shutdownMutation = useMutation({
    mutationFn: api.shutdown,
    onSuccess: () => toast({ title: "Shutdown initiated" }),
    onError: () => toast({ title: "Failed to shutdown", variant: "destructive" }),
  });

  const rebootMutation = useMutation({
    mutationFn: api.reboot,
    onSuccess: () => toast({ title: "Reboot initiated" }),
    onError: () => toast({ title: "Failed to reboot", variant: "destructive" }),
  });

  const restartMutation = useMutation({
    mutationFn: api.restartOctoPrint,
    onSuccess: () => toast({ title: "OctoPrint restart initiated" }),
    onError: () => toast({ title: "Failed to restart OctoPrint", variant: "destructive" }),
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="heading-settings">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Configure OctoPrint connection and preferences</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Settings</CardTitle>
            <CardDescription>Configure your OctoPrint server connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-url">Server URL</Label>
              <Input
                id="server-url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:5000"
                data-testid="input-server-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OctoPrint API key"
                data-testid="input-api-key"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-connect">Auto-connect on startup</Label>
              <Switch
                id="auto-connect"
                checked={autoConnect}
                onCheckedChange={setAutoConnect}
                data-testid="switch-auto-connect"
              />
            </div>
            <Button 
              onClick={() => saveMutation.mutate()} 
              disabled={saveMutation.isPending}
              data-testid="button-save-settings"
            >
              {saveMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Raspberry Pi and system details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-mono font-medium">Connected to OctoPrint</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interface Version:</span>
              <span className="font-mono font-medium">1.0.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Commands
            </CardTitle>
            <CardDescription>Control your Raspberry Pi system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start" size="lg" data-testid="button-restart-octoprint">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart OctoPrint
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Restart OctoPrint?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will restart the OctoPrint service. Any active print will be paused.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => restartMutation.mutate()}>Restart</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start" size="lg" data-testid="button-reboot">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reboot System
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reboot System?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reboot the Raspberry Pi. Any active print will be stopped.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => rebootMutation.mutate()}>Reboot</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start" size="lg" data-testid="button-shutdown">
                  <Power className="mr-2 h-4 w-4" />
                  Shutdown System
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Shutdown System?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will shutdown the Raspberry Pi completely. You will need to power it on manually.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => shutdownMutation.mutate()} className="bg-destructive text-destructive-foreground">
                    Shutdown
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
