import React from "react";
import Image from "next/image";
const Instructors = () => {
  return (
    <section className="w-full md:w-[80vw]   lg:w-[70vw] 2xl:w-[60vw] max-w-[1000px] mt-20 pt-20  px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-5 items-center">
      <div className="flex justify-center lg:justify-start ">
        <Image
          src="assets/parro2.svg"
          alt="Pappi introducing instructors"
          width={500}
          height={500}
          className="w-full max-w-[420px] h-auto"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-end relative ">
        <div className="flex lg:mr-43 lg:mt-10 justify-center  items-center">
          <Image
            src="/assets/m.png"
            alt="Instructor 1"
            width={200}
            height={200}
            className="w-[200px] h-auto"
          />
        </div>
        <div className="lg:absolute -top-10 flex justify-center  items-center lg:-ml-12 ">
          <Image
            src="/assets/a.png"
            alt="Instructor 2"
            width={200}
            height={200}
            className=""
          />
        </div>
      </div>
    </section>
  );
};

export default Instructors;
