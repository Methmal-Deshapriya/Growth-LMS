"use client";

import React from "react";
import { BootcampAdmin } from "../../bootcampsTypes";
import { 
  useDeleteBootcampMutation, 
  usePublishBootcampMutation, 
  useUnpublishBootcampMutation 
} from "../../bootcampsApi";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Globe, 
  EyeOff, 
  Users,
  CheckCircle2,
  AlertCircle,
  ListVideo
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BootcampTableProps {
  bootcamps: BootcampAdmin[];
}

/**
 * BootcampTable Component
 * 
 * A administrative table for managing the lifecycle of bootcamps.
 */
export default function BootcampTable({ bootcamps }: BootcampTableProps) {
  const [deleteBootcamp, { isLoading: isDeleting }] = useDeleteBootcampMutation();
  const [publish] = usePublishBootcampMutation();
  const [unpublish] = useUnpublishBootcampMutation();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteBootcamp(id).unwrap();
      toast.success("Bootcamp deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete bootcamp");
    }
  };

  const handleTogglePublish = async (bootcamp: BootcampAdmin) => {
    try {
      if (bootcamp.isPublished) {
        await unpublish(bootcamp.id).unwrap();
        toast.success(`"${bootcamp.title}" is now a draft`);
      } else {
        await publish(bootcamp.id).unwrap();
        toast.success(`"${bootcamp.title}" is now live!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <div className="overflow-hidden bg-card rounded-2xl border border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Bootcamp</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Created</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bootcamps.map((bootcamp) => (
              <tr key={bootcamp.id} className="hover:bg-muted/50 transition-colors group">
                {/* 1. Name & Slug */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {bootcamp.title}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono mt-0.5">
                      /{bootcamp.slug}
                    </span>
                  </div>
                </td>

                {/* 2. Status Badge */}
                <td className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    bootcamp.isPublished 
                      ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/40" 
                      : "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-900/40"
                  )}>
                    {bootcamp.isPublished ? (
                      <><CheckCircle2 className="h-3 w-3" /> Live</>
                    ) : (
                      <><AlertCircle className="h-3 w-3" /> Draft</>
                    )}
                  </div>
                </td>

                {/* 3. Price */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    LKR {bootcamp.price.toLocaleString()}
                  </span>
                </td>

                {/* 4. Created At */}
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(bootcamp.createdAt), "MMM dd, yyyy")}
                  </span>
                </td>

                {/* 5. Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild title="Sessions">
                      <Link href={`/admin/bootcamps/${bootcamp.id}/sessions`}>
                        <ListVideo className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </Link>
                    </Button>

                    <Button variant="ghost" size="icon" asChild title="Students">
                      <Link href={`/admin/bootcamps/${bootcamp.id}/students`}>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleTogglePublish(bootcamp)}
                      title={bootcamp.isPublished ? "Unpublish" : "Publish"}
                    >
                      {bootcamp.isPublished ? (
                        <EyeOff className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </Button>

                    <Button variant="ghost" size="icon" asChild title="Edit">
                      <Link href={`/admin/bootcamps/${bootcamp.id}/edit`}>
                        <Edit className="h-4 w-4 text-primary" />
                      </Link>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(bootcamp.id, bootcamp.title)}
                      disabled={isDeleting}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
