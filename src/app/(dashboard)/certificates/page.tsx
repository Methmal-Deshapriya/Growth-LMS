"use client";

import React, { useState } from "react";
import { useGetMyCertificatesQuery } from "@/features/certificates/certificatesApi";
import { Loader2, Award, ExternalLink, Calendar, ShieldCheck, ShieldX, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [cursor, setCursor] = useState<string | undefined>();
  const [history, setHistory] = useState<Array<string | undefined>>([]);
  const { data, isLoading, isError, isFetching } = useGetMyCertificatesQuery({
    limit: 20,
    cursor,
  });
  const certificates = data?.certificates ?? [];

  return (
    <StudentOnlyRoute description="Admins no longer need the student certificate page. Use the admin certificate management screen for issued records.">
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground mt-1">
            View and verify your official course completion certificates.
          </p>
        </div>

        {isLoading ? (
          <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" aria-hidden="true" />
            <p className="text-muted-foreground font-medium">Loading your achievements...</p>
          </div>
        ) : isError ? (
          <div role="alert" className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h2>
            <p className="text-red-700">Failed to load certificates. Please try again.</p>
          </div>
        ) : certificates.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
              <div key={cert.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Award className="h-7 w-7" />
                    </div>
                    <div
                      className={
                        cert.status === "ISSUED"
                          ? "flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700"
                          : "flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700"
                      }
                    >
                      {cert.status === "ISSUED" ? (
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ShieldX className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {cert.status === "ISSUED" ? "Valid" : "Revoked"}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">{cert.courseName}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Issued on {format(new Date(cert.issuedDate), "MMMM dd, yyyy")}
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Skills Validated</p>
                    <div className="flex flex-wrap gap-2">
                      {cert.certificateData.skills.map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 bg-background text-foreground text-xs font-medium rounded-md border border-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-background p-4 border-t border-border flex items-center justify-between">
                  <p className="text-xs font-mono text-muted-foreground">{cert.certificateCode}</p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-blue-100/50">
                      <Link href={`/certificates/verify/${cert.certificateCode}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verify
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                disabled={history.length === 0 || isFetching}
                onClick={() => {
                  setCursor(history.at(-1));
                  setHistory((items) => items.slice(0, -1));
                }}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                disabled={!data?.pagination.hasMore || !data.pagination.nextCursor || isFetching}
                onClick={() => {
                  setHistory((items) => [...items, cursor]);
                  setCursor(data?.pagination.nextCursor ?? undefined);
                }}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
            <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No certificates yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Complete your enrolled courses and your certificates will appear here once issued by the administration.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-lg rounded-xl">
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
