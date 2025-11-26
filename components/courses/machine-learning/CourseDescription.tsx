import React from "react";
import Image from "next/image";

const CourseDescription = () => {
  return (
    <section className="w-full flex flex-col justify-center items-center py-10 px-6 md:px-12 lg:px-20 ">
      {/* TOP TEXT */}

      {/* MAIN HEADLINE */}
      <h3 className="text-center text-2xl md:text-4xl font-bold text-black leading-tight mb-12">
        Want to learn the most in demand Skill in IT <br /> in{" "}
        <span className="bg-purple-300 rounded-xl px-4">3 Months?</span> Hear me
        out
      </h3>
      <p className="text-center max-w-[1000px] lg:text-2xl md:text-lg font-poppins leading-relaxed text-gray-600 mb-10">
        The Introduction to AI/ML course by Foundry Academy is a
        beginner-friendly program designed for students after A/Ls who are
        curious about Artificial Intelligence and Machine Learning. Throughout
        the course, students learn the essentials of Python programming, data
        analysis with Pandas and NumPy, and data visualization using Matplotlib.
        They also explore how real AI models work through hands-on lessons in
        regression, classification, and basic web deployment. By the end,
        students gain practical skills to build simple AI projects and
        understand how modern technologies like ChatGPT and image generators
        shape the world
      </p>

      {/* VIDEO THUMBNAIL */}
      <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl relative"></div>
    </section>
  );
};

export default CourseDescription;
