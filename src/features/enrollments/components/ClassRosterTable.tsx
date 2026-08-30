"use client";

import { useState } from "react";
import { Award, Check, Loader2, Mail, Pencil, User, Wallet, X } from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterPills, type FilterPillOption } from "@/components/ui/filter-pills";
import { Input } from "@/components/ui/input";
import { OffsetPagination } from "@/components/ui/offset-pagination";
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
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/lib/api";
import {
  CERTIFICATE_STATUS_STYLES,
  ENROLLMENT_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
} from "@/lib/statusColors";
import { useIssueCertificateMutation } from "@/features/certificates/certificatesApi";
import {
  useCompletePaymentMutation,
  useGetCourseRosterQuery,
  useUpdateEnrollmentMutation,
} from "../enrollmentsApi";
import type { ClassRosterEntry, EnrollmentStatus, RosterSummary } from "../enrollmentsTypes";

const statusStyles = ENROLLMENT_STATUS_STYLES;
const paymentStyles = PAYMENT_STATUS_STYLES;
const certificateStyles = CERTIFICATE_STATUS_STYLES;

const STATUS_PILLS: { key: EnrollmentStatus | ""; label: string; countKey: keyof RosterSummary }[] = [
  { key: "", label: "All", countKey: "all" },
  { key: "ACTIVE", label: "Active", countKey: "active" },
  { key: "COMPLETED", label: "Completed", countKey: "completed" },
  { key: "CANCELLED", label: "Cancelled", countKey: "cancelled" },
];
const PILL_ACTIVE_CLASS: Record<EnrollmentStatus | "", string> = {
  "": "border-primary bg-primary/10 text-primary",
  ACTIVE: statusStyles.ACTIVE,
  COMPLETED: statusStyles.COMPLETED,
  CANCELLED: statusStyles.CANCELLED,
};

const DEFAULT_PAGE_SIZE = 20;
const FILTER_DEBOUNCE_MS = 300;
const MIN_FILTER_LENGTH = 3;
const INTERACTIVE_SELECTOR = "input,button,a,[role=menuitem],[data-no-row-navigation]";

const selectClassName =
  "h-9 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const enrollmentStatusOptions: Record<EnrollmentStatus, EnrollmentStatus[]> = {
  ACTIVE: ["ACTIVE", "COMPLETED", "CANCELLED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED", "ACTIVE"],
};

export default function ClassRosterTable({
  intakeId,
  deliveryMode,
  certificateEnabled,
}: {
  intakeId: string;
  deliveryMode: "PAID" | "FREE";
  certificateEnabled: boolean;
}) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "">("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [offset, setOffset] = useState(0);

  const debouncedQ = useDebouncedValue(q.trim(), FILTER_DEBOUNCE_MS);
  const appliedQ = debouncedQ.length === 0 || debouncedQ.length >= MIN_FILTER_LENGTH ? debouncedQ : "";

  const { data, isLoading, isFetching } = useGetCourseRosterQuery({
    intakeId,
    q: appliedQ || undefined,
    status: statusFilter || undefined,
    limit: pageSize,
    offset,
  });
  const entries = data?.enrollments ?? [];

  const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation();
  const [issueCertificate, { isLoading: isIssuing }] = useIssueCertificateMutation();
  const [completePayment, { isLoading: isCompletingPayment }] = useCompletePaymentMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    status: EnrollmentStatus;
    externalPaymentReference: string;
    paymentNote: string;
  }>({
    status: "ACTIVE",
    externalPaymentReference: "",
    paymentNote: "",
  });
  const [certificateTarget, setCertificateTarget] = useState<ClassRosterEntry | null>(null);
  const [completePaymentTarget, setCompletePaymentTarget] = useState<ClassRosterEntry | null>(null);
  const [detailEntry, setDetailEntry] = useState<ClassRosterEntry | null>(null);

  const handleEdit = (entry: ClassRosterEntry) => {
    setEditingId(entry.id);
    setEditForm({
      status: entry.status,
      externalPaymentReference: entry.externalPaymentReference ?? "",
      paymentNote: entry.paymentNote ?? "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      const data =
        deliveryMode === "FREE"
          ? { status: editForm.status }
          : {
              ...editForm,
              externalPaymentReference: editForm.externalPaymentReference.trim() || null,
              paymentNote: editForm.paymentNote.trim() || null,
            };
      await updateEnrollment({
        id,
        data,
      }).unwrap();
      toast.success("Enrollment updated successfully");
      setEditingId(null);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update enrollment"));
    }
  };

  const confirmIssueCertificate = async () => {
    if (!certificateTarget) return;
    try {
      await issueCertificate({
        enrollmentId: certificateTarget.id,
        data: { description: "Successfully completed the course." },
      }).unwrap();
      toast.success("Certificate issued successfully!");
      setCertificateTarget(null);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to issue certificate"));
    }
  };

  const confirmCompletePayment = async () => {
    if (!completePaymentTarget) return;
    try {
      await completePayment(completePaymentTarget.id).unwrap();
      toast.success("Remaining payment recorded; enrollment is now fully paid");
      setCompletePaymentTarget(null);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to record the remaining payment"));
    }
  };

  const pillOptions: FilterPillOption<EnrollmentStatus | "">[] = STATUS_PILLS.map(({ key, label, countKey }) => ({
    key,
    label,
    count: data?.summary?.[countKey] ?? 0,
    activeClassName: PILL_ACTIVE_CLASS[key],
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label="Search students by name or email"
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setOffset(0);
          }}
          placeholder="Search name or email"
          className="h-9 w-56 shrink-0"
        />
        <FilterPills
          ariaLabel="Filter by enrollment status"
          options={pillOptions}
          active={statusFilter}
          onChange={(key) => {
            setStatusFilter(key);
            setOffset(0);
          }}
        />
      </div>

      <div className="overflow-hidden rounded-md border bg-card" aria-busy={isLoading || isFetching}>
        <Table>
          <TableCaption className="sr-only">
            {deliveryMode === "PAID"
              ? "Enrolled students in this course intake"
              : "Students enrolled in this Free Learning course"}
          </TableCaption>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">Student</TableHead>
              <TableHead>Enrollment status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  <span role="status" aria-live="polite">
                    Loading roster…
                  </span>
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 whitespace-normal text-center text-muted-foreground"
                >
                  {q || statusFilter ? "No enrollments match your filters." : "No learners enrolled in this course yet."}
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => {
                const isEditing = editingId === entry.id;

                return (
                  <TableRow
                    key={entry.id}
                    tabIndex={isEditing ? undefined : 0}
                    aria-label={isEditing ? undefined : `View details for ${entry.user?.firstName} ${entry.user?.lastName}`}
                    className={isEditing ? undefined : "cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"}
                    onClick={
                      isEditing
                        ? undefined
                        : (event) => {
                            if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
                            setDetailEntry(entry);
                          }
                    }
                    onKeyDown={
                      isEditing
                        ? undefined
                        : (event) => {
                            if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setDetailEntry(entry);
                            }
                          }
                    }
                  >
                    <TableCell className="max-w-xs whitespace-normal px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="size-4" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {entry.user?.firstName} {entry.user?.lastName}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3" aria-hidden="true" />
                            {entry.user?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell data-no-row-navigation={isEditing ? true : undefined}>
                      {isEditing ? (
                        <select
                          className={selectClassName}
                          aria-label={`Enrollment status for ${entry.user?.firstName} ${entry.user?.lastName}`}
                          value={editForm.status}
                          disabled={entry.status === "COMPLETED"}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              status: event.target.value as EnrollmentStatus,
                            })
                          }
                        >
                          {(deliveryMode === "FREE" && entry.status === "CANCELLED"
                            ? ["CANCELLED" as EnrollmentStatus]
                            : enrollmentStatusOptions[entry.status]
                          ).map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge variant="outline" className={statusStyles[entry.status]}>
                          {entry.status.charAt(0) + entry.status.slice(1).toLowerCase()}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {deliveryMode === "FREE" ? (
                        <Badge variant="outline" className={paymentStyles.NOT_REQUIRED}>
                          Not applicable
                        </Badge>
                      ) : (
                        // Payment status is never directly editable here — it only
                        // changes via the ledger-aware "record remaining payment"
                        // action below, so every change stays backed by a Payment row.
                        <Badge variant="outline" className={paymentStyles[entry.paymentStatus]}>
                          {entry.paymentStatus.charAt(0) +
                            entry.paymentStatus.slice(1).toLowerCase().replace("_", " ")}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell data-no-row-navigation={isEditing ? true : undefined}>
                      {deliveryMode === "FREE" ? (
                        <span className="text-xs text-muted-foreground">Not applicable</span>
                      ) : isEditing ? (
                        <div className="min-w-52 space-y-2">
                          <Input
                            aria-label="External payment reference"
                            value={editForm.externalPaymentReference}
                            disabled={entry.status === "COMPLETED"}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                externalPaymentReference: event.target.value,
                              })
                            }
                            placeholder="Reference"
                          />
                          <Input
                            aria-label="Internal payment note"
                            value={editForm.paymentNote}
                            disabled={entry.status === "COMPLETED"}
                            onChange={(event) =>
                              setEditForm({ ...editForm, paymentNote: event.target.value })
                            }
                            placeholder="Internal note"
                          />
                        </div>
                      ) : (
                        <div className="max-w-52 text-xs">
                          <p className="font-medium text-foreground">
                            {entry.externalPaymentReference || "No reference"}
                          </p>
                          <p
                            className="mt-0.5 truncate text-muted-foreground"
                            title={entry.paymentNote ?? undefined}
                          >
                            {entry.paymentNote || "No note"}
                          </p>
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      {entry.certificate ? (
                        <Badge
                          variant="outline"
                          className={certificateStyles[entry.certificate.status]}
                        >
                          {entry.certificate.certificateCode}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not issued</span>
                      )}
                    </TableCell>

                    <TableCell className="pr-4 text-right" data-no-row-navigation>
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              aria-label="Save enrollment changes"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSave(entry.id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                              ) : (
                                <Check className="size-4 text-emerald-600" aria-hidden="true" />
                              )}
                            </Button>
                            <Button
                              aria-label="Cancel enrollment changes"
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingId(null)}
                              disabled={isUpdating}
                            >
                              <X className="size-4 text-destructive" aria-hidden="true" />
                            </Button>
                          </>
                        ) : (
                          <>
                            {deliveryMode === "PAID" && entry.paymentStatus === "PARTIAL" ? (
                              <Button
                                aria-label={`Record remaining payment for ${entry.user?.firstName} ${entry.user?.lastName}`}
                                variant="ghost"
                                size="icon"
                                onClick={() => setCompletePaymentTarget(entry)}
                              >
                                <Wallet className="size-4 text-sky-600" aria-hidden="true" />
                              </Button>
                            ) : null}
                            {entry.status === "COMPLETED" &&
                            certificateEnabled &&
                            entry.paymentStatus === "COMPLETED" &&
                            !entry.certificate ? (
                              <Button
                                aria-label={`Issue certificate for ${entry.user?.firstName} ${entry.user?.lastName}`}
                                variant="ghost"
                                size="icon"
                                onClick={() => setCertificateTarget(entry)}
                                disabled={isIssuing}
                              >
                                <Award className="size-4 text-violet-600" aria-hidden="true" />
                              </Button>
                            ) : null}
                            <Button
                              aria-label={`Edit enrollment for ${entry.user?.firstName} ${entry.user?.lastName}`}
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(entry)}
                            >
                              <Pencil className="size-4" aria-hidden="true" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.pagination.total > 0 ? (
        <OffsetPagination
          id="roster-page-size"
          total={data.pagination.total}
          offset={offset}
          pageSize={pageSize}
          shownCount={entries.length}
          hasMore={data.pagination.hasMore}
          onOffsetChange={setOffset}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setOffset(0);
          }}
        />
      ) : null}

      <AlertDialog open={Boolean(certificateTarget)} onOpenChange={(open) => !open && setCertificateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Issue certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              Issue a certificate for {certificateTarget?.user?.firstName} {certificateTarget?.user?.lastName}? This cannot be undone from here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmIssueCertificate} disabled={isIssuing}>
              {isIssuing ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : null}
              Issue certificate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(completePaymentTarget)} onOpenChange={(open) => !open && setCompletePaymentTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record remaining payment?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirms {completePaymentTarget?.user?.firstName} {completePaymentTarget?.user?.lastName} has now paid the other half of this course&apos;s price. This marks payment as fully complete and enables certificate issuance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompletePayment} disabled={isCompletingPayment}>
              {isCompletingPayment ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : null}
              Record payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={Boolean(detailEntry)} onOpenChange={(open) => !open && setDetailEntry(null)}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          {detailEntry ? (
            <>
              <SheetHeader>
                <SheetTitle>
                  {detailEntry.user?.firstName} {detailEntry.user?.lastName}
                </SheetTitle>
                <SheetDescription>{detailEntry.user?.email}</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-y-auto px-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={statusStyles[detailEntry.status]}>
                    {detailEntry.status.charAt(0) + detailEntry.status.slice(1).toLowerCase()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={deliveryMode === "FREE" ? paymentStyles.NOT_REQUIRED : paymentStyles[detailEntry.paymentStatus]}
                  >
                    {deliveryMode === "FREE"
                      ? "Not applicable"
                      : detailEntry.paymentStatus.charAt(0) + detailEntry.paymentStatus.slice(1).toLowerCase().replace("_", " ")}
                  </Badge>
                  {detailEntry.certificate ? (
                    <Badge variant="outline" className={certificateStyles[detailEntry.certificate.status]}>
                      {detailEntry.certificate.certificateCode}
                    </Badge>
                  ) : null}
                </div>

                {deliveryMode === "PAID" ? (
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold">Payment evidence</p>
                    <p className="text-sm text-foreground">
                      {detailEntry.externalPaymentReference || "No external reference on file."}
                    </p>
                    {detailEntry.paymentNote ? (
                      <p className="text-sm text-muted-foreground">{detailEntry.paymentNote}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="space-y-1.5 text-sm">
                  <p className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Source</span>
                    <span className="font-medium">{detailEntry.source === "ADMIN" ? "Enrolled by admin" : "Self-enrolled"}</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Enrolled</span>
                    <span className="font-medium">{new Date(detailEntry.enrolledAt).toLocaleDateString()}</span>
                  </p>
                  {detailEntry.completedAt ? (
                    <p className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium">{new Date(detailEntry.completedAt).toLocaleDateString()}</span>
                    </p>
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
