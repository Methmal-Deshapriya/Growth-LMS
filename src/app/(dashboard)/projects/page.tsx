"use client";

import React from "react";
import { useGetMyProjectsQuery } from "@/features/projects/projectsApi";
import { Loader2, FolderCode, Plus, Github, Globe, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";
import Image from "next/image";
import { projectImageLoader } from "@/lib/projectImage";

/**
 * My Projects Page
 * 
 * Displays student project submissions and their status.
 */
export default function MyProjectsPage() {
  const { data: projects, isLoading, isError } = useGetMyProjectsQuery();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/40";
      case "REJECTED":
        return "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40";
      default:
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <StudentOnlyRoute description="Admins no longer need the student project portfolio page. Project review remains available in the admin review section.">
      <div className="space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground mt-1">
              Showcase your hard work and get feedback from our instructors.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12">
            <Link href="/projects/new">
              <Plus className="h-5 w-5 mr-2" />
              Submit Project
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Loading your portfolio...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">Something went wrong</h2>
            <p className="text-red-700 dark:text-red-400">Failed to load projects. Please try again.</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col group">
                {/* Image Preview Placeholder / Thumbnail */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {project.thumbnailUrl ? (
                    <Image
                      loader={projectImageLoader}
                      unoptimized
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <FolderCode className="h-20 w-20 opacity-20" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className={cn(
                    "absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm text-xs font-bold uppercase tracking-wider",
                    getStatusStyles(project.status)
                  )}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </div>
                </div>

                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                      {project.course?.title}
                    </p>
                    <h3 className="text-xl font-bold text-foreground line-clamp-1">{project.title}</h3>
                  </div>

                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                    {project.description || "No description provided for this project."}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span key={index} className="px-2 py-0.5 bg-background text-muted-foreground text-[10px] font-bold uppercase rounded border border-border">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-bold text-muted-foreground">+{project.technologies.length - 4} more</span>
                    )}
                  </div>

                  {/* Admin Feedback Section */}
                  {project.adminFeedback && (
                    <div className="mt-4 p-4 rounded-xl bg-background border border-border relative">
                      <MessageSquare className="absolute -top-2.5 -left-2.5 h-6 w-6 text-muted-foreground fill-white" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">Instructor Feedback</p>
                      <p className="text-sm text-foreground italic">&quot;{project.adminFeedback}&quot;</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/50">
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {project.status === "PENDING" && (
                      <Button asChild size="sm" variant="outline" className="rounded-lg">
                        <Link href={`/projects/edit/${project.id}`}>Edit</Link>
                      </Button>
                    )}
                    <Button asChild size="sm" className="bg-gray-900 hover:bg-black text-white rounded-lg">
                      <Link href={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center">
            <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderCode className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Portfolio is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              You haven&apos;t submitted any projects yet. Show off your skills and build a portfolio that employers will love!
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-lg rounded-xl">
              <Link href="/projects/new">
                Submit Your First Project
              </Link>
            </Button>
          </div>
        )}
      </div>
    </StudentOnlyRoute>
  );
}
