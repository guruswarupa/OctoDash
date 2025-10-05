import { TemperatureCard } from '../TemperatureCard';

export default function TemperatureCardExample() {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      <TemperatureCard title="Hotend" current={210} target={210} icon="hotend" />
      <TemperatureCard title="Bed" current={58} target={60} icon="bed" />
    </div>
  );
}
