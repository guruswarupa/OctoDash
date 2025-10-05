import { ThemeProvider } from '../ThemeProvider';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <p className="text-foreground">Theme Provider is working!</p>
      </div>
    </ThemeProvider>
  );
}
