import React from "react";
import { cn } from "@/lib/utils";

type theme = {
  durationBackground: string;
};

type Props = {
  courseDescription_headline_duration: string;
  courseDescription_headline_persuational: string;
  courseDescription_description: string;
  theme?: theme;
};

const CourseDescription = ({
  courseDescription_headline_duration,
  courseDescription_headline_persuational,
  courseDescription_description,
  theme,
}: Props) => {
  return (
    <section className="w-full flex flex-col  justify-center items-center pt-10 px-6 md:px-12 lg:px-20 ">
      <h3 className="text-center text-2xl md:text-4xl font-bold text-black leading-tight mb-12">
        Want to learn the {courseDescription_headline_persuational} <br /> in{" "}
        <span
          className={cn(
            "bg-purple-300 rounded-xl px-4",
            theme?.durationBackground,
          )}
        >
          {courseDescription_headline_duration}
        </span>{" "}
        Hear me out
      </h3>
      <p className="text-center max-w-[1000px] lg:text-2xl md:text-lg font-poppins leading-relaxed text-gray-600 mb-10">
        {courseDescription_description}
      </p>
    </section>
  );
};

export default CourseDescription;