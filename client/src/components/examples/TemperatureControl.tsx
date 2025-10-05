import { TemperatureControl } from '../TemperatureControl';

export default function TemperatureControlExample() {
  return (
    <div className="p-4 space-y-4">
      <TemperatureControl
        type="hotend"
        currentTemp={210}
        targetTemp={210}
        onSetTemp={(temp) => console.log(`Set hotend temp to ${temp}°C`)}
      />
      <TemperatureControl
        type="bed"
        currentTemp={58}
        targetTemp={60}
        onSetTemp={(temp) => console.log(`Set bed temp to ${temp}°C`)}
      />
    </div>
  );
}
