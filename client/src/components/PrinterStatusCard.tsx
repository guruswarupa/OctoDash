import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";

type PrinterStatus = "operational" | "printing" | "offline" | "error";

interface PrinterStatusCardProps {
  status: PrinterStatus;
  printerName: string;
}

const statusConfig = {
  operational: {
    label: "Ready",
    color: "bg-chart-1 text-white",
  },
  printing: {
    label: "Printing",
    color: "bg-chart-2 text-white",
  },
  offline: {
    label: "Offline",
    color: "bg-muted text-muted-foreground",
  },
  error: {
    label: "Error",
    color: "bg-destructive text-destructive-foreground",
  },
};

export function PrinterStatusCard({ status, printerName }: PrinterStatusCardProps) {
  const config = statusConfig[status];

  return (
    <Card data-testid="card-printer-status">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Printer Status</CardTitle>
        <Printer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-2xl font-bold" data-testid="text-printer-name">{printerName}</p>
            <Badge className={`mt-2 ${config.color}`} data-testid={`badge-status-${status}`}>
              {config.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
