import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { GCodeViewer as ReactGCodeViewer } from "react-gcode-viewer";

export default function GCodeViewer() {
  const { job, progress } = useWebSocket();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gcodeText, setGcodeText] = useState<string | null>(null);

  const gcodeUrl = job?.file?.name 
    ? `/api/files/local/${encodeURIComponent(job.file.name)}`
    : null;

  const completionPercentage = progress?.completion || 0;

  useEffect(() => {
    if (gcodeUrl) {
      setError(null);
      setGcodeText(null);
      setIsLoading(true);

      fetch(gcodeUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Server error: ${res.status}`);
          return res.text();
        })
        .then(content => {
          if (!content || content.trim().length === 0)
            throw new Error("File is empty");
          if (content.trim().startsWith("{") || content.trim().startsWith("["))
            throw new Error("Received JSON instead of G-code file");

          setGcodeText(content);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message || "Failed to load G-code file");
          setGcodeText(null);
          setIsLoading(false);
        });
    } else {
      setGcodeText(null);
      setError(null);
      setIsLoading(false);
    }
  }, [gcodeUrl]);

  return (
    <div className="h-full w-full flex flex-col space-y-4 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          3D Model View
        </h1>
        <p className="text-sm text-muted-foreground">
          {job?.file?.display || job?.file?.name || "No file loaded"}
        </p>
      </div>

      <Card className="flex-1 overflow-hidden bg-card">
        {error ? (
          <div className="h-full w-full flex items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <br />
                <span className="text-xs mt-2 block">
                  Make sure OctoPrint is configured and the file exists.
                </span>
              </AlertDescription>
            </Alert>
          </div>
        ) : gcodeText ? (
          <div className="w-full h-full">
            <ReactGCodeViewer 
              orbitControls 
              showAxes 
              quality={2}
              url={`data:text/plain;base64,${btoa(gcodeText)}`}
              style={{ 
                width: '100%', 
                height: '100%',
                background: 'transparent'
              }}
            />
          </div>
        ) : isLoading ? (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Box className="h-12 w-12 mx-auto mb-4 animate-spin" />
              <p className="text-lg font-medium">Loading 3D model...</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No G-code file loaded</p>
              <p className="text-sm mt-2">
                Upload and select a file to view the 3D model
              </p>
            </div>
          </div>
        )}
      </Card>

      {gcodeText && !error && (
        <div className="text-sm text-muted-foreground text-center">
          Print Progress: {completionPercentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
