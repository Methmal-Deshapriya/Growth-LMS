import React from "react";
import { motion } from "framer-motion";
import { FaAnglesUp } from "react-icons/fa6";

const Advice = () => {
  return (
    <section className="relative flex flex-col w-screen items-center justify-center gap-8 mt-10 max-lg:overflow-hidden ">
      <div className="absolute top-20 -left-10 w-172 h-72 bg-red-300 opacity-20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-20 right-0 w-96 h-96 bg-green-300 opacity-20 rounded-full blur-3xl"></div>
      <div className=" py-10 -mt-10 px-6 flex w-full  items-center flex-col lg:flex-row gap-8 justify-center  lg:w-[80vw]   2xl:w-[70vw] ">
        <div
          className="bg-card max-w-[600px] shadow-lg hover:shadow-xl flex flex-col items-center justify-center rounded-2xl p-8 border border-border w-full h-[40vh] 2xl:h-[35vh] 2xl:w-[360px]
                  lg:translate-y-12 transition-all duration-300 "
        >
          <div className="w-14 h-14  bg-red-300 text-white flex items-center justify-center rounded-full mb-5">
            <h1 className="text-2xl ">1</h1>
          </div>
          <h2 className="text-xl text-center font-semibold mb-2">
            We start with <br /> nothing
          </h2>

          <p className="text-sm text-center leading-relaxed opacity-90">
            No prior knowledge nor experience needed — we start from zero. We'll
            lay the foundation for you.
          </p>
        </div>

        <div
          className="bg-card max-w-[600px] shadow-lg hover:shadow-xl flex flex-col items-center justify-center rounded-2xl p-8 border border-border w-full h-[40vh] 2xl:h-[35vh] 2xl:w-[360px]
                   lg-translate-y-6  transition-all duration-300"
        >
          <div className="w-14 h-14 bg-orange-300 text-white flex items-center justify-center rounded-full mb-5">
            <h1 className="text-2xl ">2</h1>
          </div>

          <h2 className="text-xl text-center font-semibold mb-2">
            Show <br /> Consistency
          </h2>

          <p className="text-sm text-center leading-relaxed opacity-90">
            Actively participate in sessions, complete assignments before
            deadlines. Rewatch, revise, rethink, and build brand new.
          </p>
        </div>

        <div
          className="bg-card max-w-[600px] shadow-lg hover:shadow-xl flex flex-col items-center justify-center rounded-2xl p-8 border border-border w-full h-[40vh] 2xl:h-[35vh] 2xl:w-[360px]
                   lg:translate-y-12  transition-all duration-300"
        >
          <div className="w-14 h-14 bg-green-300 text-white flex items-center justify-center rounded-full mb-5">
            <h1 className="text-2xl ">3</h1>
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">
            Grow Beyond <br /> Limits
          </h2>

          <p className="text-sm text-center leading-relaxed opacity-90">
            Keep exploring, experimenting, and learning. Transform your ideas
            into real-world projects.
          </p>
        </div>
      </div>
      <div className="-mt-10 gap-2 flex flex-col items-center justify-center">
        <FaAnglesUp />
        <p className="">How To Success</p>
      </div>
    </section>
  );
};

export default Advice;