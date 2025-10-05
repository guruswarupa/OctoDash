import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Play, Trash2, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileItem {
  name: string;
  size: string;
  date: string;
}

interface FileListProps {
  files: FileItem[];
  onPrint: (filename: string) => void;
  onDelete: (filename: string) => void;
  onUpload: () => void;
}

export function FileList({ files, onPrint, onDelete, onUpload }: FileListProps) {
  return (
    <Card data-testid="card-file-list">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>G-Code Files</CardTitle>
        <Button size="sm" onClick={onUpload} data-testid="button-upload">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-md hover-elevate"
                data-testid={`file-item-${index}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" data-testid={`text-filename-${index}`}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.size} • {file.date}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onPrint(file.name)}
                    data-testid={`button-print-${index}`}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(file.name)}
                    data-testid={`button-delete-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
