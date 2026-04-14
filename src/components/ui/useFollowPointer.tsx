// hooks/useFollowPointer.ts
"use client";

import { useEffect, useState } from "react";

export function useFollowPointer() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX + 12, // small offset so tooltip doesn't hide the cursor
      y: e.clientY + 12,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
