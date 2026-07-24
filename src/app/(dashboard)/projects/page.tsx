"use client";

import React from "react";
import { useGetMyProjectsQuery } from "@/features/projects/projectsApi";
import { Loader2, FolderCode, Plus, Github, Globe, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

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
        return "bg-green-50 text-green-700 border-green-100";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
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
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-500 mt-1">
              Showcase your hard work and get feedback from our instructors.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12">
            <Link href="/projects/new">
              <Plus className="h-5 w-5 mr-2" />
              Submit Project
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading your portfolio...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h2>
            <p className="text-red-700">Failed to load projects. Please try again.</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                {/* Image Preview Placeholder / Thumbnail */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
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
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      {project.bootcamp?.title}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{project.title}</h3>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {project.description || "No description provided for this project."}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded border border-gray-100">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-bold text-gray-400">+{project.technologies.length - 4} more</span>
                    )}
                  </div>

                  {/* Admin Feedback Section */}
                  {project.adminFeedback && (
                    <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative">
                      <MessageSquare className="absolute -top-2.5 -left-2.5 h-6 w-6 text-gray-200 fill-white" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-1">Instructor Feedback</p>
                      <p className="text-sm text-gray-700 italic">&quot;{project.adminFeedback}&quot;</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
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
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderCode className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio is empty</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              You haven&apos;t submitted any projects yet. Show off your skills and build a portfolio that employers will love!
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg rounded-xl">
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
