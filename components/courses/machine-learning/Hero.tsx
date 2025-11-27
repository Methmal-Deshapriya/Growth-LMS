import { IoIosTimer } from "react-icons/io";
import React from "react";
import Image from "next/image";
import { IoVideocamOutline } from "react-icons/io5";
const Hero = () => {
  return (
    <section className=" relative flex flex-col items-center justify-center w-screen overflow-hidden">
      <div className="absolute -rotate-30 top-10 lg:top-60 -left-10 w-172 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>

      <div className="absolute top-30 right-0 w-152 -rotate-35 h-40 lg:h-112 bg-indigo-300 opacity-20 blur-3xl rounded-full "></div>
      <div className="w-screen   lg:w-[80vw] xl:w-[70vw] 2xl:w-[60vw]  py-20 px-6 md:px-12 lg:px-20  ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT IMAGE */}
          <div className="hidden z-10 lg:flex justify-center">
            <Image
              src="/assets/machine-learning/mlhero.png" // change as needed
              alt="Course Hero"
              width={350}
              height={350}
              className="rounded-3xl shadow-lg object-cover"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col z-10">
            {/* TAGS */}
            <div className="flex flex-wrap max-lg:justify-center gap-3 mb-6">
              <span className="px-4 py-2 text-sm font-medium bg-white border rounded-full shadow-sm flex items-center gap-2">
                <IoIosTimer />
                16 Weeks
              </span>

              <span className="px-4 py-2 text-sm font-medium bg-white border rounded-full shadow-sm flex items-center gap-2">
                <IoVideocamOutline />
                40+ hours of Learning
              </span>
            </div>
            <div className="flex flex-col ">
              <h1 className="text-[38px] sm:text-[50px] md:text-[60px] lg:text-[70px] max-lg:text-center font-extrabold leading-[1.1] bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-blue-600">
                AI/Machine Learning Ignition Program
              </h1>

              <p className="mt-5 text-xl text-gray-700 max-lg:text-center">
                Certification Program
              </p>
            </div>

            <div className="mt-8 flex flex-wrap max-lg:justify-center items-center gap-6">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition">
                Apply for Program
              </button>

              <button className="text-blue-700 underline text-lg">
                View Pricing Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
