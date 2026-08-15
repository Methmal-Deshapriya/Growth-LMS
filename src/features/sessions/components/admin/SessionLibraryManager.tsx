"use client";

import { useState } from "react";
import { Archive, Edit3, Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { getApiErrorMessage } from "@/lib/api";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import { useAppSelector } from "@/store/hooks";
import {
  useArchiveSessionMutation,
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionLibraryQuery,
  useUnarchiveSessionMutation,
  useUpdateSessionMutation,
} from "../../sessionsApi";
import type {
  CreateSessionRequest,
  LibrarySession,
} from "../../sessionsTypes";

const emptyForm: CreateSessionRequest = {
  title: "",
  description: "",
  recordingUrl: "",
  materialUrl: "",
  quizUrl: "",
  feedbackUrl: "",
  durationMinutes: null,
  reusePolicy: "SINGLE_COURSE",
  status: "DRAFT",
};

function clean(form: CreateSessionRequest): CreateSessionRequest {
  return {
    ...form,
    description: form.description || null,
    recordingUrl: form.recordingUrl || null,
    materialUrl: form.materialUrl || null,
    quizUrl: form.quizUrl || null,
    feedbackUrl: form.feedbackUrl || null,
    durationMinutes: form.durationMinutes || null,
  };
}

export default function SessionLibraryManager() {
  const user = useAppSelector(selectAuthUser);
  const canDelete = hasPermission(user, PERMISSIONS.SESSIONS_DELETE_PERMANENTLY);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<CreateSessionRequest>(emptyForm);
  const [editing, setEditing] = useState<LibrarySession | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError } = useGetSessionLibraryQuery(
    q.trim() ? { q: q.trim() } : undefined,
  );
  const [createSession, createState] = useCreateSessionMutation();
  const [updateSession, updateState] = useUpdateSessionMutation();
  const [archiveSession] = useArchiveSessionMutation();
  const [unarchiveSession] = useUnarchiveSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const edit = (session: LibrarySession) => {
    setEditing(session);
    setForm({
      title: session.title,
      description: session.description ?? "",
      recordingUrl: session.recordingUrl ?? "",
      materialUrl: session.materialUrl ?? "",
      quizUrl: session.quizUrl ?? "",
      feedbackUrl: session.feedbackUrl ?? "",
      durationMinutes: session.durationMinutes,
      reusePolicy: session.reusePolicy,
      status: session.status === "ARCHIVED" ? "DRAFT" : session.status,
    });
    setShowForm(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      editing?.usage.courseCount &&
      !window.confirm(
        `This resource is used by ${editing.usage.courseCount} course(s) and ${editing.usage.batchCount} batch(es). Saving changes updates every authorized learner view. Continue?`,
      )
    ) return;
    try {
      if (editing) {
        await updateSession({ id: editing.id, data: clean(form) }).unwrap();
        toast.success("Session resource updated everywhere it is used");
      } else {
        await createSession(clean(form)).unwrap();
        toast.success("Session resource created");
      }
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save the session"));
    }
  };

  const archive = async (session: LibrarySession) => {
    if (!window.confirm(`Archive "${session.title}"? Existing learner access is preserved.`)) return;
    try {
      await archiveSession(session.id).unwrap();
      toast.success("Session archived; existing delivery remains available");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not archive session"));
    }
  };

  const restore = async (session: LibrarySession) => {
    try {
      const restored = await unarchiveSession(session.id).unwrap();
      toast.success(
        restored.status === "READY"
          ? "Used session restored and kept ready"
          : "Unused session restored as a draft",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not restore session"));
    }
  };

  const remove = async (session: LibrarySession) => {
    const confirmation = `DELETE ${session.title}`;
    if (window.prompt(`This removes the resource from the database. Type "${confirmation}".`) !== confirmation) return;
    try {
      await deleteSession(session.id).unwrap();
      toast.success("Unused session permanently deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Permanent deletion failed"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input aria-label="Search Session Library" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search title or description" className="max-w-md" />
        <Button onClick={() => { reset(); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New session resource
        </Button>
      </div>

      {showForm ? (
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{editing ? "Edit library resource" : "Create library resource"}</h2>
              <p className="text-sm text-muted-foreground">Recording, material, quiz, and feedback URLs stay on this reusable resource.</p>
            </div>
            <Button type="button" variant="ghost" onClick={reset}>Cancel</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="session-title">Title</Label><Input id="session-title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="session-duration">Duration (minutes)</Label><Input id="session-duration" type="number" min={1} value={form.durationMinutes ?? ""} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value ? Number(event.target.value) : null })} /></div>
            <div className="space-y-2"><Label htmlFor="session-reuse-policy">Reuse policy</Label><select id="session-reuse-policy" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.reusePolicy} onChange={(event) => setForm({ ...form, reusePolicy: event.target.value as CreateSessionRequest["reusePolicy"] })}><option value="SINGLE_COURSE">One course</option><option value="REUSABLE">Reusable across courses</option></select></div>
            <div className="space-y-2"><Label htmlFor="session-status">Status</Label><select id="session-status" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "DRAFT" | "READY" })}><option value="DRAFT">Draft</option><option value="READY">Ready</option></select></div>
          </div>
          <div className="space-y-2"><Label htmlFor="session-description">Description</Label><textarea id="session-description" className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-sm" value={form.description ?? ""} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            {(["recordingUrl", "materialUrl", "quizUrl", "feedbackUrl"] as const).map((field) => (
              <div key={field} className="space-y-2"><Label htmlFor={`session-${field}`}>{field.replace("Url", " URL")}</Label><Input id={`session-${field}`} type="url" value={form[field] ?? ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder="https://" /></div>
            ))}
          </div>
          <Button disabled={createState.isLoading || updateState.isLoading} type="submit">
            {(createState.isLoading || updateState.isLoading) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save resource
          </Button>
        </form>
      ) : null}

      {isLoading ? <p role="status" aria-live="polite" className="py-12 text-center text-muted-foreground">Loading library…</p> : null}
      {isError ? <p role="alert" className="rounded-xl bg-destructive/10 p-5 text-destructive">Could not load the Session Library.</p> : null}
      <div className="grid gap-4" aria-busy={isLoading}>
        {data?.sessions.map((session) => (
          <article key={session.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{session.status}</span>
                  <span className="rounded-full bg-muted px-2 py-1">{session.reusePolicy === "REUSABLE" ? "Reusable" : "One course"}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{session.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Used by {session.usage.activeCourseCount} active course(s), {session.usage.batchCount} batch(es).</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {session.status !== "ARCHIVED" ? <><Button variant="outline" size="sm" onClick={() => edit(session)}><Edit3 className="mr-2 h-4 w-4" />Edit</Button><Button variant="outline" size="sm" onClick={() => archive(session)}><Archive className="mr-2 h-4 w-4" />Archive</Button></> : <Button variant="outline" size="sm" onClick={() => restore(session)}><RotateCcw className="mr-2 h-4 w-4" />Restore</Button>}
                {canDelete && session.status === "ARCHIVED" && session.usage.courseCount === 0 ? <Button variant="destructive" size="sm" onClick={() => remove(session)}><Trash2 className="mr-2 h-4 w-4" />Delete permanently</Button> : null}
              </div>
            </div>
          </article>
        ))}
        {!isLoading && data?.sessions.length === 0 ? <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No library sessions match this search.</p> : null}
      </div>
    </div>
  );
}
