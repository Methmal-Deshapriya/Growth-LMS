"use client";

import * as React from "react";

/**
 * Forces light mode for public landing/catalog/auth pages, regardless of
 * the visitor's system preference or a theme they set while on the
 * dashboard.
 *
 * A nested next-themes `ThemeProvider forcedTheme="light"` is NOT enough
 * to do this — it only changes what `useTheme()` reports to descendants
 * that call it. next-themes' `attribute="class"` toggling of `.dark` on
 * `<html>` is owned by the ROOT provider instance and targets a single
 * global element; a nested provider can't remove that class or scope it
 * to a subtree. Since both this project's CSS-variable tokens (`.dark {
 * --background: ... }`) AND literal `dark:` Tailwind utility classes key
 * off that same ancestor `.dark` class, the only way to truly disable
 * dark mode for a subtree is to make sure `.dark` isn't present on
 * `<html>` while this subtree is mounted — so that's what this does
 * directly, restoring it on unmount so the dashboard's own toggle keeps
 * working after navigating away.
 *
 * Separately, `color-scheme` on `<html>` controls browser-native UI (the
 * classic culprit: Chrome's autofill highlight, which renders as a dark
 * gray tint under OS dark mode even when every one of our own styles is
 * light) — that's independent of the `.dark` class entirely, so it needs
 * its own explicit override here too.
 */
export function ForceLightTheme({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    const previousColorScheme = root.style.colorScheme;

    const enforceLight = () => {
      if (root.classList.contains("dark")) root.classList.remove("dark");
    };
    enforceLight();
    root.style.colorScheme = "light";

    // next-themes reacts to system-preference/storage changes on its own
    // timeline — watch for it trying to re-add `.dark` while we're mounted
    // and immediately undo it.
    const observer = new MutationObserver(enforceLight);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      if (hadDark) root.classList.add("dark");
      root.style.colorScheme = previousColorScheme;
    };
  }, []);

  return <>{children}</>;
}
