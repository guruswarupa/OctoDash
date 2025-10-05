import { PrinterStatusCard } from '../PrinterStatusCard';

export default function PrinterStatusCardExample() {
  return (
    <div className="p-4 space-y-4">
      <PrinterStatusCard status="operational" printerName="Prusa i3 MK3S" />
      <PrinterStatusCard status="printing" printerName="Ender 3 Pro" />
      <PrinterStatusCard status="offline" printerName="CR-10" />
      <PrinterStatusCard status="error" printerName="Artillery Sidewinder" />
    </div>
  );
}
