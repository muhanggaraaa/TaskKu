"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/lib/useTheme";

export function ThemedToaster() {
  const { theme, mounted } = useTheme();
  // Until we know the actual client theme, fall back to system so we don't
  // hard-code a light toast against a dark UI.
  const toasterTheme = mounted ? theme : "system";
  return <Toaster position="top-right" richColors theme={toasterTheme} />;
}
