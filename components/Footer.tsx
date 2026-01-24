import React from "react";
import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="w-full bg-[#0D0F16] text-gray-300 mt-10 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* -------- COMPANY BRAND SECTION -------- */}
        <div className="space-y-4 ">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/llogo.png" // <-- Replace with your logo
              alt="Foundry Logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <p className="text-xl text-white font-bold font-alt leading-relaxed">
              FOUNDRY
            </p>
          </div>

          <p className="text-sm leading-relaxed">
            Building Smarter Websites and Data-Driven Solutions
          </p>

          <div className="space-y-1 text-sm">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=cources.foundry@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-blue-500"
            >
              cources.foundry@gmail.com
            </a>
            <p>072 362 2112</p>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 pt-2">
            <Image
              src="/assets/sl.png" // <-- Replace with flag image
              alt="Sri Lanka Flag"
              width={30}
              height={20}
            />
            <div className="text-sm space-y-0.5">
              <p>Sri Lanka</p>
              <p>No 34, Boralugoda,</p>
              <p>Kosgama, Avissawella</p>
              <p>Western Province</p>
            </div>
          </div>
        </div>

        {/* -------- COMPANY NAV -------- */}
        <div>
          <h4 className="font-semibold text-white mb-4">COMPANY</h4>
          <nav className="space-y-3 text-sm">
            <p className="hover:text-white cursor-pointer">Home</p>
            <p className="hover:text-white cursor-pointer">About</p>
            <p className="hover:text-white cursor-pointer">Services</p>
            <p className="hover:text-white cursor-pointer">Contact</p>
          </nav>
        </div>

        {/* -------- SERVICES NAV -------- */}
        <div>
          <h4 className="font-semibold text-white mb-4">SERVICES</h4>
          <nav className="space-y-3 text-sm">
            <p>
              <Link
                href="/bootcamps/machine-learning"
                className="hover:text-white cursor-pointer"
              >
                Machine learning Ignition program
              </Link>
            </p>
            <p className="hover:text-white cursor-pointer">
              Full Stack Development
            </p>
            <p className="hover:text-white cursor-pointer">
              Maching learning Advanced program
            </p>
          </nav>
        </div>

        {/* -------- POLICIES NAV -------- */}
        <div>
          <h4 className="font-semibold text-white mb-4">POLICIES</h4>
          <nav className="space-y-3 text-sm">
            <p className="hover:text-white cursor-pointer">
              Terms & Conditions
            </p>
            <p className="hover:text-white cursor-pointer">Privacy Policy</p>
            <p className="hover:text-white cursor-pointer">Payment Policy</p>
            <p className="hover:text-white cursor-pointer">Refund Policy</p>
          </nav>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto mt-14 border-t border-gray-700/30 pt-6">
        <p className="text-center text-sm text-gray-400">
          © 2025 Foundry. LLC. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
