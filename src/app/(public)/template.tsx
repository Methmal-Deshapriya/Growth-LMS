"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Re-mounts on every navigation within (public), giving page changes the
 * same fade + slide feel as advancing a slide in the landing page's deck.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
