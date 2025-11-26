import React from "react";
import Image from "next/image";
const ForWho = () => {
  return (
    <section className=" overflow-hidden z-10 w-full py-20 px-6 md:px-12 lg:px-20 bg-white">
      {/* HEADER */}
      <h2 className="text-center text-3xl md:text-5xl font-bold text-black mb-16">
        Special For <span className="text-blue-600 underline">After A/L</span>{" "}
        <span>Students</span>
      </h2>

      {/* THREE COLUMN SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
        {/* LEFT IMAGE */}
        <div className="rounded-xl overflow-hidden shadow">
          <Image
            src="/assets/machine-learning/al.webp"
            alt="Student studying"
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
        {/* MIDDLE DESCRIPTION */}
        <div className=" border border-gray-300 rounded-xl overflow-hidden">
          <div className=" p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4">
              Why we say this is special for after A/L students?
            </h3>

            {/* Tooltip */}
            <div className="relative mb-6">
              <div className="bg-blue-600 text-white text-sm rounded-lg px-4 py-2 shadow-md w-fit">
                You are entering to the most rapid growing industry
                <br />
                Getting the knowledge from players in the game early will put
                you ahead of the game!
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed text-[15px]">
              You'll get a clear idea of how university-style learning works.
              Experience doing assignments and projects like in university.
              Basic Python and data analysis skills. Hands-on experience with AI
              and Machine Learning. Confidence to start university ICT or
              AI-related studies. A completed mini AI project to show their
              skills.
            </p>
          </div>
        </div>

        {/* RIGHT JOB ACCELERATION BOX */}
        <div className="border border-gray-300 rounded-xl p-6 md:p-8 rounded-tr-[60px]">
          <h3 className="text-xl font-semibold mb-4">
            What is necessary to success?
          </h3>

          {/* Stat item */}
          <p className="text-gray-600 mb-1">
            Attend every live session and interact with instructors
          </p>
          <p className="text-2xl font-bold text-black mb-4">
            3h Sessions per Week
          </p>

          {/* Divider */}
          <div className="h-1 w-12 bg-blue-600 mb-4 rounded"></div>

          <p className="text-gray-600 mb-1">Dedicate 5-7 hours practising </p>
          <p className="text-2xl font-bold text-black">
            12 Weeks + Bunch of Practicles
          </p>
        </div>
      </div>

      {/* TECHNOLOGY SECTION */}
      <div className="mt-4 border border-gray-300 rounded-xl p-8">
        <h3 className="text-center text-xl md:text-2xl font-semibold mb-4">
          Skill set you'll gained throughout the bootcamp
        </h3>
        <h4 className="text-center text-lg text-gray-700 mb-10">
          most In-demand skills
        </h4>

        {/* Tech Skills Row */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Example tech chips */}
          {[
            "Machine learning",
            "Data Cleaning",
            "Data Engineering",
            "Prompt Engineering",
            "Python",
            "Pandas",
            "Numpy",
            "Feature Engineering",
            "FastAPI",
            "Data Visualization",

            "Supervised Learning",
            "Git",
            "Github",
            "Netlify",
            "Reactjs",
          ].map((tech, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm shadow-sm flex items-center gap-2"
            >
              {/* Optional icon slot */}
              <span className="text-gray-700">{tech}</span>
            </span>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Add these to your{" "}
          <span className="text-blue-500 underline">LinkedIn</span> Profile
        </p>
      </div>
    </section>
  );
};

export default ForWho;
