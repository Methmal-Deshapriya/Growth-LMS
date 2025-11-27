import React from "react";
import { Code, Globe, Users, Rocket, Layers } from "lucide-react";
const Introduction = () => {
  return (
    <section className="relative w-full flex flex-col justify-center items-center py-12 px-6 md:px-20  overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute top-20 -left-10 w-172 h-72 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="w-full 2xl:w-[70vw] max-w-[1300px]   px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome to the <span className="text-blue-500">IT Industry</span>
          </h2>

          <p className="text-gray-600 text-lg md:text-xl">
            One of the fastest-growing, highest-paying and most flexible career
            fields in the world — and you’re just getting started.
          </p>
        </div>

        {/* Feature Cards */}
        <div className=" grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">
          {/* Card 1 */}
          <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-8 border border-gray-100">
            <div className="w-14 h-14 bg-indigo-500 text-white flex items-center justify-center rounded-xl mb-5">
              <Globe size={28} />
            </div>
            <h3 className="font-semibold text-xl mb-3">A Global Industry</h3>
            <p className="text-gray-600">
              IT is borderless — companies worldwide hire talent from anywhere.
              Your skills open doors across the world.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-8 border border-gray-100">
            <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-xl mb-5">
              <Code size={28} />
            </div>
            <h3 className="font-semibold text-xl mb-3">
              Everything Runs on Code
            </h3>
            <p className="text-gray-600">
              From apps to banks to hospitals — software powers everything.
              Developers are the architects of the modern world.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-8 border border-gray-100">
            <div className="w-14 h-14 bg-purple-500 text-white flex items-center justify-center rounded-xl mb-5">
              <Rocket size={28} />
            </div>
            <h3 className="font-semibold text-xl mb-3">Fast-Growing Careers</h3>
            <p className="text-gray-600">
              Tech roles grow 5× faster than any other industry — and salaries
              rise rapidly with skill and experience.
            </p>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-20 bg-[#EEF2FF] border border-indigo-200 rounded-3xl p-10 text-center shadow-md">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
            You don’t need a degree to start.
          </h3>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Many of the world’s top developers, designers, and engineers began
            with no background in technology. All you need is{" "}
            <span className="text-blue-500">the right guidance</span> and{" "}
            <span className="text-blue-500">consistent learning</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
