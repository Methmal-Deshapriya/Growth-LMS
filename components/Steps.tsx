import React from "react";
import { Timeline } from "./ui/timeline";
import Image from "next/image";
const Steps = () => {
  const data = [
    {
      title: "1.",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Personalized onboarding & career roadmapping
          </p>
          <div className="">
            <Image
              src="/assets/step11.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-full w-full  rounded-lg object-cover "
            />
          </div>
        </div>
      ),
    },
    {
      title: "2.",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800 dark:text-neutral-200">
            Immersive, Production-Standard Software Development + Mentorship
          </p>

          <div className="">
            <Image
              src="/assets/step22.svg"
              alt="cards template"
              width={500}
              height={500}
              className="h-full w-full rounded-lg object-cover "
            />
          </div>
        </div>
      ),
    },
    {
      title: "3.",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Career coaching + job search help + placement
          </p>

          <div className="">
            <Image
              src="/assets/step3.svg"
              alt="cards template"
              width={500}
              height={500}
              className="h-full w-full rounded-lg object-cover "
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full 2xl:w-[70vw] max-w-[1300px]  relative max-md:-mt-120 -mt-80 overflow-clip ">
      <Timeline data={data} />
    </div>
  );
};

export default Steps;
