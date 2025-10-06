import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { AlertCircle, Camera } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Webcam() {
  const { data: webcamData, isLoading } = useQuery({
    queryKey: ["/api/webcam/url"],
    queryFn: api.getWebcamUrl,
  });

  const streamUrl = webcamData?.streamUrl || "";
  const hasWebcam = !!streamUrl;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-webcam">Camera</h1>
        <p className="text-muted-foreground">Monitor your printer's camera feed</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Live Camera Feed
          </CardTitle>
          <CardDescription>Real-time view of your 3D printer</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
              <p className="text-muted-foreground">Loading camera...</p>
            </div>
          ) : !hasWebcam ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No webcam configured. Please configure your webcam settings in OctoPrint.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <img
                src={streamUrl}
                alt="Webcam stream"
                className="w-full h-full object-contain"
                data-testid="img-webcam-stream"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
