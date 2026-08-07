"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api";
import { useGetCourseCurriculumQuery } from "@/features/sessions/sessionsApi";
import {
  useGetBatchSessionsQuery,
  useRemoveBatchSessionMutation,
  useUpsertBatchSessionMutation,
} from "../batchesApi";

export default function BatchDeliveryManager({ batchId, courseId, batchStatus }: { batchId: string; courseId: string; batchStatus: string }) {
  const [selectedId, setSelectedId] = useState("");
  const { data, isLoading } = useGetBatchSessionsQuery(batchId);
  const { data: curriculum } = useGetCourseCurriculumQuery({ courseId });
  const [upsert, upsertState] = useUpsertBatchSessionMutation();
  const [remove] = useRemoveBatchSessionMutation();
  const assigned = new Set(data?.sessions.map(({ courseSessionId }) => courseSessionId) ?? []);
  const available = curriculum?.curriculum.filter(({ id }) => !assigned.has(id)) ?? [];

  const add = async () => {
    if (!selectedId) return;
    try { await upsert({ batchId, courseSessionId: selectedId, isReleased: false }).unwrap(); setSelectedId(""); toast.success("Lesson added hidden"); }
    catch (error) { toast.error(getApiErrorMessage(error, "Could not add lesson")); }
  };
  const setRelease = async (courseSessionId: string, release: boolean, availableAt?: string | null) => {
    try { await upsert({ batchId, courseSessionId, isReleased: release, availableAt }).unwrap(); toast.success(release ? (availableAt ? "Lesson scheduled" : "Lesson released") : "Lesson hidden"); }
    catch (error) { toast.error(getApiErrorMessage(error, "Could not update release")); }
  };
  const schedule = (courseSessionId: string) => {
    const local = window.prompt("Release date/time (for example 2026-08-08T18:00)");
    if (!local) return;
    const date = new Date(local);
    if (Number.isNaN(date.getTime())) return toast.error("Enter a valid date and time");
    void setRelease(courseSessionId, true, date.toISOString());
  };
  const removeItem = async (courseSessionId: string) => {
    if (!window.confirm("Remove this hidden lesson or withdraw it while preserving history?")) return;
    try { await remove({ batchId, courseSessionId }).unwrap(); toast.success("Batch delivery updated"); }
    catch (error) { toast.error(getApiErrorMessage(error, "Could not remove lesson")); }
  };

  return <section className="space-y-5"><div><h2 className="text-xl font-bold">Batch delivery</h2><p className="text-sm text-muted-foreground">Release and schedule lessons independently for this intake.</p></div><div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:flex-row"><label htmlFor="batch-course-session" className="sr-only">Curriculum lesson</label><select id="batch-course-session" className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Add a curriculum lesson</option>{available.map((item) => <option key={item.id} value={item.id}>{item.session.title}</option>)}</select><Button disabled={!selectedId || upsertState.isLoading} onClick={add}><Plus className="mr-2 h-4 w-4" />Add hidden</Button></div>{isLoading ? <p className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></p> : null}<div className="space-y-3">{data?.sessions.map((item) => <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 lg:flex-row lg:items-center"><div className="flex-1"><span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{item.state}</span><h3 className="mt-2 font-bold">{item.courseSession.session.title}</h3><p className="text-sm text-muted-foreground">{item.completionCount} completions{item.availableAt ? ` · ${new Date(item.availableAt).toLocaleString()}` : ""}</p></div><div className="flex flex-wrap gap-2">{batchStatus === "ACTIVE" ? <>{item.isReleased ? <Button size="sm" variant="outline" onClick={() => setRelease(item.courseSessionId, false)}><EyeOff className="mr-2 h-4 w-4" />Withdraw</Button> : <Button size="sm" onClick={() => setRelease(item.courseSessionId, true)}><Eye className="mr-2 h-4 w-4" />Release now</Button>}<Button size="sm" variant="outline" onClick={() => schedule(item.courseSessionId)}>Schedule</Button></> : null}<Button aria-label={`Remove ${item.courseSession.session.title} from batch`} size="sm" variant="ghost" onClick={() => removeItem(item.courseSessionId)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></article>)}{!isLoading && data?.sessions.length === 0 ? <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No lessons assigned to this batch.</p> : null}</div></section>;
}
