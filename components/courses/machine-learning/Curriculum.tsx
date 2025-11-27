import React from "react";
import { Timeline } from "../../ui/timeline";
import Image from "next/image";

const Curriculum = () => {
  const data = [
    {
      title: "Week 1",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Getting Started with AI & Environment Setup
          </p>
          <p className="text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            Your journey begins here! In this first week, we strip away the
            complexity of setting up a coding environment. Students will get
            comfortable with the tools of the trade, installing Python and VS
            Code, and learning how to navigate Jupyter Notebooks. We focus on
            getting your computer ready to "think" like a data scientist,
            ensuring everyone starts on the same page regardless of their
            technical background.
          </p>
        </div>
      ),
    },
    {
      title: "Week 2",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800 dark:text-neutral-200">
            The World of AI & Generative Technologies
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            What actually is Artificial Intelligence? Beyond the movies and
            hype, we explore the history and future of AI. This week dives into
            the exciting world of Generative AI, exploring how Large Language
            Models (like ChatGPT) and image generators work. Students will learn
            the difference between "Narrow AI" and "General AI" and discuss the
            ethical considerations of using these powerful tools in the real
            world.
          </p>
        </div>
      ),
    },
    {
      title: "Week 3",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Python for AI – From Basics to Advanced
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            Python is the language of AI, and this week covers it all. We move
            quickly from "Hello World" to writing complex logic. Students will
            master the core programming concepts essential for Machine
            Learning—variables, loops, functions, and data structures. By the
            end of this module, students will be writing clean, efficient code
            that serves as the foundation for all future data analysis.
          </p>
        </div>
      ),
    },
    {
      title: "Week 4",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Data Handling with Pandas
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            Data is the fuel for AI, but real-world data is often messy. In this
            module, students learn to tame data using Pandas, the
            industry-standard library for data manipulation. You will learn how
            to load datasets (like Excel or CSV files), clean up errors, filter
            information, and structure raw data into a format that computers can
            understand and analyze.
          </p>
        </div>
      ),
    },
    {
      title: "Week 5",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Data Processing & Visualization
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            Numbers alone can be hard to interpret. This week focuses on
            Matplotlib and Seaborn to turn data into visual stories. Students
            will learn how to process numerical data using NumPy and create
            compelling charts, graphs, and heatmaps. This skill is crucial for
            identifying trends, outliers, and patterns that are invisible in a
            spreadsheet.
          </p>
        </div>
      ),
    },
    {
      title: "Week 6",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Data Analysis in Action
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            It’s time to put theory into practice. In this hands-on module,
            students will take a raw, real-world dataset and perform a complete
            Exploratory Data Analysis (EDA). By combining the Python, Pandas,
            and plotting skills learned so far, students will uncover hidden
            insights and answer real questions about the data, mimicking the
            day-to-day work of a junior data analyst.
          </p>
        </div>
      ),
    },
    {
      title: "Week 7",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Introduction to Machine Learning
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            This is where the magic happens. We demystify "training a model."
            Students will be introduced to Scikit-learn and the core concepts of
            Supervised Learning. We will cover Regression (predicting numbers,
            like house prices) and Classification (sorting things, like spam vs.
            not spam). Students will build, train, and test their very first
            predictive models.
          </p>
        </div>
      ),
    },
    {
      title: "Week 8",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Bringing AI to the Web
          </p>
          <p className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            An AI model living on your laptop isn't very useful to the world.
            This week teaches students how to deploy their models using simple
            web frameworks (like Streamlit). You will learn to build a
            user-friendly interface where anyone can input data and get a
            prediction from your AI, effectively turning your code into a
            functional web application.
          </p>
        </div>
      ),
    },
    {
      title: "Week 9 - 12",
      content: (
        <div>
          <p className="mb-8 text-xl sm:text-3xl font-normal md:font-semibold  text-neutral-800  dark:text-neutral-200">
            Final Project & Wrap-Up
          </p>

          <div className=" text-xl -mt-5 text-[12px] sm:text-sm font-poppins text-neutral-500  dark:text-neutral-200">
            <p className="mb-4">
              Students work individually or in small teams to identify a
              real-world problem they want to solve using AI.
            </p>
            <p className="mb-4">
              Over several weeks, students apply every skill they have
              learned—collecting data, cleaning it, training a model, and
              building a web interface.
            </p>
            <p>
              The course concludes with a final presentation where students
              demonstrate their working AI applications. We also wrap up with
              career guidance, discussing next steps for those who want to
              pursue a career in Data Science or Software Engineering.
            </p>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-screen flex flex-col items-center lg:w-[80vw] xl:w-[70vw] 2xl:w-[60vw]  py-10 px-6 md:px-12 lg:px-20 ">
      <div className="max-w-7xl items-center mx-auto  px-4 md:px-8 lg:px-10 ">
        <h2 className="text-3xl sm:text-5xl font-semibold mb-20 text-center text-black dark:text-white max-w-4xl">
          Our <span className="text-blue-500">12 Weeks</span> AI/ML Journey
        </h2>
      </div>
      <div className="bg-blue-50 rounded-3xl overflow-hidden">
        <Timeline data={data} />
      </div>
    </div>
  );
};

export default Curriculum;
