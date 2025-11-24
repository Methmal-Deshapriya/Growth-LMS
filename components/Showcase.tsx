"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Image from "next/image";
const Showcase = () => {
  return (
    <div className="flex flex-col h-[120vh] ">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold font-funnel -mt-110 text-black">
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
  );
};

export default Showcase;
