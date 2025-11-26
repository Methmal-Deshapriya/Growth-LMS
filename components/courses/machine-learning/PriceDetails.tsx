import React from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
const PriceDetails = () => {
  return (
    <section className="w-full flex flex-col justify-center items-center py-10 px-6 md:px-12 lg:px-20">
      <div className="border border-[#D9D9FF] rounded-2xl p-10 md:p-12 flex flex-col md:flex-row justify-between gap-10">
        <div className="max-w-xl">
          <span className="px-4 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
            Unlock the Access to
          </span>

          <h3 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-900">
            AI/Machine Learning <br /> Ignition Program
          </h3>

          <p className="text-gray-600 mt-2">
            and tour best in class learning benefits.
          </p>

          <ul className="mt-6 space-y-4 text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-indigo-500" />
              Project based Learning
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-indigo-500" />
              Interview Skills Enhanced with Every Module
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-indigo-500" />
              Unlimited Personal Mentorship
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-indigo-500" />
              Access Tons of Bonus Learning Guides, Materials
            </li>
          </ul>
        </div>

        <div className="w-full md:w-[40%]">
          <p className="text-gray-700 text-lg">For this launch</p>

          <h3 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
            LKR 7,500
          </h3>
          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Apply for Program
          </button>

          <button className="w-full mt-4 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            Download Course Catalog
            <span className="text-xl">📥</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PriceDetails;
