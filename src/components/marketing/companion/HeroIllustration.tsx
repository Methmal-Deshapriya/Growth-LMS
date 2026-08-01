import React from "react";
import Image from "next/image";

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
      <div className="text-left mb-4 px-2">
        <h3 className="font-sans text-xl font-bold text-[#0E1116] leading-snug">
          Your learning journey,{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
            all in one place.
          </span>
        </h3>
        <p className="font-alt text-sm text-[#5B6472] mt-2">
          Track progress, attend sessions, complete assignments, and level up
          your skills.
        </p>
      </div>

      <Image
        src="/greeting.png"
        alt="Foundry Academy student dashboard"
        width={1402}
        height={1122}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}
