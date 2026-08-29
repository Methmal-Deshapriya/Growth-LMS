"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Link2, Loader2, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SequenceRiskConfirmationDialog } from "@/components/admin/SequenceRiskConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage, isNormalizedApiError } from "@/lib/api";
import {
  useAttachCourseSessionMutation,
  useGetCourseCurriculumQuery,
  useGetSessionLibraryQuery,
  useRemoveCourseSessionMutation,
  useReorderCourseCurriculumMutation,
  useUpdateCourseSessionDeliveryMutation,
} from "../../sessionsApi";
import type { CourseSessionDeliveryStatus } from "../../sessionsTypes";

type PendingRisk =
  | { kind: "REORDER"; courseSessions: { id: string; orderIndex: number }[]; message: string; details?: unknown }
  | { kind: "DELIVERY"; courseSessionId: string; status: CourseSessionDeliveryStatus; availableAt?: string | null; message: string; details?: unknown };

const statusClass: Record<CourseSessionDeliveryStatus, string> = {
  UNRELEASED: "border-muted-foreground/20 bg-muted text-muted-foreground",
  SCHEDULED: "border-violet-500/20 bg-violet-500/10 text-violet-700",
  RELEASED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  WITHDRAWN: "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

export default function CourseCurriculumManager({
  courseId,
  readOnly = false,
}: {
  courseId: string;
  serviceSlug?: string;
  categoryId?: string;
  readOnly?: boolean;
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [pendingRisk, setPendingRisk] = useState<PendingRisk | null>(null);
  const { data, isLoading, isError } = useGetCourseCurriculumQuery({ courseId, includeRetired: true });
  const { data: library, isFetching: libraryLoading } = useGetSessionLibraryQuery(
    { attachableCourseId: courseId },
    { skip: readOnly },
  );
  const [attach, attachState] = useAttachCourseSessionMutation();
  const [reorder, reorderState] = useReorderCourseCurriculumMutation();
  const [remove, removeState] = useRemoveCourseSessionMutation();
  const [updateDelivery, deliveryState] = useUpdateCourseSessionDeliveryMutation();

  const active = useMemo(() => data?.curriculum.filter((item) => !item.retiredAt) ?? [], [data]);
  const retired = useMemo(() => data?.curriculum.filter((item) => item.retiredAt) ?? [], [data]);
  const attachable = library?.sessions ?? [];

  const attachSelected = async () => {
    if (!selectedSessionId) return;
    try {
      await attach({ courseId, sessionId: selectedSessionId }).unwrap();
      setSelectedSessionId("");
      toast.success("Session attached as unreleased");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not attach session"));
    }
  };

  const submitReorder = async (
    courseSessions: { id: string; orderIndex: number }[],
    acknowledgeSequenceRisk = false,
  ) => {
    try {
      await reorder({ courseId, courseSessions, acknowledgeSequenceRisk }).unwrap();
      setPendingRisk(null);
      toast.success("Curriculum order updated");
    } catch (error) {
      if (isNormalizedApiError(error) && error.code === "SEQUENCE_RISK_CONFIRMATION_REQUIRED" && !acknowledgeSequenceRisk) {
        setPendingRisk({ kind: "REORDER", courseSessions, message: error.message, details: error.details });
      } else toast.error(getApiErrorMessage(error, "Could not reorder curriculum"));
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= active.length) return;
    const ordered = [...active];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    void submitReorder(ordered.map(({ id }, orderIndex) => ({ id, orderIndex })));
  };

  const changeDelivery = async (
    courseSessionId: string,
    status: CourseSessionDeliveryStatus,
    availableAt?: string | null,
    acknowledgeSequenceRisk = false,
  ) => {
    try {
      await updateDelivery({ courseId, courseSessionId, status, availableAt, acknowledgeSequenceRisk }).unwrap();
      setPendingRisk(null);
      toast.success(`Session changed to ${status.toLowerCase()}`);
    } catch (error) {
      if (isNormalizedApiError(error) && error.code === "SEQUENCE_RISK_CONFIRMATION_REQUIRED" && !acknowledgeSequenceRisk) {
        setPendingRisk({ kind: "DELIVERY", courseSessionId, status, availableAt, message: error.message, details: error.details });
      } else toast.error(getApiErrorMessage(error, "Could not change session delivery"));
    }
  };

  const schedule = (courseSessionId: string) => {
    const value = window.prompt("Enter a future date/time in ISO format, for example 2026-09-01T09:00:00+05:30");
    if (!value) return;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      toast.error("Enter a valid date and time");
      return;
    }
    void changeDelivery(courseSessionId, "SCHEDULED", date.toISOString());
  };

  const removeItem = async (courseSessionId: string) => {
    try {
      const result = await remove({ courseId, courseSessionId }).unwrap();
      toast.success(result.action === "RETIRED" ? "Released history retired and preserved" : "Unused session detached");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not remove session"));
    }
  };

  if (isLoading) return <p role="status" aria-live="polite" className="py-14 text-center text-muted-foreground">Loading curriculum…</p>;
  if (isError || !data) return <p role="alert" className="rounded-md bg-destructive/10 p-5 text-destructive">Could not load the curriculum.</p>;

  return (
    <div className="space-y-6">
      {!readOnly ? (
        <div className="flex flex-wrap items-end gap-3">
          <label className="w-80 max-w-full space-y-2 text-sm font-medium">
            Attach a ready Session Library resource
            <select className="mt-2 h-10 w-full rounded-md border bg-background px-3" value={selectedSessionId} onChange={(event) => setSelectedSessionId(event.target.value)} disabled={libraryLoading || attachable.length === 0}>
              <option value="">{libraryLoading ? "Loading sessions…" : attachable.length ? "Choose a session" : "No ready sessions available"}</option>
              {attachable.map((session) => <option key={session.id} value={session.id}>{session.title}</option>)}
            </select>
          </label>
          <Button disabled={!selectedSessionId || attachState.isLoading} onClick={attachSelected}>
            {attachState.isLoading ? <Loader2 className="animate-spin" /> : <Link2 />} Attach session
          </Button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableCaption className="sr-only">Current course curriculum and learner visibility</TableCaption>
          <TableHeader className="bg-muted/40"><TableRow><TableHead className="px-4">Order</TableHead><TableHead>Session</TableHead><TableHead>Visibility</TableHead><TableHead>Completions</TableHead><TableHead className="pr-4 text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {active.length === 0 ? <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No sessions are attached to this course.</TableCell></TableRow> : active.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 font-mono">{index + 1}</TableCell>
                <TableCell className="max-w-lg whitespace-normal py-4"><p className="font-semibold">{item.session.title}</p><p className="text-xs text-muted-foreground">{item.session.durationMinutes ? `${item.session.durationMinutes} minutes` : "Duration not set"}</p></TableCell>
                <TableCell><Badge variant="outline" className={statusClass[item.deliveryStatus]}>{item.deliveryStatus.replace("_", " ")}</Badge>{item.availableAt ? <p className="mt-1 text-xs text-muted-foreground">{new Date(item.availableAt).toLocaleString()}</p> : null}</TableCell>
                <TableCell className="font-mono">{item.usage.completionCount}</TableCell>
                <TableCell className="pr-4 text-right">
                  {readOnly ? <span className="text-xs text-muted-foreground">Read only</span> : <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${item.session.title}`}><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={index === 0} onSelect={() => move(index, -1)}><ArrowUp /> Move up</DropdownMenuItem>
                    <DropdownMenuItem disabled={index === active.length - 1} onSelect={() => move(index, 1)}><ArrowDown /> Move down</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => changeDelivery(item.id, "RELEASED")}>Release now</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => schedule(item.id)}>Schedule release</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => changeDelivery(item.id, "WITHDRAWN")}>Withdraw</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => removeItem(item.id)}><Trash2 /> Remove from curriculum</DropdownMenuItem>
                  </DropdownMenuContent></DropdownMenu>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {retired.length ? <section className="space-y-3"><div><h2 className="text-lg font-semibold">Retired sessions</h2><p className="text-sm text-muted-foreground">These are outside the current curriculum but preserved because they were previously exposed or completed.</p></div><div className="overflow-hidden rounded-md border bg-card"><Table><TableHeader className="bg-muted/40"><TableRow><TableHead className="px-4">Session</TableHead><TableHead>Last delivery state</TableHead><TableHead>Historical order</TableHead><TableHead>Completions</TableHead><TableHead className="pr-4 text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{retired.map((item) => <TableRow key={item.id}><TableCell className="px-4 py-4 font-semibold">{item.session.title}</TableCell><TableCell><Badge variant="outline" className={statusClass[item.deliveryStatus]}>{item.deliveryStatus.replace("_", " ")}</Badge></TableCell><TableCell className="font-mono">{item.historicalOrderIndex == null ? "—" : item.historicalOrderIndex + 1}</TableCell><TableCell className="font-mono">{item.usage.completionCount}</TableCell><TableCell className="pr-4 text-right">{readOnly ? <span className="text-xs text-muted-foreground">Read only</span> : <Button variant="ghost" size="sm" disabled={attachState.isLoading} onClick={() => attach({ courseId, sessionId: item.session.id }).unwrap().then(() => toast.success("Session reattached as withdrawn")).catch((error) => toast.error(getApiErrorMessage(error, "Could not reattach session")))}><RotateCcw /> Reattach</Button>}</TableCell></TableRow>)}</TableBody></Table></div></section> : null}

      <SequenceRiskConfirmationDialog
        open={Boolean(pendingRisk)}
        description={pendingRisk?.message ?? "Confirm this sequence exception."}
        details={pendingRisk?.details}
        isLoading={reorderState.isLoading || deliveryState.isLoading || removeState.isLoading}
        onOpenChange={(open) => { if (!open) setPendingRisk(null); }}
        onConfirm={() => {
          if (!pendingRisk) return;
          if (pendingRisk.kind === "REORDER") void submitReorder(pendingRisk.courseSessions, true);
          else void changeDelivery(pendingRisk.courseSessionId, pendingRisk.status, pendingRisk.availableAt, true);
        }}
      />
    </div>
  );
}
