import { GCodeViewer as GCodeViewerComponent } from "react-gcode-viewer";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function GCodeViewer() {
  const { job, progress } = useWebSocket();

  // Get the current G-code file URL from the job
  const gcodeUrl = job?.file?.name 
    ? `/api/files/local/${job.file.name}` 
    : null;

  const completionPercentage = progress?.completion || 0;

  return (
    <div className="h-full w-full flex flex-col space-y-4 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" data-testid="heading-gcode-viewer">
          3D Model View
        </h1>
        <p className="text-sm text-muted-foreground">
          {job?.file?.display || job?.file?.name || "No file loaded"}
        </p>
      </div>

      <Card className="flex-1 overflow-hidden bg-card">
        {gcodeUrl ? (
          <GCodeViewerComponent
            orbitControls
            showAxes
            quality={0.7}
            style={{ width: '100%', height: '100%' }}
            url={gcodeUrl}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No G-code file loaded</p>
              <p className="text-sm mt-2">Start a print job to view the 3D model</p>
            </div>
          </div>
        )}
      </Card>

      {gcodeUrl && (
        <div className="text-sm text-muted-foreground text-center">
          Print Progress: {completionPercentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
