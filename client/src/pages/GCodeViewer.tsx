import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Box, Layers } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { WebGLPreview } from 'gcode-preview';

export default function GCodeViewer() {
  const { job, progress, layerData } = useWebSocket();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gcodeText, setGcodeText] = useState<string | null>(null);
  const lastFetchedFile = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<WebGLPreview | null>(null);

  const fileName = job?.file?.name || null;
  const completionPercentage = progress?.completion || 0;
  
  // Get current layer from DisplayLayerProgress plugin
  const currentLayer = layerData?.layer?.current ? parseInt(layerData.layer.current) : 0;
  const totalLayers = layerData?.layer?.total ? parseInt(layerData.layer.total) : 0;

  // Fetch G-code file when file changes
  useEffect(() => {
    if (fileName && fileName !== lastFetchedFile.current) {
      lastFetchedFile.current = fileName;
      setError(null);
      setGcodeText(null);
      setIsLoading(true);

      const gcodeUrl = `/api/files/local/${encodeURIComponent(fileName)}`;

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
    } else if (!fileName && lastFetchedFile.current) {
      lastFetchedFile.current = null;
      setGcodeText(null);
      setError(null);
      setIsLoading(false);
    }
  }, [fileName]);

  // Initialize and render G-code preview with layer coloring
  useEffect(() => {
    if (!canvasRef.current || !gcodeText) return;

    try {
      // Clean up previous preview
      if (previewRef.current) {
        previewRef.current.clear();
        previewRef.current = null;
      }

      // Create new preview with layer-based coloring
      const preview = new WebGLPreview({
        canvas: canvasRef.current,
        
        // Color function based on current layer
        extrusionColor: (layer: number) => {
          if (currentLayer === 0) {
            // No layer info available, use default color
            return '#0ea5e9'; // Sky blue
          }
          
          if (layer < currentLayer) {
            // Already printed - green
            return '#22c55e';
          } else if (layer === currentLayer) {
            // Currently printing - orange
            return '#f59e0b';
          } else {
            // Not yet printed - gray
            return '#9ca3af';
          }
        },
        
        buildVolume: { x: 220, y: 220, z: 250 },
        initialCameraPosition: [0, 400, 450],
        allowDragNDrop: false,
      });

      // Process and render G-code
      preview.processGCode(gcodeText);
      
      previewRef.current = preview;
      
    } catch (err) {
      console.error("G-code preview error:", err);
      setError("Failed to render 3D model. The G-code file may be invalid.");
    }

    return () => {
      if (previewRef.current) {
        previewRef.current.clear();
        previewRef.current = null;
      }
    };
  }, [gcodeText, currentLayer]);

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
          <div className="w-full h-full relative">
            <canvas 
              ref={canvasRef}
              className="w-full h-full"
              data-testid="canvas-gcode-preview"
            />
            
            {/* Layer info overlay */}
            {totalLayers > 0 && (
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border rounded-md p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Layer {currentLayer} / {totalLayers}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
                    <span className="text-muted-foreground">Printed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
                    <span className="text-muted-foreground">Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#9ca3af]" />
                    <span className="text-muted-foreground">Remaining</span>
                  </div>
                </div>
              </div>
            )}
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
        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p>Print Progress: {completionPercentage.toFixed(1)}%</p>
          {layerData?.height?.current && (
            <p>Current Height: {layerData.height.currentFormatted || layerData.height.current}mm</p>
          )}
        </div>
      )}
    </div>
  );
}
