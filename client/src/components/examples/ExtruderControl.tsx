import { ExtruderControl } from '../ExtruderControl';

export default function ExtruderControlExample() {
  return (
    <div className="p-4">
      <ExtruderControl
        onExtrude={(amount) => console.log(`Extrude ${amount}mm`)}
        onRetract={(amount) => console.log(`Retract ${amount}mm`)}
      />
    </div>
  );
}
