import { MovementControl } from '../MovementControl';

export default function MovementControlExample() {
  return (
    <div className="p-4">
      <MovementControl
        onMove={(axis, distance, direction) => {
          console.log(`Move ${axis} ${distance}mm in direction ${direction}`);
        }}
        onHome={(axis) => {
          console.log(`Home ${axis} axis`);
        }}
      />
    </div>
  );
}
