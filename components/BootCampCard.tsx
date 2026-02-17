import React from "react";
import Image from "next/image";
import mlImage from "../public/assets/machine learning.svg";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Bootcamp = {
  id: number;
  slug: string;
  imageURL: string;
  title: string;
  description: string;
  status: string;
  cta: string;
  theme?: {
    statusColor: string;
  };
};

const BootCampCard = ({
  id,
  slug,
  imageURL,
  title,
  description,
  status,
  cta,
  theme,
}: Bootcamp) => {
  return (
    <div className="w-full max-w-xl z-10 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-56">
        <Image
          src={imageURL} // change to your image
          alt="Cyber Security Bootcamp"
          fill
          className="object-cover rounded-t-2xl rounded-br-[85px]"
        />

        {/* Status badge */}
        <span
          className={cn(
            "absolute top-4 left-4 bg-green-200 text-green-800 text-sm font-semibold px-3 py-1 rounded-full",
            theme?.statusColor,
          )}
        >
          {status}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">{description}</p>

        {/* CTA */}
        <div className="w-full flex justify-end">
          <Link
            href={`/bootcamps/${slug}`}
            className="text-lg font-medium text-blue-700 hover:underline flex items-center gap-2"
          >
            {cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BootCampCard;
