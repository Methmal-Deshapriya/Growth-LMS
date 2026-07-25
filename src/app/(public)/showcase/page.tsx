"use client";

import React from "react";
import { useGetPublicShowcaseQuery } from "@/features/projects/projectsApi";
import { Loader2, FolderCode, Github, Globe, ExternalLink, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Public Showcase Page
 * 
 * Displays approved student projects to the public.
 */
export default function ShowcasePage() {
  const { data: projects, isLoading, isError } = useGetPublicShowcaseQuery();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">Community Showcase</p>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Built by our students.</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Explore the professional-grade projects developed by our graduates during their intensive training.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Curating the gallery...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-3xl border border-red-100 p-12 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">Failed to load the showcase. Please refresh the page.</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col">
                {/* Thumbnail */}
                <Link href={`/showcase/${project.id}`} className="aspect-video bg-gray-100 relative overflow-hidden block">
                  {project.thumbnailUrl ? (
                    <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <FolderCode className="h-20 w-20 opacity-30" />
                    </div>
                  )}
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm font-bold flex items-center gap-2">
                      View Project <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{project.bootcamp?.title}</p>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {project.description || "A professional project built as part of our intensive curriculum."}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded border border-gray-100">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                         <span className="text-[10px] font-bold text-gray-400">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {project.user?.firstName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {project.user?.firstName} {project.user?.lastName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                        <Heart className="h-3.5 w-3.5" />
                        {project.likeCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-32 text-center">
             <FolderCode className="h-20 w-20 text-gray-200 mx-auto mb-6" />
             <h2 className="text-2xl font-bold text-gray-900">Showcase coming soon</h2>
             <p className="text-gray-500 mt-2 max-w-md mx-auto">
               Our students are hard at work. Check back soon to see their professional projects and portfolios.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
