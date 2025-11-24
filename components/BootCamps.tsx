import React from "react";
import Image from "next/image";
import mlImage from "../public/assets/machine learning.svg";
import feImage from "../public/assets/full stack.svg";
import uxImage from "../public/assets/uxui.svg";
import dsImage from "../public/assets/data science.svg";

const BootCamps = () => {
  return (
    <section className="w-full 2xl:w-[70vw] max-w-[1300px]   px-6 md:px-12 lg:px-20">
      {/* HEADING */}
      <div className="text-center mb-14">
        <h2 className="text-xl md:text-2xl 2xl:text-3xl font-semibold text-gray-700">
          Boost your skills through our
        </h2>

        <h1 className="text-5xl sm:text-6xl md:text-7xl 2xl:text-8xl font-extrabold text-[#0216EA]">
          Bootcamps
        </h1>

        <p className="text-gray-600 md:text-lg xl:text-xl mt-4 max-w-3xl mx-auto">
          Start as a beginner and graduate job ready, gaining hands-on skills,
          real-world experience, and the credentials you need to kickstart your
          tech career.
        </p>
      </div>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
        {/* CARD 1 — AI/ML */}
        <div className="relative bg-[#008CFF] rounded-3xl p-8 flex flex-col h-[40vh] justify-between shadow-xl overflow-hidden">
          <div className="z-10 ">
            <h3 className="text-[#00026E] text-3xl md:text-4xl xl:text-5xl xl:mt-10 2xl:ml-7 font-bold [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]">
              AI/ML
            </h3>
            <p className="text-white font-medium xl:text-xl 2xl:ml-7 [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]">
              Ignition Program
            </p>
          </div>

          <div className="absolute right-0 bottom-0 mt-6 flex  justify-end">
            <Image
              src={mlImage}
              width={180}
              height={180}
              alt="AI Bootcamp"
              className="w-[210px] sm:w-[170px] md:w-[180px] lg:w-[200px] 2xl:w-[210px] h-auto"
            />
          </div>

          <p className="z-10 mt-3 text-white font-medium cursor-pointer">
            View Course &gt;
          </p>
        </div>

        {/* CARD 2 — Full Stack */}
        <div className="relative bg-[#0C1863] h-[40vh] rounded-3xl p-8 flex flex-col justify-between shadow-xl overflow-hidden">
          <div className="z-10">
            <h3 className="text-[#1D21FF] text-3xl font-bold [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]">
              Full Stack
            </h3>
            <p className="text-white font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]">
              Engineering
            </p>
          </div>

          <div className="absolute right-3 xl:right-6 2xl:right-10 top-12 mt-6 flex  justify-end">
            <Image
              src={feImage}
              width={200}
              height={200}
              alt="Full Stack Bootcamp"
              className="w-[350px] h-auto"
            />
          </div>

          <p className="z-10 mt-3 text-white font-medium cursor-pointer">
            View Course &gt;
          </p>
        </div>

        {/* CARD 3 — Data Science */}
        <div className="relative bg-[#16F501] h-[40vh] rounded-3xl p-8 flex flex-col justify-between shadow-xl overflow-hidden">
          <div className="z-10">
            <h3 className="text-[#005721] text-3xl md:text-4xl xl:text-5xl font-bold [text-shadow:0_2px_8px_rgba(0,0,0,0.2)] ">
              Data
            </h3>
            <p className="text-white xl:text-xl font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.2)]">
              Science
            </p>
          </div>

          <div className="absolute right-2 xl:right-6 2xl:right-10 top-12 mt-6 flex  justify-end">
            <Image
              src={dsImage}
              width={200}
              height={200}
              alt="Data Science Bootcamp"
              className="w-[350px] h-auto"
            />
          </div>

          <p className="z-10 mt-3 text-white font-medium cursor-pointer">
            View Course &gt;
          </p>
        </div>

        {/* CARD 4 — UX/UI */}
        <div className=" relative bg-[#F62346] h-[40vh] rounded-3xl p-8 flex flex-col justify-between shadow-xl overflow-hidden">
          <div className="z-10">
            <h3 className="text-[#FFBACC] text-3xl font-bold">UX/UI</h3>
            <p className="text-white font-medium">Design</p>
          </div>

          <div className="absolute right-3 2xl:right-10  top-8 lg:top-1 2xl:top-2  mt-6 flex  justify-end">
            <Image
              src={uxImage}
              width={200}
              height={200}
              alt="UX UI Bootcamp"
              className="w-[270px] lg:w-[320px] xl:w-[350px] h-auto"
            />
          </div>

          <p className="z-10 mt-3 text-white font-medium cursor-pointer">
            View Course &gt;
          </p>
        </div>
      </div>
    </section>
  );
};

export default BootCamps;
