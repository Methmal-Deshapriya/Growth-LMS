"use client";

import React from "react";
import { Bootcamp } from "../../bootcampsTypes";
import BootcampCard from "./BootcampCard";

interface BootcampGridProps {
  bootcamps: Bootcamp[];
}

/**
 * BootcampGrid Component
 * 
 * Renders a responsive grid of BootcampCards.
 */
export default function BootcampGrid({ bootcamps }: BootcampGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {bootcamps.map((bootcamp) => (
        <BootcampCard key={bootcamp.id} bootcamp={bootcamp} />
      ))}
    </div>
  );
}
