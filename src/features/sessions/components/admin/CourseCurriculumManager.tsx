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
import { FilterPills, type FilterPillOption } from "@/components/ui/filter-pills";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { COURSE_SESSION_DELIVERY_STATUS_STYLES, SESSION_STATUS_STYLES } from "@/lib/statusColors";
import {
  useAttachCourseSessionMutation,
  useGetCourseCurriculumQuery,
  useGetSessionLibraryQuery,
  useRemoveCourseSessionMutation,
  useReorderCourseCurriculumMutation,
  useUpdateCourseSessionDeliveryMutation,
} from "../../sessionsApi";
import type { CourseSession, CourseSessionDeliveryStatus } from "../../sessionsTypes";

type PendingRisk =
  | { kind: "REORDER"; courseSessions: { id: string; orderIndex: number }[]; message: string; details?: unknown }
  | { kind: "DELIVERY"; courseSessionId: string; status: CourseSessionDeliveryStatus; availableAt?: string | null; message: string; details?: unknown };

const statusClass = COURSE_SESSION_DELIVERY_STATUS_STYLES;

const DELIVERY_PILLS: { key: CourseSessionDeliveryStatus | ""; label: string }[] = [
  { key: "", label: "All" },
  { key: "UNRELEASED", label: "Unreleased" },
  { key: "SCHEDULED", label: "Scheduled" },
  { key: "RELEASED", label: "Released" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];
const PILL_ACTIVE_CLASS: Record<CourseSessionDeliveryStatus | "", string> = {
  "": "border-primary bg-primary/10 text-primary",
  UNRELEASED: statusClass.UNRELEASED,
  SCHEDULED: statusClass.SCHEDULED,
  RELEASED: statusClass.RELEASED,
  WITHDRAWN: statusClass.WITHDRAWN,
};

const INTERACTIVE_SELECTOR = "input,button,a,[role=menuitem],[data-no-row-navigation]";

export default function CourseCurriculumManager({
  intakeId,
  readOnly = false,
}: {
  intakeId: string;
  serviceSlug?: string;
  categoryId?: string;
  readOnly?: boolean;
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [pendingRisk, setPendingRisk] = useState<PendingRisk | null>(null);
  const [q, setQ] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState<CourseSessionDeliveryStatus | "">("");
  const [detailItem, setDetailItem] = useState<CourseSession | null>(null);
  const { data, isLoading, isError } = useGetCourseCurriculumQuery({ intakeId, includeRetired: true });
  const { data: library, isFetching: libraryLoading } = useGetSessionLibraryQuery(
    { attachableIntakeId: intakeId },
    { skip: readOnly },
  );
  const [attach, attachState] = useAttachCourseSessionMutation();
  const [reorder, reorderState] = useReorderCourseCurriculumMutation();
  const [remove, removeState] = useRemoveCourseSessionMutation();
  const [updateDelivery, deliveryState] = useUpdateCourseSessionDeliveryMutation();

  const active = useMemo(() => data?.curriculum.filter((item) => !item.retiredAt) ?? [], [data]);
  const retired = useMemo(() => data?.curriculum.filter((item) => item.retiredAt) ?? [], [data]);
  const attachable = library?.sessions ?? [];

  // Every row keeps its real position (needed for move up/down and the
  // "Order" column) even while search/status filtering only changes which
  // rows are shown.
  const indexedActive = useMemo(() => active.map((item, index) => ({ item, index })), [active]);
  const searchFiltered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query ? indexedActive.filter(({ item }) => item.session.title.toLowerCase().includes(query)) : indexedActive;
  }, [indexedActive, q]);
  const visible = useMemo(
    () => (deliveryFilter ? searchFiltered.filter(({ item }) => item.deliveryStatus === deliveryFilter) : searchFiltered),
    [searchFiltered, deliveryFilter],
  );
  const pillCounts = useMemo(() => {
    const counts: Record<CourseSessionDeliveryStatus, number> = { UNRELEASED: 0, SCHEDULED: 0, RELEASED: 0, WITHDRAWN: 0 };
    for (const { item } of searchFiltered) counts[item.deliveryStatus] += 1;
    return counts;
  }, [searchFiltered]);

  const attachSelected = async () => {
    if (!selectedSessionId) return;
    try {
      await attach({ intakeId, sessionId: selectedSessionId }).unwrap();
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
      await reorder({ intakeId, courseSessions, acknowledgeSequenceRisk }).unwrap();
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
      await updateDelivery({ intakeId, courseSessionId, status, availableAt, acknowledgeSequenceRisk }).unwrap();
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
      const result = await remove({ intakeId, courseSessionId }).unwrap();
      toast.success(result.action === "RETIRED" ? "Released history retired and preserved" : "Unused session detached");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not remove session"));
    }
  };

  if (isLoading) return <p role="status" aria-live="polite" className="py-14 text-center text-muted-foreground">Loading curriculum…</p>;
  if (isError || !data) return <p role="alert" className="rounded-md bg-destructive/10 p-5 text-destructive">Could not load the curriculum.</p>;

  const pillOptions: FilterPillOption<CourseSessionDeliveryStatus | "">[] = DELIVERY_PILLS.map(({ key, label }) => ({
    key,
    label,
    count: key === "" ? searchFiltered.length : pillCounts[key],
    activeClassName: PILL_ACTIVE_CLASS[key],
  }));

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

      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label="Search curriculum by session title"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search session title"
          className="h-9 w-56 shrink-0"
        />
        <FilterPills
          ariaLabel="Filter by delivery status"
          options={pillOptions}
          active={deliveryFilter}
          onChange={setDeliveryFilter}
        />
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableCaption className="sr-only">Current course curriculum and learner visibility</TableCaption>
          <TableHeader className="bg-muted/40"><TableRow><TableHead className="px-4">Order</TableHead><TableHead>Session</TableHead><TableHead>Visibility</TableHead><TableHead>Completions</TableHead><TableHead className="pr-4 text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {active.length === 0 ? "No sessions are attached to this course." : "No sessions match your filters."}
                </TableCell>
              </TableRow>
            ) : visible.map(({ item, index }) => (
              <TableRow
                key={item.id}
                tabIndex={0}
                aria-label={`View details for ${item.session.title}`}
                className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                onClick={(event) => {
                  if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
                  setDetailItem(item);
                }}
                onKeyDown={(event) => {
                  if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setDetailItem(item);
                  }
                }}
              >
                <TableCell className="px-4 font-mono">{index + 1}</TableCell>
                <TableCell className="max-w-lg whitespace-normal py-4"><p className="font-semibold">{item.session.title}</p><p className="text-xs text-muted-foreground">{item.session.durationMinutes ? `${item.session.durationMinutes} minutes` : "Duration not set"}</p></TableCell>
                <TableCell><Badge variant="outline" className={statusClass[item.deliveryStatus]}>{item.deliveryStatus.replace("_", " ")}</Badge>{item.availableAt ? <p className="mt-1 text-xs text-muted-foreground">{new Date(item.availableAt).toLocaleString()}</p> : null}</TableCell>
                <TableCell className="font-mono">{item.usage.completionCount}</TableCell>
                <TableCell className="pr-4 text-right" data-no-row-navigation>
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

      {retired.length ? <section className="space-y-3"><div><h2 className="text-lg font-semibold">Retired sessions</h2><p className="text-sm text-muted-foreground">These are outside the current curriculum but preserved because they were previously exposed or completed.</p></div><div className="overflow-hidden rounded-md border bg-card"><Table><TableHeader className="bg-muted/40"><TableRow><TableHead className="px-4">Session</TableHead><TableHead>Last delivery state</TableHead><TableHead>Historical order</TableHead><TableHead>Completions</TableHead><TableHead className="pr-4 text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{retired.map((item) => (
        <TableRow
          key={item.id}
          tabIndex={0}
          aria-label={`View details for ${item.session.title}`}
          className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
            setDetailItem(item);
          }}
          onKeyDown={(event) => {
            if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setDetailItem(item);
            }
          }}
        >
          <TableCell className="px-4 py-4 font-semibold">{item.session.title}</TableCell>
          <TableCell><Badge variant="outline" className={statusClass[item.deliveryStatus]}>{item.deliveryStatus.replace("_", " ")}</Badge></TableCell>
          <TableCell className="font-mono">{item.historicalOrderIndex == null ? "—" : item.historicalOrderIndex + 1}</TableCell>
          <TableCell className="font-mono">{item.usage.completionCount}</TableCell>
          <TableCell className="pr-4 text-right" data-no-row-navigation>{readOnly ? <span className="text-xs text-muted-foreground">Read only</span> : <Button variant="ghost" size="sm" disabled={attachState.isLoading} onClick={() => attach({ intakeId, sessionId: item.session.id }).unwrap().then(() => toast.success("Session reattached as withdrawn")).catch((error) => toast.error(getApiErrorMessage(error, "Could not reattach session")))}><RotateCcw /> Reattach</Button>}</TableCell>
        </TableRow>
      ))}</TableBody></Table></div></section> : null}

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

      <Sheet open={Boolean(detailItem)} onOpenChange={(open) => !open && setDetailItem(null)}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          {detailItem ? (
            <>
              <SheetHeader>
                <SheetTitle>{detailItem.session.title}</SheetTitle>
                <SheetDescription>
                  {detailItem.session.description || "No description provided."}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-y-auto px-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={statusClass[detailItem.deliveryStatus]}>
                    {detailItem.deliveryStatus.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className={SESSION_STATUS_STYLES[detailItem.session.status]}>
                    Library: {detailItem.session.status.charAt(0) + detailItem.session.status.slice(1).toLowerCase()}
                  </Badge>
                  {(detailItem.session.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-1.5 text-sm">
                  <p className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {detailItem.session.durationMinutes ? `${detailItem.session.durationMinutes} minutes` : "Not set"}
                    </span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Completions</span>
                    <span className="font-medium">{detailItem.usage.completionCount}</span>
                  </p>
                  {detailItem.availableAt ? (
                    <p className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Available from</span>
                      <span className="font-medium">{new Date(detailItem.availableAt).toLocaleString()}</span>
                    </p>
                  ) : null}
                  {detailItem.firstReleasedAt ? (
                    <p className="flex justify-between gap-4">
                      <span className="text-muted-foreground">First released</span>
                      <span className="font-medium">{new Date(detailItem.firstReleasedAt).toLocaleString()}</span>
                    </p>
                  ) : null}
                  {detailItem.retiredAt ? (
                    <p className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Retired</span>
                      <span className="font-medium">{new Date(detailItem.retiredAt).toLocaleString()}</span>
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {detailItem.session.recordingUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={detailItem.session.recordingUrl} target="_blank" rel="noopener noreferrer">Recording</a>
                    </Button>
                  ) : null}
                  {detailItem.session.materialUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={detailItem.session.materialUrl} target="_blank" rel="noopener noreferrer">Material</a>
                    </Button>
                  ) : null}
                  {detailItem.session.quizUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={detailItem.session.quizUrl} target="_blank" rel="noopener noreferrer">Quiz</a>
                    </Button>
                  ) : null}
                  {detailItem.session.feedbackUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={detailItem.session.feedbackUrl} target="_blank" rel="noopener noreferrer">Feedback</a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
