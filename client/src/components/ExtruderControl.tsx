import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

interface ExtruderControlProps {
  onExtrude: (amount: number) => void;
  onRetract: (amount: number) => void;
}

export function ExtruderControl({ onExtrude, onRetract }: ExtruderControlProps) {
  const [amount, setAmount] = useState("5");

  return (
    <Card data-testid="card-extruder-control">
      <CardHeader>
        <CardTitle>Extruder Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="extrude-amount">Amount (mm)</Label>
          <Input
            id="extrude-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            data-testid="input-extrude-amount"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onExtrude(parseFloat(amount))}
            data-testid="button-extrude"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Extrude
          </Button>
          <Button
            onClick={() => onRetract(parseFloat(amount))}
            variant="secondary"
            data-testid="button-retract"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Retract
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
