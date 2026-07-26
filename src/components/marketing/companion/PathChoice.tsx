"use client";

import React from "react";
import { motion } from "motion/react";
import { Code2, BarChart3, Target } from "lucide-react";
import { usePath, PATH_META, type Path } from "./PathContext";

const OPTIONS: {
  value: Exclude<Path, null>;
  icon: React.ElementType;
  color: string;
  description: string;
}[] = [
  { value: "build", icon: Code2, color: "text-blue-600 bg-blue-100", description: "I want to build apps and websites" },
  { value: "data", icon: BarChart3, color: "text-indigo-600 bg-indigo-100", description: "I want to analyze and visualize data" },
  { value: "unsure", icon: Target, color: "text-orange-600 bg-orange-100", description: "I'm exploring my options" },
];

/**
 * PathChoice
 *
 * The choice that actually changes what follows: the bootcamp rail later
 * pre-filters based on this pick.
 */
export function PathChoice() {
  const { path, setPath } = usePath();

  return (
    <div className="w-full text-left">
      <h2 className="font-sans text-lg font-semibold text-[#0E1116] mb-3">
        So, what brings you here?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {OPTIONS.map(({ value, icon: Icon, color, description }) => {
          const meta = PATH_META[value];
          const active = path === value;
          return (
            <motion.button
              key={value}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => setPath(value)}
              className={`text-left p-3 sm:p-4 rounded-2xl border transition-colors flex sm:block items-center gap-3 sm:gap-0 ${
                active ? "bg-blue-50 border-blue-400" : "bg-white border-black/10 hover:border-blue-300"
              }`}
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-0 sm:mb-2 shrink-0 ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="font-alt font-semibold text-sm text-[#0E1116]">{meta.label}</p>
                <p className="font-alt text-xs text-[#5B6472] mt-0.5">{description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
