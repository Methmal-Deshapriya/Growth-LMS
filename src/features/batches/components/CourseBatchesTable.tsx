"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { NavigableTableRow } from "@/features/catalog/components/NavigableTableRow";
import type { LearningServiceSlug } from "@/features/catalog/catalogTypes";
import { useGetCourseBatchesQuery } from "../batchesApi";
import { BatchForm } from "./BatchForm";
import { BatchStatusBadge } from "./BatchStatusBadge";

export function CourseBatchesTable({
  courseId,
  courseTitle,
  serviceSlug,
  categoryId,
  readOnly,
}: {
  courseId: string;
  courseTitle: string;
  serviceSlug: LearningServiceSlug;
  categoryId: string;
  readOnly: boolean;
}) {
  const user = useAppSelector(selectAuthUser);
  const canCreate = hasPermission(user, PERMISSIONS.BATCHES_MANAGE) && !readOnly;
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, isError } = useGetCourseBatchesQuery(courseId);
  const batchBase = `/admin/services/${serviceSlug}/categories/${categoryId}/courses/${courseId}/batches`;
  const batches = data?.batches ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Batches</h2>
          <p className="text-sm text-muted-foreground">
            Paid intakes for this course. Each batch has its own roster and
            independent session releases.
          </p>
        </div>
        {canCreate ? (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New batch
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableCaption className="sr-only">
            Batches for {courseTitle}
          </TableCaption>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">Batch</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Learners</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  <span role="status" aria-live="polite">
                    Loading batches…
                  </span>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <p role="alert" className="text-sm text-destructive">
                    Could not load batches.
                  </p>
                </TableCell>
              </TableRow>
            ) : batches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 whitespace-normal text-center text-muted-foreground"
                >
                  No batches have been created for this course yet.
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => (
                <NavigableTableRow
                  key={batch.id}
                  href={`${batchBase}/${batch.id}`}
                  label={`Open ${batch.name} batch`}
                >
                  <TableCell className="whitespace-normal px-4 py-4">
                    <p className="font-semibold">{batch.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {batch.code} · {batch.startDate.slice(0, 10)} to{" "}
                      {batch.expectedEndDate.slice(0, 10)}
                    </p>
                  </TableCell>
                  <TableCell className="font-mono tabular-nums">
                    {batch.sessionCount}
                  </TableCell>
                  <TableCell>
                    <p className="font-mono font-medium tabular-nums">
                      {batch.enrollmentCount}
                      {batch.capacity ? ` / ${batch.capacity}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {batch.capacity ? "learners / capacity" : "learners"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <BatchStatusBadge status={batch.status} />
                  </TableCell>
                  <TableCell className="pr-4 text-right text-xs text-muted-foreground">
                    Open batch
                  </TableCell>
                </NavigableTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New batch</DialogTitle>
            <DialogDescription>
              Create a paid intake for {courseTitle}. It will start as a draft.
            </DialogDescription>
          </DialogHeader>
          <BatchForm
            courseId={courseId}
            onSuccess={() => setCreateOpen(false)}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
