import { PrintProgressCard } from '../PrintProgressCard';

export default function PrintProgressCardExample() {
  return (
    <div className="p-4">
      <PrintProgressCard
        filename="benchy_0.2mm_PLA.gcode"
        progress={67}
        timeElapsed="1h 23m"
        timeRemaining="42m"
      />
    </div>
  );
}
