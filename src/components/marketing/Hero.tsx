"use client";

import React from "react";
import Image from "next/image";
import { SectionAnchor } from "./companion/useActiveSection";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center w-full overflow-hidden min-h-[85vh]">
      <SectionAnchor id="hero" />
      <div className="z-10 w-full md:w-[80vw] 2xl:w-[70vw] py-10 px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col lg:ml-10">
          <div className="flex max-lg:justify-center">
            <h1 className="font-sans text-4xl text-nowrap sm:text-7xl md:text-[68px] lg:text-[53px] xl:text-[69px] 2xl:text-[80px] font-bold leading-tight tracking-tight max-lg:text-center text-[#0E1116]">
              Empower Your <br /> Future With <br />{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-blue-600">
                Foundry{" "}
              </span>
            </h1>
          </div>

          <div className="w-full flex max-lg:items-center max-lg:justify-center">
            <p className="font-alt text-lg max-lg:text-center sm:text-xl 2xl:text-2xl text-[#5B6472] max-w-lg">
              Next level learning with recorded lessons, assignments & peer
              feedback,
              <span className="text-[#0E1116] font-bold underline px-2 py-0.5 rounded ml-1">
                all in Sinhala
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – Single Hero Image */}
        <div className="w-full flex z-0 justify-center lg:justify-end">
          <Image
            src="/assets/hero3.png"
            alt="Foundry Academy Students"
            width={640}
            height={640}
            sizes="(max-width: 1024px) 80vw, 40vw"
            className="w-full max-w-[560px] h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
