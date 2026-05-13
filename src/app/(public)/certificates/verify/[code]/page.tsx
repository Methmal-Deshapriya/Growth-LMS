"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useVerifyCertificateQuery } from "@/features/certificates/certificatesApi";
import { Loader2, Award, CheckCircle2, XCircle, Calendar, BookOpen, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Public Certificate Verification Page
 * 
 * Allows anyone to verify the authenticity of a certificate using its unique code.
 */
export default function VerifyCertificatePage() {
  const params = useParams();
  const code = params.code as string;

  const { data: cert, isLoading, isError } = useVerifyCertificateQuery(code);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 py-20">
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block mb-6">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
            Foundry<span className="text-gray-900">Academy</span>
          </span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
        <p className="text-gray-500 mt-2">Official registry of professional credentials.</p>
      </div>

      <div className="w-full max-w-2xl">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-20 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Verifying credential with registry...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-12 text-center">
            <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Certificate</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              We couldn&apos;t find a certificate with the code <span className="font-mono font-bold text-red-600">{code}</span>. 
              Please check the code and try again.
            </p>
            <Button asChild className="bg-gray-900 hover:bg-black text-white px-8 rounded-xl h-12">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        ) : cert ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Header Badge */}
            <div className={cn(
              "p-4 text-center text-xs font-bold uppercase tracking-widest",
              cert.status === "ISSUED" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            )}>
              {cert.status === "ISSUED" ? (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Authentic Credential Verified
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Certificate Revoked
                </span>
              )}
            </div>

            <div className="p-10 space-y-10">
              {/* Main Info */}
              <div className="text-center space-y-4">
                <div className="h-24 w-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm border border-blue-100">
                  <Award className="h-12 w-12" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">Professional Certificate</p>
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{cert.bootcampName}</h2>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-y border-gray-50 py-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Recipient Name
                  </p>
                  <p className="text-xl font-bold text-gray-800">{cert.studentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Issue Date
                  </p>
                  <p className="text-xl font-bold text-gray-800">{format(new Date(cert.issuedDate), "MMMM dd, yyyy")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" /> Certificate Code
                  </p>
                  <p className="text-sm font-mono font-bold text-blue-600">{cert.certificateCode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" /> Issuer
                  </p>
                  <p className="text-sm font-bold text-gray-800">Foundry Academy LMS</p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h4 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Validated Skills & Technologies</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {cert.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-1.5 bg-gray-50 text-gray-700 text-sm font-semibold rounded-full border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                This document verifies that the individual named above has successfully met all requirements 
                for completion of the specified professional program.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Adding missing Lucide import
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
