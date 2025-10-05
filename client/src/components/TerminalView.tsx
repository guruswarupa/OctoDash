import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";

interface TerminalMessage {
  type: "send" | "recv";
  text: string;
  timestamp: string;
}

interface TerminalViewProps {
  messages: TerminalMessage[];
  onSendCommand: (command: string) => void;
}

export function TerminalView({ messages, onSendCommand }: TerminalViewProps) {
  const [command, setCommand] = useState("");

  const handleSend = () => {
    if (command.trim()) {
      onSendCommand(command);
      setCommand("");
    }
  };

  return (
    <Card data-testid="card-terminal">
      <CardHeader>
        <CardTitle>Terminal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] w-full border rounded-md p-4 bg-muted/20">
          <div className="space-y-1 font-mono text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "send" ? "text-chart-2" : "text-foreground"}
                data-testid={`terminal-message-${index}`}
              >
                <span className="text-muted-foreground text-xs">{msg.timestamp}</span>{" "}
                <span className="font-semibold">{msg.type === "send" ? ">" : "<"}</span>{" "}
                {msg.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Enter G-code command..."
            className="font-mono"
            data-testid="input-terminal-command"
          />
          <Button onClick={handleSend} data-testid="button-send-command">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
