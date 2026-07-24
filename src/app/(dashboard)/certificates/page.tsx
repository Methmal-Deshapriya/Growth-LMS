"use client";

import React from "react";
import { useGetMyCertificatesQuery } from "@/features/certificates/certificatesApi";
import { Loader2, Award, Download, ExternalLink, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

/**
 * My Certificates Page
 * 
 * Displays all certificates earned by the student.
 */
export default function MyCertificatesPage() {
  const { data: certificates, isLoading, isError } = useGetMyCertificatesQuery();

  return (
    <StudentOnlyRoute description="Admins no longer need the student certificate page. Use the admin certificate management screen for issued records.">
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-500 mt-1">
            View and download your official course completion certificates.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading your achievements...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h2>
            <p className="text-red-700">Failed to load certificates. Please try again.</p>
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <Award className="h-7 w-7" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{cert.bootcampName}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Issued on {format(new Date(cert.issuedDate), "MMMM dd, yyyy")}
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skills Validated</p>
                    <div className="flex flex-wrap gap-2">
                      {cert.certificateData.skills.map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs font-mono text-gray-400">{cert.certificateCode}</p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50">
                      <Link href={`/certificates/verify/${cert.certificateCode}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verify
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-gray-900 hover:bg-black text-white rounded-lg">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No certificates yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Complete your enrolled bootcamps and your certificates will appear here once issued by the administration.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg rounded-xl">
              <Link href="/my-courses">
                Go to My Courses
              </Link>
            </Button>
          </div>
        )}
      </div>
    </StudentOnlyRoute>
  );
}
