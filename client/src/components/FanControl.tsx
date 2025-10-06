import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Fan } from "lucide-react";
import { useState } from "react";

interface FanControlProps {
  onSetSpeed: (speed: number) => void;
}

export function FanControl({ onSetSpeed }: FanControlProps) {
  const [fanSpeed, setFanSpeed] = useState(100);

  const handleSetSpeed = (speed: number) => {
    setFanSpeed(speed);
    // Convert 0-100% to 0-255 for G-code
    const gcodeSpeed = Math.round((speed / 100) * 255);
    onSetSpeed(gcodeSpeed);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fan className="h-5 w-5" />
          Fan Control
        </CardTitle>
        <CardDescription>Control cooling fan speed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fan Speed</span>
            <span className="text-2xl font-bold" data-testid="text-fan-speed">{fanSpeed}%</span>
          </div>
          <Slider
            value={[fanSpeed]}
            onValueChange={(value) => setFanSpeed(value[0])}
            max={100}
            step={5}
            className="cursor-pointer"
            data-testid="slider-fan-speed"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => handleSetSpeed(0)}
            size="lg"
            data-testid="button-fan-off"
          >
            Off
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSetSpeed(50)}
            size="lg"
            data-testid="button-fan-50"
          >
            50%
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSetSpeed(100)}
            size="lg"
            data-testid="button-fan-100"
          >
            100%
          </Button>
        </div>
        <Button
          onClick={() => handleSetSpeed(fanSpeed)}
          className="w-full"
          size="lg"
          data-testid="button-set-fan-speed"
        >
          Set Fan Speed
        </Button>
      </CardContent>
    </Card>
  );
}
