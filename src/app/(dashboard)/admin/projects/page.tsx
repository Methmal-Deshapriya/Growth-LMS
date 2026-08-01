"use client";

import React, { useState } from "react";
import { useGetAllProjectsAdminQuery, useReviewProjectMutation } from "@/features/projects/projectsApi";
import { Loader2, FolderCode, Search, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { ProjectStatus } from "@/features/projects/projectsTypes";
import { getApiErrorMessage } from "@/lib/api";

/**
 * Admin Projects Page
 * 
 * Allows admins to review and approve/reject student project submissions.
 */
export default function AdminProjectsPage() {
  const { data: projects, isLoading, isError } = useGetAllProjectsAdminQuery();
  const [reviewProject, { isLoading: isReviewing }] = useReviewProjectMutation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleReview = async (id: string, status: ProjectStatus) => {
    let feedback = "";
    if (status === "REJECTED") {
      const input = window.prompt("Please provide feedback for the rejection:");
      if (input === null) return;
      feedback = input;
    } else if (status === "APPROVED") {
      const input = window.prompt("Optional feedback (leave blank if none):");
      if (input !== null) {
        feedback = input;
      }
    }

    try {
      await reviewProject({
        id,
        data: { status, adminFeedback: feedback || null },
      }).unwrap();
      toast.success(`Project ${status.toLowerCase()} successfully`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update project status"));
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "APPROVED": return "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/40";
      case "REJECTED": return "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40";
      default: return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40";
    }
  };

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.user?.firstName ?? ""} ${p.user?.lastName ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bootcamp?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Review</h1>
          <p className="text-muted-foreground mt-1">
            Review student submissions and provide feedback.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by title, student, or bootcamp..."
            className="pl-10 border-border h-12 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Loading projects...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">Error</h2>
          <p className="text-red-700 dark:text-red-400">Failed to load projects.</p>
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="overflow-hidden bg-card rounded-2xl border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Student / Bootcamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground line-clamp-1 max-w-[200px]" title={project.title}>
                        {project.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {project.isPublic ? (
                          <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">Public</span>
                        ) : (
                          <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">Private</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">
                        {project.user?.firstName} {project.user?.lastName}
                      </div>
                      <div className="text-sm text-foreground line-clamp-1 max-w-[200px]" title={project.bootcamp?.title}>
                        {project.bootcamp?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusColor(project.status)
                      )}>
                        {project.status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
                        {project.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                        {project.status === "PENDING" && <Clock className="h-3 w-3" />}
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(project.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" title="View Details">
                          <Link href={`/projects/${project.id}`}>
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Approve" 
                          onClick={() => handleReview(project.id, "APPROVED")}
                          disabled={isReviewing || project.status === "APPROVED"}
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Reject" 
                          onClick={() => handleReview(project.id, "REJECTED")}
                          disabled={isReviewing || project.status === "REJECTED"}
                        >
                          <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
          <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderCode className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No projects found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            There are no student projects to review at this time.
          </p>
        </div>
      )}
    </div>
  );
}
