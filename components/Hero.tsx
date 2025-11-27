import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="relative flex items-center justify-center w-full to-blue-10 overflow-hidden ">
      <div className="z-10 md:w-[80vw] 2xl:w-[70vw] py-10 px-6 sm:mb-10 md:px-6 grid grid-cols-1  lg:grid-cols-2 items-center  gap-12">
        <div className="flex flex-col  lg:ml-10">
          <div className="flex max-lg:justify-center ">
            <h1 className="text-4xl text-nowrap sm:text-7xl md:text-[68px] lg:text-[53px] xl:text-[69px] 2xl:text-[80px] font-alt font-bold leading-tight max-lg:text-center text-black">
              Empower Your <br /> Future With <br />{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-blue-600 ">
                Foundry{" "}
              </span>
            </h1>
          </div>

          <div className="w-full   flex max-lg:items-center max-lg:justify-center">
            <p className="text-lg max-lg:text-center font-poppins sm:text-xl 2xl:text-2xl text-gray-700 max-w-lg">
              Next level learning with recorded lessons, assignments & peer
              feedback,
              <span className=" text-black font-bold underline px-2 py-0.5 rounded ml-1">
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
        <div className="w-full flex z-0  justify-center lg:justify-end">
          <Image
            src="/assets/hero3.png" // ← your single combined hero image
            alt="Foundry Academy Students"
            width={1000}
            height={1000}
            className=""
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
