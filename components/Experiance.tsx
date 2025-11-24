import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import { CardStackDemo } from "./Testonomials";
import { content } from "../lib/utils";

export function StickyScrollRevealDemo() {
  return (
    <div className="md:w-[80vw] lg:w-[70vw]   lg:pt-10  " id="journey">
      <div className="flex flex-col items-center font-funnel pb-10">
        <h1 className="md:text-5xl text-black max-w-[60vw] text-center text-4xl font-bold">
          How We Make Your Learning Experience Exceptional
        </h1>
        <p className="md:text-xl text-base text-center font-thin  w-[80vw] lg:w-[60vw] text-slate-300 mt-4">
          A glimpse into my journey of growth, driven by curiosity, continuous
          learning, and a passion for creating meaningful technological impact.
        </p>
      </div>
      <div className=" w-full xl:flex md:mt-10 justify-center gap-10    ">
        <div className="2xl:w-[40vw] flex items-center  justify-center  w-full xl:w-[40vw] h-[20rem]  md:h-[30rem]">
          <CardStackDemo />
        </div>
        <div className="mt-10 z-30">
          <StickyScroll content={content} />
        </div>
      </div>
    </div>
  );
}
