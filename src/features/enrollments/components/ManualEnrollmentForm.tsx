"use client";

import { useDeferredValue, useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import {
  useBulkCreateEnrollmentsMutation,
  useCreateEnrollmentMutation,
  useGetEligibleStudentsQuery,
} from "../enrollmentsApi";
import type { PaymentStatus } from "../enrollmentsTypes";

export default function ManualEnrollmentForm({ batchId }: { batchId: string }) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<Exclude<PaymentStatus, "NOT_REQUIRED">>("COMPLETED");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const { data: students = [], isFetching } = useGetEligibleStudentsQuery({
    batchId,
    q: deferredSearch || undefined,
    limit: 50,
  });
  const [createEnrollment, createState] = useCreateEnrollmentMutation();
  const [bulkCreate, bulkState] = useBulkCreateEnrollmentsMutation();

  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const submit = async () => {
    if (selectedIds.length === 0) return;
    const payment = {
      paymentStatus,
      externalPaymentReference: reference.trim() || null,
      paymentNote: note.trim() || null,
    };
    try {
      if (selectedIds.length === 1) {
        await createEnrollment({ batchId, data: { userId: selectedIds[0], ...payment } }).unwrap();
        toast.success("Student enrolled in this batch");
      } else {
        const result = await bulkCreate({
          batchId,
          students: selectedIds.map((userId) => ({ userId, ...payment })),
        }).unwrap();
        if (result.summary.failed) {
          toast.warning(`${result.summary.created} enrolled; ${result.summary.failed} failed. Review capacity or duplicates.`);
        } else {
          toast.success(`${result.summary.created} students enrolled`);
        }
      }
      setSelectedIds([]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Enrollment failed"));
    }
  };

  const submitting = createState.isLoading || bulkState.isLoading;
  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div><h2 className="flex items-center gap-2 text-xl font-bold"><UserPlus className="h-5 w-5 text-primary" />Add paid students</h2><p className="mt-1 text-sm text-muted-foreground">Search verified accounts, select one or many, then record the external payment result.</p></div>
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search eligible students" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="pl-10" /></div>
      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border p-2">
        {isFetching ? <p className="flex items-center gap-2 p-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Searching…</p> : null}
        {!isFetching && students.map((student) => (
          <label key={student.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-muted/60">
            <input type="checkbox" checked={selectedIds.includes(student.id)} onChange={() => toggle(student.id)} />
            <span><span className="block text-sm font-semibold">{student.firstName} {student.lastName}</span><span className="block text-xs text-muted-foreground">{student.email}</span></span>
          </label>
        ))}
        {!isFetching && students.length === 0 ? <p className="p-4 text-center text-sm text-muted-foreground">No eligible verified students found.</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="enrollment-payment-status">Payment status</Label><select id="enrollment-payment-status" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as Exclude<PaymentStatus, "NOT_REQUIRED">)}><option value="COMPLETED">Completed</option><option value="PARTIAL">Partial</option><option value="PENDING">Pending</option></select></div>
        <div className="space-y-2"><Label htmlFor="enrollment-payment-reference">External payment reference</Label><Input id="enrollment-payment-reference" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Receipt or transfer reference" /></div>
      </div>
      <div className="space-y-2"><Label htmlFor="enrollment-payment-note">Internal payment note</Label><textarea id="enrollment-payment-note" className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-sm" value={note} onChange={(event) => setNote(event.target.value)} /></div>
      <Button disabled={selectedIds.length === 0 || submitting} onClick={submit}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Enroll {selectedIds.length || "selected"} student{selectedIds.length === 1 ? "" : "s"}</Button>
    </section>
  );
}
