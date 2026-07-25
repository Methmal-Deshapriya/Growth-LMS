"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetProjectDetailsQuery } from "@/features/projects/projectsApi";
import { Loader2, ArrowLeft, Github, Globe, Calendar, User, BookOpen, Layout, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * Project Details Page (Student/Admin View)
 */
export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading, isError } = useGetProjectDetailsQuery(projectId);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Project not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Project Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Project Cover/Thumbnail */}
            <div className="aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden">
              {project.thumbnailUrl ? (
                <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <Layout className="h-24 w-24 text-gray-200" />
              )}
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2",
                  getStatusStyles(project.status)
                )}>
                  {project.status}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">{project.title}</h2>
              </div>

              <div className="prose prose-blue max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Feedback */}
          {project.adminFeedback && (
            <div className="bg-blue-50/50 rounded-3xl border border-blue-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">Instructor Feedback</h3>
              </div>
              <p className="text-blue-800 leading-relaxed italic">
                "{project.adminFeedback}"
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Links</h4>
              <div className="space-y-3">
                {project.githubUrl && (
                  <Button asChild className="w-full justify-start h-12 bg-gray-900 hover:bg-black text-white rounded-xl">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-3 h-5 w-5" />
                      View Repository
                    </a>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl border-gray-200">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-3 h-5 w-5 text-blue-600" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <hr className="border-gray-50" />

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Metadata</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Bootcamp</p>
                    <p className="text-sm font-bold text-gray-700">{project.bootcamp?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Submitted On</p>
                    <p className="text-sm font-bold text-gray-700">{format(new Date(project.createdAt), "MMMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Student</p>
                    <p className="text-sm font-bold text-gray-700">
                      {project.user?.firstName} {project.user?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {project.status === "PENDING" && (
               <Button asChild variant="outline" className="w-full rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 mt-4">
                  <Link href={`/projects/edit/${project.id}`}>Edit Submission</Link>
               </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
