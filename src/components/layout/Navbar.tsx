"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectAuthRole,
  selectAuthUser,
} from "@/features/auth/authSelectors";
import { Button } from "@/components/ui/button";
import { isStudent } from "@/lib/access";

const Navbar = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);

  return (
    <nav className=" z-100 lg:w-[70vw] lg:mt-5 w-full bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image src="/assets/logo.png" alt="logo" width={100} height={100} />
        </Link>
      </div>
      
      <div className="flex items-center gap-8">
        <ul className="hidden md:flex items-center gap-8 text-black font-medium">
          <Link href="/" className="cursor-pointer hover:opacity-70">
            Home
          </Link>
          <Link href="/bootcamps" className="cursor-pointer hover:opacity-70">
            Courses
          </Link>
          <Link href="/about" className="cursor-pointer hover:opacity-70">
            About
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="cursor-pointer hover:opacity-70">
                Dashboard
              </Link>
              {isStudent(role) && (
                <Link href="/my-courses" className="cursor-pointer hover:opacity-70">
                  My Courses
                </Link>
              )}
            </>
          )}
        </ul>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
