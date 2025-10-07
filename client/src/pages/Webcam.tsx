import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { AlertCircle, Camera } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Webcam() {
  const { data: webcamData, isLoading } = useQuery({
    queryKey: ["/api/webcam/url"],
    queryFn: api.getWebcamUrl,
  });

  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(true);

  useEffect(() => {
    if (!webcamData) return;

    const testImage = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const testUrls = async () => {
      setIsTesting(true);

      const urls = [
        webcamData.localStreamUrl,
        webcamData.tailscaleStreamUrl,
      ].filter(Boolean) as string[];

      for (const url of urls) {
        const works = await testImage(url);
        if (works) {
          setStreamUrl(url);
          setIsTesting(false);
          return;
        }
      }

      setStreamUrl(null);
      setIsTesting(false);
    };

    testUrls();
  }, [webcamData]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="heading-webcam">
          Camera
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitor your printer's camera feed
        </p>
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
          {isLoading || isTesting ? (
            <div className="flex items-center justify-center h-64 md:h-96 bg-muted rounded-lg">
              <p className="text-muted-foreground">Loading camera...</p>
            </div>
          ) : !streamUrl ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No reachable webcam stream found. Make sure you're connected
                either locally or via Tailscale.
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
