import { i } from "motion/react-client";
import React from "react";
import Image from "next/image";
const Certificate = () => {
  return (
    <section className="relative w-screen overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-30 rotate-20 left-0 w-132 h-72 bg-red-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-126 h-76 bg-green-300 opacity-20 rounded-full blur-3xl"></div>

      <div className="w-full md:w-[80vw] lg:w-[70vw] z-10 py-10 px-6 md:px-12 ">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-black mb-4">
            Will you be certified? <br />
            Of course! You'll get a sharable{" "}
            <span className="text-blue-600 decoration-4 underline-offset-4">
              Digital Certificate
            </span>
          </h2>
        </div>

        {/* Certificate Card */}
        <div className="flex justify-center">
          <div className="rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden">
            <Image
              src="/assets/machine-learning/certification.png" // Update path
              alt="Full-stack Engineer Certificate"
              width={800}
              height={600}
              className=" w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificate;
