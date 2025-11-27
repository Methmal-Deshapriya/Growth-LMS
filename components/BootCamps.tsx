import Image from "next/image";
import BootCampCard from "./BootCampCard";
import HoverTooltip from "@/components/HoverTooltip";
import { section } from "motion/react-client";

const instructors = [
  {
    name: "Anushka Bandara",
    src: "/assets/anushka1.png",
  },
  {
    name: "Methmal Deshapriya",
    src: "/assets/methmal1.png",
  },
];
const BootCamps = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden w-full">
      <div className="absolute top-100 rotate-10 left-0 w-150 h-72 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -rotate-30 right-0 w-150 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="w-full 2xl:w-[70vw] mt-20 max-w-[1300px]   px-6 md:px-12 lg:px-20">
        {/* HEADING */}
        <div className="text-center mb-14">
          <h2 className="text-xl md:text-2xl 2xl:text-3xl font-semibold text-gray-700">
            Boost your skills through our
          </h2>

          <h1 className="text-5xl sm:text-6xl md:text-7xl 2xl:text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-blue-600">
            Bootcamps
          </h1>

          <p className="text-gray-600 md:text-lg xl:text-xl mt-4 max-w-3xl mx-auto">
            Start as a beginner and graduate job ready, gaining hands-on skills,
            real-world experience, and the credentials you need to kickstart
            your tech career.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 z-10 sm:grid-cols-2 gap-8 ">
          <BootCampCard />
        </div>
        <div className="flex items-center justify-center mt-30">
          <div className="border border-[#C5B7FF] rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Curvy background lines */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg
                viewBox="0 0 500 200"
                className="w-full h-full text-indigo-400"
                fill="none"
              >
                <path
                  d="M0 150 C150 50, 350 250, 500 100"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M0 80 C200 180, 300 0, 500 160"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
              {/* Left Side */}
              <div className="max-w-md">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                  Still not sure whether this program is right for you ?
                </h2>
                <p className="text-gray-600 mb-6">
                  Book a call with our instructors to learn how we can
                  accelerate your IT journey from months to just weeks.
                </p>

                <button className="bg-[#7B68EE] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90">
                  Message Us
                </button>
              </div>

              {/* Right side avatars */}
              <div className="flex flex-col md:flex-row gap-4  ">
                {instructors.map((instructor, i) => (
                  <HoverTooltip tooltip={instructor.name}>
                    <Image
                      key={i}
                      src={instructor.src}
                      alt="Advisor"
                      width={200}
                      height={200}
                      className="rounded-full h-50 border-2 border-indigo-400 object-cover"
                    />
                  </HoverTooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BootCamps;
