import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface MovementControlProps {
  onMove: (axis: string, distance: number, direction: number) => void;
  onHome: (axis: string) => void;
}

export function MovementControl({ onMove, onHome }: MovementControlProps) {
  const [distance, setDistance] = useState("10");

  const distances = ["0.1", "1", "10", "50", "100"];

  return (
    <Card data-testid="card-movement-control">
      <CardHeader>
        <CardTitle>Movement Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Distance:</span>
          <Select value={distance} onValueChange={setDistance}>
            <SelectTrigger className="w-32" data-testid="select-distance">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {distances.map((d) => (
                <SelectItem key={d} value={d}>
                  {d} mm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="xy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="xy" data-testid="tab-xy">X/Y Axis</TabsTrigger>
            <TabsTrigger value="z" data-testid="tab-z">Z Axis</TabsTrigger>
          </TabsList>
          <TabsContent value="xy" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div></div>
                <Button
                  size="icon"
                  onClick={() => onMove("y", parseFloat(distance), 1)}
                  data-testid="button-move-y-plus"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <div></div>
                <Button
                  size="icon"
                  onClick={() => onMove("x", parseFloat(distance), -1)}
                  data-testid="button-move-x-minus"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => onHome("xy")}
                  variant="secondary"
                  data-testid="button-home-xy"
                >
                  <Home className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={() => onMove("x", parseFloat(distance), 1)}
                  data-testid="button-move-x-plus"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div></div>
                <Button
                  size="icon"
                  onClick={() => onMove("y", parseFloat(distance), -1)}
                  data-testid="button-move-y-minus"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <div></div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="z" className="mt-4">
            <div className="space-y-2 flex flex-col items-center">
              <Button
                onClick={() => onMove("z", parseFloat(distance), 1)}
                className="w-24"
                data-testid="button-move-z-plus"
              >
                <ChevronUp className="h-4 w-4 mr-2" />
                Up
              </Button>
              <Button
                onClick={() => onHome("z")}
                variant="secondary"
                className="w-24"
                data-testid="button-home-z"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={() => onMove("z", parseFloat(distance), -1)}
                className="w-24"
                data-testid="button-move-z-minus"
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Down
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
