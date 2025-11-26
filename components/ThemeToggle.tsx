"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Switch } from "@/components/ui/switch";
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center z-10 space-x-2">
      <Switch
        id="airplane-mode"
        onClick={handleClick}
        checked={theme === "light"}
      />
    </div>
  );
};

export default ThemeToggle;
