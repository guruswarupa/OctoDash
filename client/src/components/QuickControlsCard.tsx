import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, AlertTriangle } from "lucide-react";

interface QuickControlsCardProps {
  isPrinting: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onEmergencyStop: () => void;
}

export function QuickControlsCard({
  isPrinting,
  isPaused,
  onPlay,
  onPause,
  onStop,
  onEmergencyStop,
}: QuickControlsCardProps) {
  return (
    <Card data-testid="card-quick-controls">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Quick Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {!isPrinting || isPaused ? (
            <Button
              onClick={onPlay}
              className="w-full"
              data-testid="button-play"
            >
              <Play className="h-4 w-4 mr-2" />
              {isPaused ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="secondary"
              className="w-full"
              data-testid="button-pause"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            onClick={onStop}
            variant="secondary"
            disabled={!isPrinting}
            className="w-full"
            data-testid="button-stop"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
        <Button
          onClick={onEmergencyStop}
          variant="destructive"
          className="w-full"
          data-testid="button-emergency-stop"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Emergency Stop
        </Button>
      </CardContent>
    </Card>
  );
}
