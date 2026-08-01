"use client";

import React, { useState } from "react";
import { 
  useGetBootcampSessionsQuery, 
  useCreateSessionMutation, 
  useUpdateSessionMutation, 
  useDeleteSessionMutation,
} from "../../sessionsApi";
import { Session, CreateSessionRequest } from "../../sessionsTypes";
import { 
  Loader2, 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  PlayCircle,
  FileText,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api";

interface SessionManagerProps {
  bootcampId: string;
}

/**
 * SessionManager Component
 * 
 * Administrative interface for managing bootcamp curriculum.
 */
export default function SessionManager({ bootcampId }: SessionManagerProps) {
  const { data: sessions, isLoading, isError } = useGetBootcampSessionsQuery(bootcampId);
  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();
  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateSessionRequest>({
    title: "",
    description: "",
    orderIndex: 0,
    recordingUrl: "",
    materialUrl: "",
    quizUrl: "",
    feedbackUrl: "",
    durationMinutes: 0,
    isPublished: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      orderIndex: sessions?.length || 0,
      recordingUrl: "",
      materialUrl: "",
      quizUrl: "",
      feedbackUrl: "",
      durationMinutes: 0,
      isPublished: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (session: Session) => {
    setFormData({
      title: session.title,
      description: session.description || "",
      orderIndex: session.orderIndex,
      recordingUrl: session.recordingUrl || "",
      materialUrl: session.materialUrl || "",
      quizUrl: session.quizUrl || "",
      feedbackUrl: session.feedbackUrl || "",
      durationMinutes: session.durationMinutes || 0,
      isPublished: session.isPublished,
    });
    setEditingId(session.id);
    setIsAdding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSession({ id: editingId, data: formData }).unwrap();
        toast.success("Session updated");
      } else {
        await createSession({ bootcampId, data: formData }).unwrap();
        toast.success("Session created");
      }
      resetForm();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Action failed"));
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete session "${title}"?`)) return;
    try {
      await deleteSession(id).unwrap();
      toast.success("Session deleted");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to delete"));
    }
  };

  const handleTogglePublish = async (session: Session) => {
    try {
      await updateSession({ 
        id: session.id, 
        data: { isPublished: !session.isPublished } 
      }).unwrap();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update status"));
    }
  };

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto h-8 w-8 text-primary" /></div>;

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        Failed to load sessions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Curriculum Structure</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => { setIsAdding(true); setFormData({ ...formData, orderIndex: sessions?.length || 0 }); }} className="bg-primary text-white rounded-xl">
            <Plus className="h-4 w-4 mr-2" /> Add Session
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-background rounded-2xl border border-primary/20 p-6 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary">{editingId ? "Edit Session" : "New Session"}</h3>
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}><X className="h-4 w-4" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label>Duration (min)</Label>
                <Input type="number" value={formData.durationMinutes || ""} onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <textarea 
                className="w-full rounded-xl border border-border p-3 text-sm focus:ring-2 focus:ring-primary outline-hidden"
                value={formData.description || ""} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="flex items-center gap-2"><PlayCircle className="h-3 w-3" /> Recording URL</Label>
                <Input value={formData.recordingUrl || ""} onChange={e => setFormData({ ...formData, recordingUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label className="flex items-center gap-2"><FileText className="h-3 w-3" /> Materials URL</Label>
                <Input value={formData.materialUrl || ""} onChange={e => setFormData({ ...formData, materialUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label className="flex items-center gap-2"><HelpCircle className="h-3 w-3" /> Quiz URL</Label>
                <Input value={formData.quizUrl || ""} onChange={e => setFormData({ ...formData, quizUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label className="flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Feedback URL</Label>
                <Input value={formData.feedbackUrl || ""} onChange={e => setFormData({ ...formData, feedbackUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="isPublished" 
                checked={formData.isPublished} 
                onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} 
                className="rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="isPublished" className="cursor-pointer">Publish immediately</Label>
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" disabled={isCreating || isUpdating} className="bg-primary text-white rounded-xl flex-1">
                {(isCreating || isUpdating) ? <Loader2 className="animate-spin h-4 w-4" /> : <><Check className="h-4 w-4 mr-2" /> {editingId ? "Update Session" : "Create Session"}</>}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl px-8">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions?.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
            No sessions added yet.
          </div>
        ) : (
          sessions?.map((session) => (
            <div key={session.id} className="group bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all flex items-center gap-4">
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-muted-foreground">
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase bg-background px-1.5 py-0.5 rounded border border-border">
                    Session {session.orderIndex + 1}
                  </span>
                  {!session.isPublished && (
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-900/40">
                      Draft
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-foreground mt-1">{session.title}</h4>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(session)} title={session.isPublished ? "Unpublish" : "Publish"}>
                  {session.isPublished ? <EyeOff className="h-4 w-4 text-orange-500" /> : <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(session)}>
                  <Edit2 className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id, session.title)}>
                  <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
