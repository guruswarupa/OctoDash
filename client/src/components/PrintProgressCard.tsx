import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Layers } from "lucide-react";

interface PrintProgressCardProps {
  filename: string;
  progress: number;
  timeElapsed: string;
  timeRemaining: string;
}

export function PrintProgressCard({
  filename,
  progress,
  timeElapsed,
  timeRemaining,
}: PrintProgressCardProps) {
  return (
    <Card data-testid="card-print-progress">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Current Print</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg font-semibold truncate" data-testid="text-filename">
            {filename}
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono font-semibold" data-testid="text-progress-percent">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-bar" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Elapsed</p>
              <p className="font-mono font-medium" data-testid="text-time-elapsed">{timeElapsed}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="font-mono font-medium" data-testid="text-time-remaining">{timeRemaining}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
