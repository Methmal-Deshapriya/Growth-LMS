import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import { CardStackDemo } from "./Testonomials";
import { content } from "../lib/utils";

export function StickyScrollRevealDemo() {
  return (
    <div className="md:w-[80vw] lg:w-[70vw] pt-10  " id="journey">
      <div className="flex flex-col items-center font-funnel pb-10">
        <h1 className="md:text-5xl text-black max-w-[90vw] sm:w-[80vw] lg:max-w-[60vw] xl:max-w-[50vw] 2xl:max-w-[40vw] text-center text-2xl font-bold">
          How We Make Your Learning Experience Exceptional
        </h1>
      </div>
      <div className=" w-full xl:flex md:mt-10 justify-center gap-10    ">
        <div className="2xl:w-[40vw] flex items-center  justify-center  w-full xl:w-[40vw] h-[20rem]  md:h-[30rem]">
          <CardStackDemo />
        </div>
        <div className="mt-10 z-30 ">
          <StickyScroll content={content} />
        </div>
      </div>
    </div>
  );
}
