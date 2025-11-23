import React from "react";
import { AdviceCard } from "./AdviceCard";
import { advice } from "@/lib/utils";
import { motion } from "framer-motion";
import { div } from "motion/react-client";
const Advice = () => {
  return (
    <div className="flex flex-col">
      <section className="w-full py-10 -mt-10 px-6 flex flex-col lg:flex-row gap-8 justify-center lg:w-[70vw]   2xl:w-[60vw] ">
        {advice.map((item, index) => (
          <AdviceCard
            key={index}
            id={item.id}
            title1={item.title1}
            title2={item.title2}
            description={item.description}
            bgclass={item.bgclass}
            delay={item.delay}
          />
        ))}
      </section>
    </div>
  );
};

export default Advice;
