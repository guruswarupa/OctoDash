import { useState } from 'react';
import { TerminalView } from '../TerminalView';

export default function TerminalViewExample() {
  const [messages, setMessages] = useState([
    { type: "recv" as const, text: "Recv: ok", timestamp: "12:34:01" },
    { type: "send" as const, text: "M105", timestamp: "12:34:02" },
    { type: "recv" as const, text: "Recv: ok T:210.0 /210.0 B:60.0 /60.0", timestamp: "12:34:02" },
  ]);

  return (
    <div className="p-4">
      <TerminalView
        messages={messages}
        onSendCommand={(command) => {
          console.log(`Send command: ${command}`);
          const now = new Date().toLocaleTimeString('en-US', { hour12: false });
          setMessages([
            ...messages,
            { type: "send", text: command, timestamp: now },
            { type: "recv", text: "Recv: ok", timestamp: now },
          ]);
        }}
      />
    </div>
  );
}
