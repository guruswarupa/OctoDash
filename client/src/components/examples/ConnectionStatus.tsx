import { ConnectionStatus } from '../ConnectionStatus';

export default function ConnectionStatusExample() {
  return (
    <div className="p-4 space-y-2">
      <ConnectionStatus isConnected={true} serverUrl="192.168.1.100:5000" />
      <ConnectionStatus isConnected={false} />
    </div>
  );
}
