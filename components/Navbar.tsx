import React from "react";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className=" z-100 lg:w-[70vw] w-full rounded-xl shadow-sm border border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/assets/logo.png" alt="logo" width={100} height={100} />
      </div>
      <ul className="hidden md:flex items-center gap-8 text-black font-medium">
        <Link href="" className="cursor-pointer hover:opacity-70">
          Home
        </Link>
        <Link href="" className="cursor-pointer hover:opacity-70">
          Courses
        </Link>
        <Link href="" className="cursor-pointer hover:opacity-70">
          About
        </Link>
        <Link href="" className="cursor-pointer hover:opacity-70">
          Consulting
        </Link>
        <Link href="" className="cursor-pointer hover:opacity-70">
          Community
        </Link>
      </ul>
      <button className="bg-[#d9ebff] text-blue-600 font-medium px-5 py-1.5 rounded-full hover:bg-blue-100 transition">
        Login
      </button>
    </nav>
  );
};

export default Navbar;
