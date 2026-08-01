"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMyEnrollmentsQuery } from "@/features/enrollments/enrollmentsApi";
import { useSubmitProjectMutation } from "@/features/projects/projectsApi";
import { Loader2, ArrowLeft, Send, Image as ImageIcon, Github, Globe, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Project Submission Page
 * 
 * Allows students to submit a project for one of their enrolled bootcamps.
 */
export default function NewProjectPage() {
  const router = useRouter();
  const { data: enrollments, isLoading: isEnrollmentsLoading } = useGetMyEnrollmentsQuery();
  const [submitProject, { isLoading: isSubmitting }] = useSubmitProjectMutation();

  const [formData, setFormData] = useState({
    enrollmentId: "",
    title: "",
    description: "",
    thumbnailUrl: "",
    projectUrl: "",
    githubUrl: "",
    demoUrl: "",
    technologies: "",
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.enrollmentId) {
      toast.error("Please select a bootcamp");
      return;
    }

    const enrollment = enrollments?.find(e => e.id === formData.enrollmentId);

    try {
      await submitProject({
        ...formData,
        bootcampId: enrollment?.bootcamp?.id || "",
        technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
      }).unwrap();
      
      toast.success("Project submitted successfully!");
      router.push("/projects");
    } catch {
      toast.error("Failed to submit project");
    }
  };

  if (isEnrollmentsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading your enrollments...</p>
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
        <h1 className="text-3xl font-bold text-foreground">Submit Project</h1>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bootcamp Selection */}
          <div className="space-y-2">
            <Label htmlFor="enrollmentId" className="text-sm font-bold text-foreground">Select Bootcamp</Label>
            <select
              id="enrollmentId"
              className="w-full h-12 rounded-xl border border-border px-4 bg-card text-sm focus:ring-2 focus:ring-primary outline-hidden"
              value={formData.enrollmentId}
              onChange={(e) => setFormData({ ...formData, enrollmentId: e.target.value })}
              required
            >
              <option value="">-- Choose a course --</option>
              {enrollments?.filter(e => e.status !== "CANCELLED").map((enrollment) => (
                <option key={enrollment.id} value={enrollment.id}>
                  {enrollment.bootcamp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-foreground">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g., E-Commerce Dashboard"
              className="h-12 rounded-xl"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-foreground">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Tell us about your project, the problems it solves, and what you learned."
              className="w-full rounded-xl border border-border p-4 text-sm focus:ring-2 focus:ring-primary outline-hidden"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-sm font-bold text-foreground flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub Repository
              </Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/..."
                className="h-12 rounded-xl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl" className="text-sm font-bold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" /> Live Demo URL
              </Label>
              <Input
                id="demoUrl"
                placeholder="https://..."
                className="h-12 rounded-xl"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Additional Media */}
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl" className="text-sm font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Thumbnail Image URL (Optional)
            </Label>
            <Input
              id="thumbnailUrl"
              placeholder="https://..."
              className="h-12 rounded-xl"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label htmlFor="technologies" className="text-sm font-bold text-foreground">Technologies (comma separated)</Label>
            <Input
              id="technologies"
              placeholder="React, Tailwind, Node.js, Prisma"
              className="h-12 rounded-xl"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
            <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center border border-border shadow-xs">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Make project public</p>
              <p className="text-xs text-muted-foreground">Public projects appear in our community showcase after approval.</p>
            </div>
            <input 
              type="checkbox"
              className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 rounded-xl text-lg font-bold"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5 mr-2" /> Submit for Review</>}
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-8 border-border">
              <Link href="/projects">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
