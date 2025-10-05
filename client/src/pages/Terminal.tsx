import { TerminalView } from "@/components/TerminalView";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Terminal() {
  const [messages, setMessages] = useState<Array<{ type: "send" | "recv"; text: string; timestamp: string }>>([]);

  const commandMutation = useMutation({
    mutationFn: (command: string) => api.sendCommand(command),
    onSuccess: (_, command) => {
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });
      setMessages((prev) => [
        ...prev,
        { type: "send", text: command, timestamp: now },
        { type: "recv", text: "Command sent", timestamp: now },
      ]);
    },
    onError: (_, command) => {
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });
      setMessages((prev) => [
        ...prev,
        { type: "send", text: command, timestamp: now },
        { type: "recv", text: "Error: Command failed", timestamp: now },
      ]);
    },
  });

  const handleSendCommand = (command: string) => {
    commandMutation.mutate(command);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-terminal">Terminal</h1>
        <p className="text-muted-foreground">Send G-code commands directly to your printer</p>
      </div>

      <TerminalView messages={messages} onSendCommand={handleSendCommand} />
    </div>
  );
}
