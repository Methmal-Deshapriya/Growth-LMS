import React from "react";
import Image from "next/image";
import parroImg from "../public/assets/P.svg";
const Parro = () => {
  return (
    <section className="w-full  md:w-[80vw] lg:w-[70vw] 2xl:w-[60vw] py-20 px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-5 items-center ">
      <div className="  flex flex-col justify-center   lg:justify-end    ">
        <div className=" flex flex-col items-center lg:items-start lg:pl-4 leading-tight">
          <p className="text-5xl md:text-7xl lg:text-4xl 2xl:text-5xl font-bold">
            Meet <span className="text-[#8B5CF6]">Parro,</span>
          </p>
          <p className="text-lg text-gray-500 -mt-1">Your companion</p>
        </div>
        <div className="flex justify-center ">
          <Image
            src={parroImg}
            alt="Meet Parro, your companion"
            width={200}
            height={200}
            className="w-full max-w-[300px] h-auto"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 2xl:ml-5 ">
        <div className="flex flex-col items-center lg:items-start ">
          <div className="flex gap-4 items-start ">
            <div className="w-2 h-30 bg-gray-400 rounded"></div>
            <div className="flex flex-col gap-2">
              <p className="text-xl md:text-2xl  font-semibold text-black">
                Are you
              </p>

              <p className="xl:text-8xl text-5xl md:text-6xl  -mt-4 font-extrabold text-[#FF2753] leading-tight">
                Nervous
              </p>

              <p className="text-[#FF2753] -mt-4 text-2xl font-medium -mt-1">
                about your career, academics ?
              </p>

              <p className="text-3xl lg:text-2xl xl:text-3xl font-bold text-black mt-1">
                Does this fit to me, <br /> am I good enough?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Parro;

{
  /* <div className="xl:flex flex-col hidden items-end ">
          <div className="flex gap-4 items-end">
            <div className="flex flex-col gap-2 items-end">
              <p className="text-lg font-semibold text-black">Everyone is</p>

              <p className="text-5xl font-extrabold text-[#22c901] leading-tight">
                Nervous
              </p>

              <p className="text-[#22c901] text-lg font-medium -mt-1">
                Because it's they're first time!
              </p>

              <p className="text-2xl font-bold text-black mt-1">
                Don’t worry we’ve <br /> got you covered!
              </p>
            </div>
            <div className="w-2 h-20 bg-gray-400 rounded"></div>
          </div>
        </div> */
}
