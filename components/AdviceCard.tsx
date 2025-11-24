"use client";
import React from "react";
import Advice from "./Advice";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
type AdviceCardProps = {
  id: number;
  title1: string;
  title2: string;
  description: string;
  bgclass: string;
  delay: number;
};
export const AdviceCard = ({
  id,
  title1,
  title2,
  description,
  bgclass,
  delay,
}: AdviceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay,
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      <div
        className={cn(
          "text-white rounded-3xl p-10 w-full h-[40vh] 2xl:h-[35vh] 2xl:w-[360px] shadow-xl hover:scale-105 flex flex-col items-center text-center",
          bgclass
        )}
      >
        <h1 className="text-5xl font-bold mb-4">{id}</h1>

        <h2 className="text-xl font-semibold mb-2">
          {title1} <br /> {title2}
        </h2>

        <div className="w-10 h-[3px] bg-white/70 rounded-full mb-4"></div>

        <p className="text-sm leading-relaxed opacity-90">{description}</p>
      </div>
    </motion.div>
  );
};
