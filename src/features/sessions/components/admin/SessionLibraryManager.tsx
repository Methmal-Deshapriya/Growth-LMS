"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Link2,
  Loader2,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { selectAuthUser } from "@/features/auth/authSelectors";
import { useGetAdminCoursesQuery } from "@/features/catalog/catalogApi";
import { getApiErrorMessage, isNormalizedApiError } from "@/lib/api";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import { useAppSelector } from "@/store/hooks";
import {
  useArchiveSessionMutation,
  useAttachCourseSessionMutation,
  useBulkArchiveSessionsMutation,
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useDuplicateSessionMutation,
  useGetSessionLibraryQuery,
  useUnarchiveSessionMutation,
  useUpdateSessionMutation,
} from "../../sessionsApi";
import type {
  CreateSessionRequest,
  LibrarySession,
  SessionStatus,
} from "../../sessionsTypes";

const PAGE_SIZE = 20;
const FILTER_DEBOUNCE_MS = 300;
const REQUIRED_DELETE_TEXT = "DELETE";

const emptyForm: CreateSessionRequest = {
  title: "",
  description: "",
  recordingUrl: "",
  materialUrl: "",
  quizUrl: "",
  feedbackUrl: "",
  durationMinutes: null,
  status: "DRAFT",
  tags: [],
};

const statusStyles: Record<SessionStatus, string> = {
  DRAFT: "border-muted-foreground/20 bg-muted text-muted-foreground",
  READY:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  ARCHIVED:
    "border-amber-500/20 bg-amber-500/10 text-amber-700",
};

const eligibleAttachStatuses = new Set(["DRAFT", "OPEN_ACTIVE", "CLOSED_ACTIVE"]);

const INTERACTIVE_SELECTOR = "input,button,a,[role=menuitem],[data-no-row-navigation]";

function clean(form: CreateSessionRequest, tags: string[]): CreateSessionRequest {
  return {
    ...form,
    description: form.description || null,
    recordingUrl: form.recordingUrl || null,
    materialUrl: form.materialUrl || null,
    quizUrl: form.quizUrl || null,
    feedbackUrl: form.feedbackUrl || null,
    durationMinutes: form.durationMinutes || null,
    tags,
  };
}

function formatUpdatedAt(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 30) return `Updated ${days} days ago`;
  return `Updated ${new Date(iso).toLocaleDateString()}`;
}

function formatDuration(minutes: number | null | undefined) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

// A recording lives wherever an admin puts it (Drive today, maybe a
// streaming host later) and most of those sources can't give us a real,
// permission-aware thumbnail without a storage/proxy pipeline we don't want.
// This is a deliberate generic placeholder, not a preview of the actual
// content — it just signals "this session has a recording attached."
function RecordingPreview({ url }: { url: string | null | undefined }) {
  if (!url) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground">
        No recording added yet
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open recording"
      className="group flex h-40 items-center justify-center rounded-md bg-linear-to-br from-primary/15 via-primary/5 to-transparent transition hover:from-primary/25 hover:via-primary/10"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition group-hover:scale-105">
        <Play className="size-6 fill-current" aria-hidden="true" />
      </span>
    </a>
  );
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export default function SessionLibraryManager() {
  const user = useAppSelector(selectAuthUser);
  const canManage = hasPermission(user, PERMISSIONS.SESSIONS_MANAGE_LIBRARY);
  const canDelete = hasPermission(user, PERMISSIONS.SESSIONS_DELETE_PERMANENTLY);

  const [q, setQ] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "">("");
  const [offset, setOffset] = useState(0);

  const debouncedQ = useDebouncedValue(q.trim(), FILTER_DEBOUNCE_MS);
  const debouncedTag = useDebouncedValue(tagFilter.trim(), FILTER_DEBOUNCE_MS);

  const { data, isLoading, isError } = useGetSessionLibraryQuery({
    q: debouncedQ || undefined,
    status: statusFilter || undefined,
    tag: debouncedTag || undefined,
    limit: PAGE_SIZE,
    offset,
  });

  const hasActiveFilters = Boolean(debouncedQ || statusFilter || debouncedTag);

  const [form, setForm] = useState<CreateSessionRequest>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [editing, setEditing] = useState<LibrarySession | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [createSession, createState] = useCreateSessionMutation();
  const [updateSession, updateState] = useUpdateSessionMutation();
  const [archiveSession, archiveState] = useArchiveSessionMutation();
  const [unarchiveSession] = useUnarchiveSessionMutation();
  const [deleteSession, deleteState] = useDeleteSessionMutation();
  const [duplicateSession] = useDuplicateSessionMutation();
  const [bulkArchiveSessions, bulkArchiveState] = useBulkArchiveSessionsMutation();
  const [attachCourseSession, attachState] = useAttachCourseSessionMutation();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [detailSession, setDetailSession] = useState<LibrarySession | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<LibrarySession | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LibrarySession | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [bulkArchiveConfirmOpen, setBulkArchiveConfirmOpen] = useState(false);
  const [attachTarget, setAttachTarget] = useState<LibrarySession | null>(null);
  const [attachCourseId, setAttachCourseId] = useState("");
  const [attachCourseSearch, setAttachCourseSearch] = useState("");
  const [pendingSave, setPendingSave] = useState<CreateSessionRequest | null>(null);

  const { data: coursesData, isFetching: isCoursesFetching } = useGetAdminCoursesQuery(
    undefined,
    { skip: !attachTarget },
  );

  const reset = () => {
    setForm(emptyForm);
    setTagsInput("");
    setEditing(null);
    setFormOpen(false);
    setFieldErrors({});
    setPendingSave(null);
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
      status: session.status === "ARCHIVED" ? "DRAFT" : session.status,
      tags: session.tags ?? [],
    });
    setTagsInput((session.tags ?? []).join(", "));
    setFieldErrors({});
    setFormOpen(true);
  };

  const isEditingUsed = Boolean(editing?.usage.courseCount);

  const performSave = async (payload: CreateSessionRequest) => {
    try {
      if (editing) {
        await updateSession({ id: editing.id, data: payload }).unwrap();
        toast.success("Session resource updated everywhere it is used");
      } else {
        await createSession(payload).unwrap();
        toast.success("Session resource created");
      }
      reset();
    } catch (error) {
      if (isNormalizedApiError(error) && error.field) {
        setFieldErrors({ [error.field]: error.message });
      } else {
        toast.error(getApiErrorMessage(error, "Could not save the session"));
      }
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const payload = clean(form, tags);

    if (isEditingUsed) {
      setPendingSave(payload);
      return;
    }
    await performSave(payload);
  };

  const confirmPendingSave = async () => {
    if (!pendingSave) return;
    await performSave(pendingSave);
    setPendingSave(null);
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    try {
      await archiveSession(archiveTarget.id).unwrap();
      toast.success("Session archived; existing delivery remains available");
      setArchiveTarget(null);
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSession(deleteTarget.id).unwrap();
      toast.success("Unused session permanently deleted");
      setDeleteTarget(null);
      setDeleteConfirmation("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Permanent deletion failed"));
    }
  };

  const duplicate = async (session: LibrarySession) => {
    try {
      const created = await duplicateSession(session.id).unwrap();
      toast.success(`Duplicated as "${created.title}" — saved as a draft`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not duplicate the session"));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageIds = data?.sessions.map(({ id }) => id) ?? [];
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const toggleSelectAll = () => {
    setSelectedIds((current) => {
      if (pageIds.every((id) => current.has(id))) return new Set();
      return new Set(pageIds);
    });
  };

  const confirmBulkArchive = async () => {
    try {
      const result = await bulkArchiveSessions([...selectedIds]).unwrap();
      if (result.summary.failed) {
        toast.warning(
          `${result.summary.archived} archived; ${result.summary.failed} failed. Some may already be in use elsewhere.`,
        );
      } else {
        toast.success(`${result.summary.archived} session(s) archived`);
      }
      setSelectedIds(new Set());
      setBulkArchiveConfirmOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Bulk archive failed"));
    }
  };

  const eligibleAttachCourses = useMemo(() => {
    if (!attachTarget) return [];
    const usedCourseIds = new Set(attachTarget.usage.courses.map((c) => c.courseId));
    const search = attachCourseSearch.trim().toLowerCase();
    return (coursesData?.courses ?? []).filter(
      (course) =>
        !usedCourseIds.has(course.id) &&
        eligibleAttachStatuses.has(course.status) &&
        (!search ||
          `${course.title} ${course.code}`.toLowerCase().includes(search)),
    );
  }, [attachTarget, coursesData, attachCourseSearch]);

  const confirmAttach = async () => {
    if (!attachTarget || !attachCourseId) return;
    try {
      await attachCourseSession({
        courseId: attachCourseId,
        sessionId: attachTarget.id,
      }).unwrap();
      toast.success("Session attached to the course curriculum");
      setAttachTarget(null);
      setAttachCourseId("");
      setAttachCourseSearch("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not attach session"));
    }
  };

  const openDetail = (session: LibrarySession) => setDetailSession(session);
  const rowInteraction = (session: LibrarySession) => ({
    tabIndex: 0,
    "aria-label": `View details for ${session.title}`,
    className:
      "cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    onClick: (event: React.MouseEvent<HTMLTableRowElement>) => {
      if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
      openDetail(session);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetail(session);
      }
    },
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.pagination.total / PAGE_SIZE)) : 1;
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          <Input
            aria-label="Search Session Library"
            value={q}
            onChange={(event) => {
              setQ(event.target.value);
              setOffset(0);
            }}
            placeholder="Search title or description"
            className="max-w-xs"
          />
          <select
            aria-label="Filter by status"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as SessionStatus | "");
              setOffset(0);
            }}
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="READY">Ready</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Input
            aria-label="Filter by tag"
            value={tagFilter}
            onChange={(event) => {
              setTagFilter(event.target.value);
              setOffset(0);
            }}
            placeholder="Filter by tag"
            className="max-w-40"
          />
        </div>
        {canManage ? (
          <Button onClick={() => { reset(); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New session resource
          </Button>
        ) : null}
      </div>

      {canManage && selectedIds.size > 0 ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-4 py-2">
          <p className="text-sm font-medium">{selectedIds.size} selected</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBulkArchiveConfirmOpen(true)}
            >
              <Archive className="mr-2 h-4 w-4" /> Archive selected
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
              Clear selection
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableCaption className="sr-only">Session Library resources</TableCaption>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {canManage ? (
                <TableHead className="w-10 px-4" data-no-row-navigation>
                  <input
                    type="checkbox"
                    aria-label="Select all sessions on this page"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
              ) : null}
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading library…
                  </span>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <p role="alert" className="text-sm text-destructive">
                    Could not load the Session Library.
                  </p>
                </TableCell>
              </TableRow>
            ) : data?.sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 whitespace-normal text-center text-muted-foreground"
                >
                  {hasActiveFilters
                    ? "No library sessions match these filters."
                    : "No library sessions yet. Create your first session resource above."}
                </TableCell>
              </TableRow>
            ) : (
              data?.sessions.map((session) => {
                const duration = formatDuration(session.durationMinutes);
                const tags = session.tags ?? [];

                return (
                  <TableRow key={session.id} {...rowInteraction(session)}>
                    {canManage ? (
                      <TableCell className="px-4" data-no-row-navigation>
                        <input
                          type="checkbox"
                          aria-label={`Select ${session.title}`}
                          checked={selectedIds.has(session.id)}
                          onChange={() => toggleSelect(session.id)}
                        />
                      </TableCell>
                    ) : null}
                    <TableCell className="max-w-sm whitespace-normal py-4">
                      <p className="font-semibold">{session.title}</p>
                      {session.description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {session.description}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatUpdatedAt(session.updatedAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[session.status]}>
                        {session.status.charAt(0) + session.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {duration ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-40">
                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.usage.courseCount > 0
                        ? `${session.usage.courseCount} course(s)`
                        : "Unused"}
                    </TableCell>
                    <TableCell className="pr-4 text-right" data-no-row-navigation>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${session.title}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canManage && session.status !== "ARCHIVED" ? (
                            <DropdownMenuItem onSelect={() => edit(session)}>
                              <Pencil /> Edit
                            </DropdownMenuItem>
                          ) : null}
                          {canManage ? (
                            <DropdownMenuItem onSelect={() => duplicate(session)}>
                              <Copy /> Duplicate
                            </DropdownMenuItem>
                          ) : null}
                          {canManage ? <DropdownMenuSeparator /> : null}
                          {canManage && session.status !== "ARCHIVED" ? (
                            <DropdownMenuItem onSelect={() => setArchiveTarget(session)}>
                              <Archive /> Archive
                            </DropdownMenuItem>
                          ) : null}
                          {canManage && session.status === "ARCHIVED" ? (
                            <DropdownMenuItem onSelect={() => restore(session)}>
                              <ArchiveRestore /> Restore
                            </DropdownMenuItem>
                          ) : null}
                          {canDelete && session.status === "ARCHIVED" && session.usage.courseCount === 0 ? (
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => {
                                setDeleteConfirmation("");
                                setDeleteTarget(session);
                              }}
                            >
                              <Trash2 /> Delete permanently
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.pagination.total > 0 ? (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {Math.min(offset + 1, data.pagination.total)}–
            {Math.min(offset + data.sessions.length, data.pagination.total)} of{" "}
            {data.pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={offset === 0}
              onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={!data.pagination.hasMore}
              onClick={() => setOffset((value) => value + PAGE_SIZE)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <Sheet open={Boolean(detailSession)} onOpenChange={(open) => !open && setDetailSession(null)}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          {detailSession ? (
            <>
              <SheetHeader>
                <SheetTitle>{detailSession.title}</SheetTitle>
                <SheetDescription>
                  {detailSession.description || "No description provided."}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-y-auto px-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className={statusStyles[detailSession.status]}>
                    {detailSession.status.charAt(0) + detailSession.status.slice(1).toLowerCase()}
                  </Badge>
                  <span>{formatUpdatedAt(detailSession.updatedAt)}</span>
                  {formatDuration(detailSession.durationMinutes) ? (
                    <span>· {formatDuration(detailSession.durationMinutes)}</span>
                  ) : null}
                </div>

                {(detailSession.tags ?? []).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {(detailSession.tags ?? []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <RecordingPreview url={detailSession.recordingUrl} />

                <div className="grid grid-cols-3 gap-2">
                  {(["materialUrl", "quizUrl", "feedbackUrl"] as const).map((field) => {
                    const label =
                      field === "materialUrl" ? "Material" : field === "quizUrl" ? "Quiz" : "Feedback";
                    const url = detailSession[field];
                    return url ? (
                      <Button key={field} variant="outline" size="sm" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {label}
                        </a>
                      </Button>
                    ) : (
                      <Button key={field} variant="outline" size="sm" disabled>
                        {label}
                      </Button>
                    );
                  })}
                </div>

                {canManage && detailSession.status === "READY" ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setAttachTarget(detailSession);
                      setDetailSession(null);
                    }}
                  >
                    <Link2 className="mr-2 h-4 w-4" /> Attach to a course
                  </Button>
                ) : null}

                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    Used in ({detailSession.usage.courseCount})
                  </p>
                  {detailSession.usage.courses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Not attached to any course yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {detailSession.usage.courses.map((usage) => {
                        const meta = (
                          <>
                            <p className="font-medium">{usage.courseTitle}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {usage.serviceTitle} · {usage.categoryTitle} · {usage.courseGroupTitle} ·{" "}
                              {usage.courseCode}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {usage.deliveryStatus}
                              </Badge>
                              {usage.retiredAt ? (
                                <span className="text-xs text-muted-foreground">Retired</span>
                              ) : null}
                            </div>
                          </>
                        );
                        return usage.serviceSlug ? (
                          <a
                            key={usage.courseSessionId}
                            href={`/admin/services/${usage.serviceSlug}/categories/${usage.categoryId}/courses/${usage.courseId}/sessions`}
                            className="block rounded-md border p-3 text-sm transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {meta}
                          </a>
                        ) : (
                          <div key={usage.courseSessionId} className="rounded-md border p-3 text-sm">
                            {meta}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {canDelete && detailSession.status === "ARCHIVED" && detailSession.usage.courseCount === 0 ? (
                  <div className="pt-2 text-right">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-destructive"
                      onClick={() => {
                        setDeleteConfirmation("");
                        setDeleteTarget(detailSession);
                        setDetailSession(null);
                      }}
                    >
                      <Trash2 className="mr-1 h-3 w-3" /> Delete permanently
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={formOpen} onOpenChange={(open) => (open ? setFormOpen(true) : reset())}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit library resource" : "Create library resource"}</DialogTitle>
            <DialogDescription>
              Recording, material, quiz, and feedback URLs stay on this reusable resource.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session-title">Title</Label>
                <Input
                  id="session-title"
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                {fieldErrors.title ? (
                  <p className="text-xs font-medium text-destructive" role="alert">{fieldErrors.title}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-duration">Duration (minutes)</Label>
                <Input
                  id="session-duration"
                  type="number"
                  min={1}
                  value={form.durationMinutes ?? ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      durationMinutes: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                />
                {fieldErrors.durationMinutes ? (
                  <p className="text-xs font-medium text-destructive" role="alert">{fieldErrors.durationMinutes}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-status">Status</Label>
                <select
                  id="session-status"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as "DRAFT" | "READY" })
                  }
                >
                  <option value="DRAFT" disabled={isEditingUsed}>
                    Draft
                  </option>
                  <option value="READY">Ready</option>
                </select>
                {isEditingUsed ? (
                  <p className="text-xs text-muted-foreground">
                    Used by a course, so this resource can&apos;t return to Draft — archive it instead to stop new use.
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-tags">Tags (comma-separated)</Label>
                <Input
                  id="session-tags"
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="javascript, intro, week-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-description">Description</Label>
              <textarea
                id="session-description"
                className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-sm"
                value={form.description ?? ""}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(["recordingUrl", "materialUrl", "quizUrl", "feedbackUrl"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`session-${field}`}>{field.replace("Url", " URL")}</Label>
                  <Input
                    id={`session-${field}`}
                    type="url"
                    value={form[field] ?? ""}
                    onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                    placeholder="https://"
                  />
                  {fieldErrors[field] ? (
                    <p className="text-xs font-medium text-destructive" role="alert">{fieldErrors[field]}</p>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button disabled={createState.isLoading || updateState.isLoading} type="submit">
                {(createState.isLoading || updateState.isLoading) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save resource
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(archiveTarget)} onOpenChange={(open) => !open && setArchiveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive session?</AlertDialogTitle>
            <AlertDialogDescription>
              Archive &quot;{archiveTarget?.title}&quot;? Existing learner access is preserved; it just stops new use.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={archiveState.isLoading} onClick={confirmArchive}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(pendingSave)} onOpenChange={(open) => !open && setPendingSave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update a resource in active use?</AlertDialogTitle>
            <AlertDialogDescription>
              This resource is used by {editing?.usage.courseCount} course intake(s) across{" "}
              {editing?.usage.courseGroupCount} course group(s). Saving changes updates every
              authorized learner view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={updateState.isLoading}
              onClick={() => void confirmPendingSave()}
            >
              {updateState.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkArchiveConfirmOpen} onOpenChange={setBulkArchiveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedIds.size} session(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Existing learner access is preserved for any that are in use; each is archived independently, so a failure on one won&apos;t block the rest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={bulkArchiveState.isLoading} onClick={confirmBulkArchive}>
              Archive selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteConfirmation("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete session?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes &quot;{deleteTarget?.title}&quot; from the database. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="session-delete-confirmation">
              Type <span className="font-mono">{REQUIRED_DELETE_TEXT}</span> to confirm
            </Label>
            <Input
              id="session-delete-confirmation"
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              autoComplete="off"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteState.isLoading || deleteConfirmation !== REQUIRED_DELETE_TEXT}
              onClick={confirmDelete}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={Boolean(attachTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setAttachTarget(null);
            setAttachCourseId("");
            setAttachCourseSearch("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach to course</DialogTitle>
            <DialogDescription>
              Attach &quot;{attachTarget?.title}&quot; to a course that hasn&apos;t used it yet. To restore a
              retired attachment instead, use that course&apos;s curriculum page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              aria-label="Search courses"
              placeholder="Search by title or code"
              value={attachCourseSearch}
              onChange={(event) => setAttachCourseSearch(event.target.value)}
            />
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-2">
              {isCoursesFetching ? (
                <p className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading courses…
                </p>
              ) : eligibleAttachCourses.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No eligible courses found.
                </p>
              ) : (
                eligibleAttachCourses.map((course) => (
                  <label
                    key={course.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted/60"
                  >
                    <input
                      type="radio"
                      name="attach-course"
                      checked={attachCourseId === course.id}
                      onChange={() => setAttachCourseId(course.id)}
                    />
                    <span>
                      <span className="block text-sm font-semibold">{course.title}</span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {course.code} · {course.category.title}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
            <Button disabled={!attachCourseId || attachState.isLoading} onClick={confirmAttach}>
              {attachState.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
              Attach session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
