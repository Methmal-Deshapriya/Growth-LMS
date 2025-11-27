"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Image from "next/image";
import { div } from "motion/react-client";
const Showcase = () => {
  return (
    <section className="relative flex justify-center items-center w-full overflow-hidden">
      <div className="absolute top-20 -left-10 w-172 h-72 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-120 right-0 w-150 h-96 bg-pink-300 blur-3xl opacity-30  rounded-full "></div>
      <div className="absolute bottom-100 right-0 w-96 h-96 bg-green-300 blur-3xl opacity-30  rounded-full "></div>

      <div className="absolute bottom-50 rotate-35 right-0 w-196 h-96 bg-blue-300 blur-3xl opacity-30  rounded-full "></div>
      <div className="flex flex-col h-[120vh] ">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold font-funnel -mt-80 text-black">
                <span className="text-purple text-3xl md:text-[3rem]">
                  Unleash the power of
                </span>{" "}
                <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Network
                </span>
              </h1>
            </>
          }
        >
          <picture>
            <source
              srcSet={`/assets/wsc.png`}
              type="image/png"
              media="(min-width:783px)"
            />
            <source
              srcSet={`/assets/tblt3.png`}
              type="image/png"
              media="(min-width:768px)"
            />
            <source
              srcSet={`/assets/wsc.png`}
              type="image/png"
              media="(min-width:420px)"
            />

            <Image
              src={`/assets/mbl2.png`}
              alt="hero"
              height={700}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </picture>
        </ContainerScroll>
      </div>
    </section>
  );
};

export default Showcase;
