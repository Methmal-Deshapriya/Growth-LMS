"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetProjectDetailsQuery, useUpdateProjectMutation } from "@/features/projects/projectsApi";
import { Loader2, ArrowLeft, Save, Image as ImageIcon, Github, Globe, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Project Edit Page
 * 
 * Allows students to edit their projects while in PENDING status.
 */
export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading: isProjectLoading, isError } = useGetProjectDetailsQuery(projectId);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    projectUrl: "",
    githubUrl: "",
    demoUrl: "",
    technologies: "",
    isPublic: true,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || "",
        thumbnailUrl: project.thumbnailUrl || "",
        projectUrl: project.projectUrl || "",
        githubUrl: project.githubUrl || "",
        demoUrl: project.demoUrl || "",
        technologies: project.technologies.join(", "),
        isPublic: project.isPublic,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProject({
        id: projectId,
        data: {
          ...formData,
          technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
        }
      }).unwrap();
      
      toast.success("Project updated successfully!");
      router.push("/projects");
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  if (isProjectLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading project data...</p>
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

  if (project.status !== "PENDING") {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-12 text-center">
        <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Editing Restricted</h2>
        <p className="text-amber-700 mb-6">
          This project has already been {project.status.toLowerCase()} and can no longer be edited.
        </p>
        <Button asChild variant="outline">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
            Editing project for: <strong>{project.bootcamp?.title}</strong>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-gray-700">Project Title</Label>
            <Input
              id="title"
              className="h-12 rounded-xl"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description</Label>
            <textarea
              id="description"
              rows={4}
              className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub Repository
              </Label>
              <Input
                id="githubUrl"
                className="h-12 rounded-xl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Globe className="h-4 w-4" /> Live Demo URL
              </Label>
              <Input
                id="demoUrl"
                className="h-12 rounded-xl"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Thumbnail Image URL
            </Label>
            <Input
              id="thumbnailUrl"
              className="h-12 rounded-xl"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies" className="text-sm font-bold text-gray-700">Technologies (comma separated)</Label>
            <Input
              id="technologies"
              className="h-12 rounded-xl"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Make project public</p>
              <p className="text-xs text-gray-500">Public projects appear in our community showcase after approval.</p>
            </div>
            <input 
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-lg font-bold"
            >
              {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5 mr-2" /> Save Changes</>}
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-8 border-gray-200">
              <Link href="/projects">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
