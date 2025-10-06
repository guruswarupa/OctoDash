import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Gauge, Droplet } from "lucide-react";
import { useState } from "react";

interface SpeedFlowControlProps {
  onSetSpeed: (percentage: number) => void;
  onSetFlow: (percentage: number) => void;
}

export function SpeedFlowControl({ onSetSpeed, onSetFlow }: SpeedFlowControlProps) {
  const [speed, setSpeed] = useState(100);
  const [flow, setFlow] = useState(100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Speed & Flow
        </CardTitle>
        <CardDescription>Adjust print speed and flow rate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Print Speed
            </span>
            <span className="text-2xl font-bold" data-testid="text-speed">{speed}%</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={50}
            max={200}
            step={5}
            className="cursor-pointer"
            data-testid="slider-speed"
          />
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => setSpeed(50)} size="lg" data-testid="button-speed-50">50%</Button>
            <Button variant="outline" onClick={() => setSpeed(75)} size="lg" data-testid="button-speed-75">75%</Button>
            <Button variant="outline" onClick={() => setSpeed(100)} size="lg" data-testid="button-speed-100">100%</Button>
            <Button variant="outline" onClick={() => setSpeed(150)} size="lg" data-testid="button-speed-150">150%</Button>
          </div>
          <Button
            onClick={() => onSetSpeed(speed)}
            className="w-full"
            size="lg"
            data-testid="button-set-speed"
          >
            Set Speed
          </Button>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              Flow Rate
            </span>
            <span className="text-2xl font-bold" data-testid="text-flow">{flow}%</span>
          </div>
          <Slider
            value={[flow]}
            onValueChange={(value) => setFlow(value[0])}
            min={75}
            max={125}
            step={5}
            className="cursor-pointer"
            data-testid="slider-flow"
          />
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => setFlow(75)} size="lg" data-testid="button-flow-75">75%</Button>
            <Button variant="outline" onClick={() => setFlow(90)} size="lg" data-testid="button-flow-90">90%</Button>
            <Button variant="outline" onClick={() => setFlow(100)} size="lg" data-testid="button-flow-100">100%</Button>
            <Button variant="outline" onClick={() => setFlow(110)} size="lg" data-testid="button-flow-110">110%</Button>
          </div>
          <Button
            onClick={() => onSetFlow(flow)}
            className="w-full"
            size="lg"
            data-testid="button-set-flow"
          >
            Set Flow Rate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
