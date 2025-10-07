import { FileList } from "@/components/FileList";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { FilesResponse } from "@shared/schema";

export default function Files() {
  const { toast } = useToast();

  const { data: filesData } = useQuery<FilesResponse>({
    queryKey: ["/api/files"],
    refetchInterval: 5000,
  });

  const printMutation = useMutation({
    mutationFn: ({ location, path }: { location: string; path: string }) =>
      api.selectFile(location, path, true),
    onSuccess: () => {
      toast({ title: "Print started" });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: () => toast({ title: "Failed to start print", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ location, path }: { location: string; path: string }) =>
      api.deleteFile(location, path),
    onSuccess: () => {
      toast({ title: "File deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: () => toast({ title: "Failed to delete file", variant: "destructive" }),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadFile(file),
    onSuccess: () => {
      toast({ title: "File uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: () => toast({ title: "Failed to upload file", variant: "destructive" }),
  });

  const files = (filesData?.files || [])
    .filter((f) => f.type === "machinecode")
    .map((f) => ({
      name: f.name,
      size: f.size ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : "Unknown",
      date: f.date ? new Date(f.date * 1000).toLocaleDateString() : "Unknown",
      path: f.path,
      origin: f.origin || "local",
    }));

  const handlePrint = (filename: string) => {
    const file = filesData?.files.find((f) => f.name === filename);
    if (file) {
      printMutation.mutate({ location: file.origin || "local", path: file.path });
    }
  };

  const handleDelete = (filename: string) => {
    const file = filesData?.files.find((f) => f.name === filename);
    if (file) {
      deleteMutation.mutate({ location: file.origin || "local", path: file.path });
    }
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".gcode,.gco,.g";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadMutation.mutate(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" data-testid="heading-files">Files</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage and print your G-code files</p>
      </div>

      <FileList
        files={files}
        onPrint={handlePrint}
        onDelete={handleDelete}
        onUpload={handleUpload}
      />
    </div>
  );
}
