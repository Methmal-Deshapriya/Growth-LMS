"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Link2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api";
import {
  useAttachCourseSessionMutation,
  useGetCourseCurriculumQuery,
  useGetSessionLibraryQuery,
  useRemoveCourseSessionMutation,
  useReorderCourseCurriculumMutation,
} from "../../sessionsApi";

export default function CourseCurriculumManager({
  courseId,
  readOnly = false,
}: {
  courseId: string;
  readOnly?: boolean;
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const { data, isLoading, isError } = useGetCourseCurriculumQuery({ courseId });
  const { data: library } = useGetSessionLibraryQuery({ status: "READY" });
  const [attach, attachState] = useAttachCourseSessionMutation();
  const [reorder, reorderState] = useReorderCourseCurriculumMutation();
  const [remove] = useRemoveCourseSessionMutation();
  const attachedIds = useMemo(
    () => new Set(data?.curriculum.map(({ session }) => session.id) ?? []),
    [data?.curriculum],
  );
  const attachable = library?.sessions.filter(({ id }) => !attachedIds.has(id)) ?? [];

  const attachSelected = async () => {
    if (!selectedSessionId) return;
    if (
      data?.delivery.immediateAvailability &&
      data.delivery.affectedLearnerCount > 0 &&
      !window.confirm(
        `This Free Learning course has ${data.delivery.affectedLearnerCount} learner(s). The session becomes available immediately and changes their progress denominator. Continue?`,
      )
    ) return;
    try {
      await attach({ courseId, sessionId: selectedSessionId }).unwrap();
      setSelectedSessionId("");
      toast.success("Session attached to the course curriculum");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not attach session"));
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= data.curriculum.length) return;
    const ordered = [...data.curriculum];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    try {
      await reorder({
        courseId,
        courseSessions: ordered.map(({ id }, orderIndex) => ({ id, orderIndex })),
      }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not reorder curriculum"));
    }
  };

  const removeItem = async (courseSessionId: string, title: string) => {
    const message = data?.delivery.immediateAvailability
      ? `Retire "${title}"? It disappears from the current free classroom and progress denominator, while completion history remains.`
      : `Remove "${title}" from the master curriculum? Delivered batch history will be preserved.`;
    if (!window.confirm(message)) return;
    try {
      const result = await remove({ courseId, courseSessionId }).unwrap();
      toast.success(result.action === "RETIRED" ? "Curriculum session retired" : "Session detached");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update curriculum"));
    }
  };

  if (isLoading) return <p className="py-16 text-center text-muted-foreground">Loading curriculum…</p>;
  if (isError || !data) return <p className="rounded-xl bg-destructive/10 p-6 text-destructive">Could not load the curriculum.</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-semibold">{data.delivery.deliveryMode === "COHORT" ? "Cohort master curriculum" : "Live Free Learning curriculum"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.delivery.immediateAvailability
            ? `Active attachments are immediately visible to ${data.delivery.affectedLearnerCount} enrolled learner(s).`
            : "Attachments define the reusable master order; each paid batch controls its own releases."}
        </p>
      </div>

      {!readOnly ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-end">
          <label className="flex-1 space-y-2 text-sm font-medium">
            Attach a ready Session Library resource
            <select className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3" value={selectedSessionId} onChange={(event) => setSelectedSessionId(event.target.value)}>
              <option value="">Choose a session resource</option>
              {attachable.map((session) => <option key={session.id} value={session.id}>{session.title} · {session.reusePolicy === "REUSABLE" ? "Reusable" : "One course"}</option>)}
            </select>
          </label>
          <Button disabled={!selectedSessionId || attachState.isLoading} onClick={attachSelected}>
            {attachState.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}Attach
          </Button>
        </div>
      ) : <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Archived courses retain delivery history but cannot change curriculum.</p>}

      <div className="space-y-3">
        {data.curriculum.map((item, index) => (
          <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{index + 1}</div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold">{item.session.title}</h3>
              <p className="text-sm text-muted-foreground">{item.session.reusePolicy === "REUSABLE" ? "Reusable resource" : "Locked to one course"} · {item.usage.batchCount} batch use(s) · {item.usage.completionCount} completion(s)</p>
            </div>
            {!readOnly ? <div className="flex gap-1">
              <Button aria-label="Move up" variant="ghost" size="icon" disabled={index === 0 || reorderState.isLoading} onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button aria-label="Move down" variant="ghost" size="icon" disabled={index === data.curriculum.length - 1 || reorderState.isLoading} onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button aria-label="Remove" variant="ghost" size="icon" onClick={() => removeItem(item.id, item.session.title)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div> : null}
          </article>
        ))}
        {data.curriculum.length === 0 ? <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No sessions are attached to this course yet. Create resources in the Session Library, then attach them here.</p> : null}
      </div>
    </div>
  );
}
