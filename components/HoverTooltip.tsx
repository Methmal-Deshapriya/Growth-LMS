"use client";

import { useState } from "react";
import { useFollowPointer } from "@/components/ui/useFollowPointer";

export default function HoverTooltip({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const { x, y } = useFollowPointer();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          className="fixed z-50 bg-linear-to-r from-indigo-500 to-blue-600 text-white text-sm px-3 py-1 rounded-lg shadow-lg pointer-events-none transition-opacity duration-100"
          style={{
            left: x,
            top: y,
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
