import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Wind } from "lucide-react";

interface TemperatureCardProps {
  title: string;
  current: number;
  target: number;
  icon?: "hotend" | "bed";
}

export function TemperatureCard({ title, current, target, icon = "hotend" }: TemperatureCardProps) {
  const Icon = icon === "hotend" ? Flame : Wind;
  
  return (
    <Card data-testid={`card-temp-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-4xl font-mono font-bold" data-testid={`text-temp-current-${title.toLowerCase()}`}>
            {current}°
          </p>
          <p className="text-xs text-muted-foreground" data-testid={`text-temp-target-${title.toLowerCase()}`}>
            Target: {target}°C
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
