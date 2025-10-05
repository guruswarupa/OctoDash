import { useState } from 'react';
import { QuickControlsCard } from '../QuickControlsCard';

export default function QuickControlsCardExample() {
  const [isPrinting, setIsPrinting] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="p-4">
      <QuickControlsCard
        isPrinting={isPrinting}
        isPaused={isPaused}
        onPlay={() => {
          console.log('Play/Resume clicked');
          setIsPrinting(true);
          setIsPaused(false);
        }}
        onPause={() => {
          console.log('Pause clicked');
          setIsPaused(true);
        }}
        onStop={() => {
          console.log('Stop clicked');
          setIsPrinting(false);
          setIsPaused(false);
        }}
        onEmergencyStop={() => {
          console.log('Emergency stop clicked');
          setIsPrinting(false);
          setIsPaused(false);
        }}
      />
    </div>
  );
}
