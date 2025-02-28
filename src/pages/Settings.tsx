
import { ThemeSelector } from "@/components/settings";

const Settings = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Customize your TaskSheet experience</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Theme Settings */}
        <ThemeSelector />
      </div>
    </div>
  );
};

export default Settings;
