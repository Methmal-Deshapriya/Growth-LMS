import React from "react";
import Hero from "@/components/courses/machine-learning/Hero";
import CourseDescription from "@/components/courses/machine-learning/CourseDescription";
import Curriculum from "@/components/courses/machine-learning/Curriculum";
import ForWho from "@/components/courses/machine-learning/ForWho";
import Certificate from "@/components/courses/machine-learning/Certificate";
import PriceDetails from "@/components/courses/machine-learning/PriceDetails";
const CoursePage = async ({
  params,
}: {
  params: Promise<{ bootcamp: string }>;
}) => {
  const courseName = (await params).bootcamp;
  console.log(courseName);
  return (
    <div className="md:w-[80vw] lg:w-[70vw] flex flex-col items-center">
      <Hero />
      <CourseDescription />
      <Curriculum />
      <ForWho />
      <Certificate />
      <PriceDetails />
    </div>
  );
};

export default CoursePage;
