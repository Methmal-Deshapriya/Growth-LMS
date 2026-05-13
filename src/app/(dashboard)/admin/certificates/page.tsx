"use client";

import React, { useState } from "react";
import { useGetAllCertificatesAdminQuery, useRevokeCertificateMutation } from "@/features/certificates/certificatesApi";
import { Loader2, Award, ShieldAlert, XCircle, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

/**
 * Admin Certificates Page
 * 
 * Allows admins to view all issued certificates and revoke them if necessary.
 */
export default function AdminCertificatesPage() {
  const { data: certificates, isLoading, isError } = useGetAllCertificatesAdminQuery();
  const [revokeCertificate, { isLoading: isRevoking }] = useRevokeCertificateMutation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleRevoke = async (id: string, code: string) => {
    const reason = window.prompt(`Please enter a reason for revoking certificate ${code}:`);
    if (!reason) return;

    try {
      await revokeCertificate({
        id,
        data: { revocationReason: reason },
      }).unwrap();
      toast.success("Certificate revoked successfully");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to revoke certificate");
    }
  };

  const filteredCertificates = certificates?.filter(c => 
    c.certificateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.bootcampName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificate Management</h1>
          <p className="text-gray-500 mt-1">
            View all issued certificates and manage their validity.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by code, student name, or bootcamp..."
            className="pl-10 border-gray-200 h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 font-medium">Loading certificates...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700">Failed to load certificates.</p>
        </div>
      ) : filteredCertificates && filteredCertificates.length > 0 ? (
        <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Certificate Code</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Bootcamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Issued Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{cert.certificateCode}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{cert.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cert.bootcampName}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        cert.status === "ISSUED" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                      )}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(cert.issuedDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" title="View Public Page">
                          <Link href={`/certificates/verify/${cert.certificateCode}`} target="_blank">
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </Link>
                        </Button>
                        {cert.status === "ISSUED" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Revoke" 
                            onClick={() => handleRevoke(cert.id, cert.certificateCode)}
                            disabled={isRevoking}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No certificates found</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            No certificates match your search or none have been issued yet.
          </p>
        </div>
      )}
    </div>
  );
}
