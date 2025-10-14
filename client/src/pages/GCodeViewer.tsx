import { GCodeViewer as GCodeViewerComponent } from "react-gcode-viewer";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Box } from "lucide-react";
import { useState, useEffect } from "react";

export default function GCodeViewer() {
  const { job, progress } = useWebSocket();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validUrl, setValidUrl] = useState<string | null>(null);

  // Get the current G-code file URL from the job
  const gcodeUrl = job?.file?.name 
  ? `/api/files/local/${encodeURIComponent(job.file.name)}`
  : null;

  const completionPercentage = progress?.completion || 0;

  // Validate file before rendering viewer
  useEffect(() => {
    if (gcodeUrl) {
      setError(null);
      setValidUrl(null);
      setIsLoading(true);
      
      // Test if the file exists and is valid
      fetch(gcodeUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.text();
        })
        .then(content => {
          // Check if content is valid G-code (not JSON or empty)
          if (!content || content.trim().length === 0) {
            throw new Error('File is empty');
          }
          if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
            throw new Error('Received JSON instead of G-code file');
          }
          // File is valid, set the URL for viewer
          setValidUrl(gcodeUrl);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to load G-code file');
          setValidUrl(null);
          setIsLoading(false);
        });
    } else {
      setValidUrl(null);
      setError(null);
      setIsLoading(false);
    }
  }, [gcodeUrl]);

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
        ) : validUrl ? (
          <div className="w-full h-full">
            <GCodeViewerComponent
              orbitControls
              showAxes
              quality={0.7}
              style={{ width: '100%', height: '100%' }}
              url={validUrl}
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
              <p className="text-sm mt-2">Upload and select a file to view the 3D model</p>
            </div>
          </div>
        )}
      </Card>

      {validUrl && !error && (
        <div className="text-sm text-muted-foreground text-center">
          Print Progress: {completionPercentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
