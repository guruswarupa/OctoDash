import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Files from "./Files";
import Webcam from "./Webcam";
import Timelapse from "./Timelapse";
import { FileText, Camera, Video } from "lucide-react";

export default function Media() {
  const [activeTab, setActiveTab] = useState("files");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-page-title">Media Center</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage files, view webcam, and create timelapses
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files" data-testid="tab-files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Files</span>
          </TabsTrigger>
          <TabsTrigger value="webcam" data-testid="tab-webcam" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Camera</span>
          </TabsTrigger>
          <TabsTrigger value="timelapse" data-testid="tab-timelapse" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Timelapse</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-4">
          <Files />
        </TabsContent>

        <TabsContent value="webcam" className="mt-4">
          <Webcam />
        </TabsContent>

        <TabsContent value="timelapse" className="mt-4">
          <Timelapse />
        </TabsContent>
      </Tabs>
    </div>
  );
}
