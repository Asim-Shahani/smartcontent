import { Suspense } from "react";
import { SettingsTabs } from "@/components/layout/settings-tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <Suspense fallback={null}>
        <SettingsTabs />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}