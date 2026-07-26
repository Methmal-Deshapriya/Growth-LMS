"use client";

import React from "react";

export type Path = "build" | "data" | "unsure" | null;

interface PathContextValue {
  path: Path;
  setPath: (path: Path) => void;
}

const PathContext = React.createContext<PathContextValue | null>(null);

export function PathProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = React.useState<Path>(null);
  return <PathContext.Provider value={{ path, setPath }}>{children}</PathContext.Provider>;
}

export function usePath() {
  const ctx = React.useContext(PathContext);
  if (!ctx) throw new Error("usePath must be used within PathProvider");
  return ctx;
}

// Maps a chosen path to a skill keyword for pre-filtering the bootcamp rail,
// and to the prop the mascot holds.
export const PATH_META: Record<
  Exclude<Path, null>,
  { label: string; skillHint: string; prop: "laptop" | "chart" | "shield" }
> = {
  build: { label: "Build things", skillHint: "React", prop: "laptop" },
  data: { label: "Work with data", skillHint: "Python", prop: "chart" },
  unsure: { label: "Not sure yet", skillHint: "", prop: "shield" },
};
