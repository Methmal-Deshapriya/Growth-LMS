"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Clock, ExternalLink, Loader2, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllProjectsAdminQuery, useReviewProjectMutation } from "@/features/projects/projectsApi";
import type { ProjectStatus } from "@/features/projects/projectsTypes";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectStatus, string> = {
  APPROVED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "border-destructive/20 bg-destructive/10 text-destructive",
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function AdminProjectsPage() {
  const { data: projects = [], isLoading, isError, isFetching } = useGetAllProjectsAdminQuery();
  const [reviewProject, { isLoading: isReviewing }] = useReviewProjectMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(normalizedSearch) ||
    `${project.user?.firstName ?? ""} ${project.user?.lastName ?? ""}`.toLowerCase().includes(normalizedSearch) ||
    (project.course?.title ?? "").toLowerCase().includes(normalizedSearch),
  );

  const handleReview = async (id: string, status: ProjectStatus) => {
    let feedback = "";
    if (status === "REJECTED") {
      const input = window.prompt("Please provide feedback for the rejection:");
      if (input === null) return;
      feedback = input;
    } else {
      const input = window.prompt("Optional feedback (leave blank if none):");
      if (input !== null) feedback = input;
    }

    try {
      await reviewProject({ id, data: { status, adminFeedback: feedback || null } }).unwrap();
      toast.success(`Project ${status.toLowerCase()} successfully`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update project status"));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Project Review</h1>
        <p className="mt-1 text-muted-foreground">Review student submissions and provide feedback.</p>
      </div>

      <div className="rounded-md border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Search projects"
            placeholder="Search by title, student, or course…"
            className="h-11 pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card" aria-busy={isLoading || isFetching}>
        <Table>
          <TableCaption className="sr-only">Student projects awaiting or carrying an administrative review</TableCaption>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">Project</TableHead>
              <TableHead>Student / Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={cn(isFetching && !isLoading && "opacity-60")}>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading projects…
                  </span>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-destructive">
                  <span role="alert">Failed to load projects. Please try again.</span>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 whitespace-normal text-center text-muted-foreground">
                  {normalizedSearch ? "No projects match your search." : "There are no student projects to review yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="max-w-xs whitespace-normal px-4 py-4">
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{project.isPublic ? "Public" : "Private"}</p>
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal">
                    <p className="font-medium">{project.user?.firstName} {project.user?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{project.course?.title}</p>
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", statusStyles[project.status])}>
                      {project.status === "APPROVED" ? <CheckCircle2 className="size-3" aria-hidden="true" /> : null}
                      {project.status === "REJECTED" ? <XCircle className="size-3" aria-hidden="true" /> : null}
                      {project.status === "PENDING" ? <Clock className="size-3" aria-hidden="true" /> : null}
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(project.createdAt), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/projects/${project.id}`} aria-label={`View ${project.title}`}>
                          <ExternalLink className="size-4 text-primary" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Approve ${project.title}`}
                        onClick={() => handleReview(project.id, "APPROVED")}
                        disabled={isReviewing || project.status === "APPROVED"}
                      >
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Reject ${project.title}`}
                        onClick={() => handleReview(project.id, "REJECTED")}
                        disabled={isReviewing || project.status === "REJECTED"}
                      >
                        <XCircle className="size-4 text-destructive" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
