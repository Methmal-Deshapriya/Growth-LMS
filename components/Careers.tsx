"use client";

import React from "react";
import { projects } from "@/lib/utils";
import { HoverEffect } from "./ui/card-hover-effect";
const Careers = () => {
  return (
    <section className="w-full py-20 px-6 flex flex-col lg:flex-row gap-8 lg:w-[80vw] xl:w-[70vw] 2xl:w-[60vw] justify-center -mt-10">
      <HoverEffect items={projects} />
    </section>
  );
};

export default Careers;
