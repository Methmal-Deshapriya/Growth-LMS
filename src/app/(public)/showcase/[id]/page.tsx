"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetProjectDetailsQuery } from "@/features/projects/projectsApi";
import { Loader2, ArrowLeft, Github, Globe, Calendar, User, BookOpen, Layout, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * Public Project Detail Page
 */
export default function PublicProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading, isError } = useGetProjectDetailsQuery(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !project || project.status !== "APPROVED" || !project.isPublic) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Layout className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          The project you are looking for is either private, still pending review, or does not exist.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12">
          <Link href="/showcase">Back to Showcase</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="rounded-full hover:bg-gray-50">
            <Link href="/showcase">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Showcase
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
               <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Verified Project</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* Hero Image */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden aspect-video relative group">
            {project.thumbnailUrl ? (
              <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 text-gray-200">
                <Layout className="h-32 w-32 opacity-10" />
                <p className="mt-4 font-bold text-gray-300">Project Preview</p>
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Title & Description */}
          <div className="space-y-6">
            <div className="space-y-2">
               <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">{project.bootcamp?.title}</p>
               <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{project.title}</h1>
            </div>

            <div className="prose prose-xl prose-blue max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {project.description || "A professional technical project developed during intensive training at Foundry Academy."}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Built with
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-6 py-3 bg-white text-gray-700 font-bold rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-blue-100">
                 {project.user?.name.charAt(0)}
               </div>
               <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Developer</p>
                 <h4 className="text-xl font-bold text-gray-900">{project.user?.name}</h4>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Links</p>
               <div className="grid grid-cols-1 gap-3">
                  {project.demoUrl && (
                    <Button asChild className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 group">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-3 h-5 w-5" />
                        Launch Live Demo
                        <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild variant="outline" className="h-14 rounded-2xl font-bold border-gray-200 hover:bg-gray-50">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-3 h-5 w-5" />
                        GitHub Repository
                      </a>
                    </Button>
                  )}
               </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Completed {format(new Date(project.createdAt), "MMM yyyy")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 font-bold bg-gray-50 px-3 py-1.5 rounded-xl">
                 <Heart className="h-4 w-4" />
                 <span className="text-sm">{project.likeCount}</span>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="bg-linear-to-br from-indigo-500 to-blue-600 rounded-[2rem] p-8 text-white space-y-4 shadow-xl shadow-blue-100">
             <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <ShieldCheck className="h-6 w-6" />
             </div>
             <div>
                <h4 className="text-lg font-bold">Verified Credential</h4>
                <p className="text-blue-50 text-sm leading-relaxed mt-2 opacity-90">
                  This project was vetted and approved by Foundry Academy instructors as a demonstration of professional technical competency.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
