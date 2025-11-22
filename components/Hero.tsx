import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="md:w-[80vw] lg:[70vw]  py-20 px-6 md:px-6 grid grid-cols-1 bg-red-500 sm:bg-cyan-500 md:bg-pink-500 lg:bg-orange-500 xl:bg-green-500 2xl:bg-yellow-500 lg:grid-cols-2 items-center  gap-12">
      <div className="flex flex-col gap-6 bg-blue-500 md:bg-gray-500 lg:bg-yellow-500 xl:bg-red-500 2xl:bg-pink-500 lg:pl-13">
        <div className="flex bg-green-500 md:bg-cyan-500 lg:bg-green-500 xl:bg-yellow-500 2xl:bg-blue-800 gap-3 items-center">
          <div className="hidden lg:flex bbg-black w-2 2xl:w-3 "></div>
          <h1 className="text-5xl sm:text-7xl md:text-[68px] lg:text-[43px] xl:text-[59px] 2xl:text-[73px] font-alt font-bold leading-tight max-lg:text-center text-black">
            To Ignite Your Potential
          </h1>
        </div>
        <p className="text-3xl max-lg:text-center sm:text-5xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-black-600">
          Foundry Academy
        </p>
        <div className="flex max-lg:justify-center ">
          <p className="text-lg font-poppins sm:text-xl bg-yellow-500 text-gray-700 max-w-lg">
            Next level learning with recorded lessons, assignments & peer
            feedback,
            <span className="bg-red-500 text-white px-2 py-0.5 rounded ml-1">
              all in Sinhala
            </span>
          </p>
        </div>
        <div className="w-full flex max-lg:justify-center">
          <button className="mt-4 w-full bg-[#d9ebff] text-blue-600  max-w-[400px] font-medium  px-5 py-3 rounded-lg hover:bg-blue-100 transition text-center">
            Login
          </button>
        </div>
      </div>

      {/* RIGHT SIDE – Single Hero Image */}
      <div className="w-full flex bg-pink-500 md:bg-red-500 lg:bg-blue-500 xl:bg-pink-500 2xl:bg-purple-500 justify-center lg:justify-end">
        <Image
          src="/assets/hero4.png" // ← your single combined hero image
          alt="Foundry Academy Students"
          width={1000}
          height={1000}
          className=""
        />
      </div>
    </section>
  );
};

export default Hero;
