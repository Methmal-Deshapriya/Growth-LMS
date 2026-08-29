"use client";

import { useState } from "react";
import { Award, Check, Loader2, Mail, Pencil, User, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage } from "@/lib/api";
import { useIssueCertificateMutation } from "@/features/certificates/certificatesApi";
import { useUpdateEnrollmentMutation } from "../enrollmentsApi";
import type {
  CertificateStatus,
  ClassRosterEntry,
  EnrollmentStatus,
  PaymentStatus,
} from "../enrollmentsTypes";

const statusStyles: Record<EnrollmentStatus, string> = {
  ACTIVE: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  COMPLETED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  CANCELLED:
    "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-300",
};

const paymentStyles: Record<PaymentStatus, string> = {
  NOT_REQUIRED: "border-muted-foreground/20 bg-muted text-muted-foreground",
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  PARTIAL: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  COMPLETED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const certificateStyles: Record<CertificateStatus, string> = {
  ISSUED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REVOKED:
    "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-300",
};

const selectClassName =
  "h-9 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const enrollmentStatusOptions: Record<EnrollmentStatus, EnrollmentStatus[]> = {
  ACTIVE: ["ACTIVE", "COMPLETED", "CANCELLED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED", "ACTIVE"],
};

export default function ClassRosterTable({
  entries,
  isLoading,
  deliveryMode,
  certificateEnabled,
}: {
  entries: ClassRosterEntry[];
  isLoading?: boolean;
  deliveryMode: "PAID" | "FREE";
  certificateEnabled: boolean;
}) {
  const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation();
  const [issueCertificate, { isLoading: isIssuing }] = useIssueCertificateMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    status: EnrollmentStatus;
    paymentStatus: Exclude<PaymentStatus, "NOT_REQUIRED">;
    externalPaymentReference: string;
    paymentNote: string;
  }>({
    status: "ACTIVE",
    paymentStatus: "PENDING",
    externalPaymentReference: "",
    paymentNote: "",
  });

  const handleEdit = (entry: ClassRosterEntry) => {
    setEditingId(entry.id);
    setEditForm({
      status: entry.status,
      paymentStatus: entry.paymentStatus === "NOT_REQUIRED" ? "PENDING" : entry.paymentStatus,
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

  const handleIssueCertificate = async (enrollmentId: string) => {
    if (!window.confirm("Are you sure you want to issue a certificate for this student?")) return;
    try {
      await issueCertificate({
        enrollmentId,
        data: { description: "Successfully completed the course." },
      }).unwrap();
      toast.success("Certificate issued successfully!");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to issue certificate"));
    }
  };

  return (
    <div className="overflow-hidden rounded-md border bg-card">
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
                No learners enrolled in this course yet.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => {
              const isEditing = editingId === entry.id;

              return (
                <TableRow key={entry.id}>
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

                  <TableCell>
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
                    ) : isEditing ? (
                      <select
                        className={selectClassName}
                        aria-label={`Payment status for ${entry.user?.firstName} ${entry.user?.lastName}`}
                        value={editForm.paymentStatus}
                        disabled={entry.status === "COMPLETED"}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            paymentStatus: event.target.value as Exclude<
                              PaymentStatus,
                              "NOT_REQUIRED"
                            >,
                          })
                        }
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    ) : (
                      <Badge variant="outline" className={paymentStyles[entry.paymentStatus]}>
                        {entry.paymentStatus.charAt(0) +
                          entry.paymentStatus.slice(1).toLowerCase().replace("_", " ")}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
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

                  <TableCell className="pr-4 text-right">
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
                              <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
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
                          {entry.status === "COMPLETED" &&
                          certificateEnabled &&
                          !entry.certificate ? (
                            <Button
                              aria-label={`Issue certificate for ${entry.user?.firstName} ${entry.user?.lastName}`}
                              variant="ghost"
                              size="icon"
                              onClick={() => handleIssueCertificate(entry.id)}
                              disabled={isIssuing}
                            >
                              <Award className="size-4 text-violet-600 dark:text-violet-400" aria-hidden="true" />
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
  );
}
