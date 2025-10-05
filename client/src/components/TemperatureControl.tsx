import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Wind } from "lucide-react";
import { useState } from "react";

interface TemperatureControlProps {
  type: "hotend" | "bed";
  currentTemp: number;
  targetTemp: number;
  onSetTemp: (temp: number) => void;
}

export function TemperatureControl({
  type,
  currentTemp,
  targetTemp,
  onSetTemp,
}: TemperatureControlProps) {
  const [temp, setTemp] = useState(targetTemp.toString());
  
  const Icon = type === "hotend" ? Flame : Wind;
  const title = type === "hotend" ? "Hotend Temperature" : "Bed Temperature";
  const presets = type === "hotend" 
    ? [{ label: "PLA", value: 210 }, { label: "PETG", value: 240 }, { label: "ABS", value: 250 }]
    : [{ label: "PLA", value: 60 }, { label: "PETG", value: 80 }, { label: "ABS", value: 100 }];

  return (
    <Card data-testid={`card-temp-control-${type}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-mono font-bold" data-testid={`text-current-temp-${type}`}>
            {currentTemp}°
          </span>
          <span className="text-sm text-muted-foreground">
            / {targetTemp}°C
          </span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`temp-${type}`}>Set Temperature (°C)</Label>
          <div className="flex gap-2">
            <Input
              id={`temp-${type}`}
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              data-testid={`input-temp-${type}`}
            />
            <Button
              onClick={() => onSetTemp(parseFloat(temp))}
              data-testid={`button-set-temp-${type}`}
            >
              Set
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Presets</Label>
          <div className="flex gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTemp(preset.value.toString());
                  onSetTemp(preset.value);
                }}
                data-testid={`button-preset-${type}-${preset.label.toLowerCase()}`}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTemp("0");
                onSetTemp(0);
              }}
              data-testid={`button-off-${type}`}
            >
              Off
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
