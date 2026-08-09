"use client";

import { Plus, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AdminCourse } from "@/features/catalog/catalogApi";
import type { LearningServiceSlug } from "@/features/catalog/catalogTypes";
import { NavigableTableRow } from "@/features/catalog/components/NavigableTableRow";
import { useGetCourseBatchesQuery } from "../batchesApi";
import { BatchStatusBadge } from "./BatchStatusBadge";

export function CourseBatchRows({
  course,
  serviceSlug,
  canCreate,
  onCreate,
}: {
  course: AdminCourse;
  serviceSlug: LearningServiceSlug;
  canCreate: boolean;
  onCreate: () => void;
}) {
  const { data, isLoading, isError, refetch } = useGetCourseBatchesQuery(
    course.id,
  );
  const batchBase = `/admin/services/${serviceSlug}/categories/${course.categoryId}/courses/${course.id}/batches`;

  if (isLoading) {
    return (
      <TableRow className="bg-muted/20 hover:bg-muted/20">
        <TableCell colSpan={7} className="h-16 pl-14 text-muted-foreground">
          Loading batches...
        </TableCell>
      </TableRow>
    );
  }

  if (isError) {
    return (
      <TableRow className="bg-muted/20 hover:bg-muted/20">
        <TableCell colSpan={7} className="h-16 pl-14 text-destructive">
          <div className="flex items-center justify-between gap-4">
            <span>Could not load this course&apos;s batches.</span>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RotateCw className="size-4" /> Retry
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  const batches = data?.batches ?? [];

  return (
    <>
      {batches.map((batch) => (
        <NavigableTableRow
          key={batch.id}
          href={`${batchBase}/${batch.id}`}
          label={`Open ${batch.name} batch`}
          className="bg-muted/20 hover:bg-muted/35"
        >
          <TableCell colSpan={3} className="whitespace-normal py-3 pl-14">
            <p className="font-medium">{batch.name}</p>
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
      ))}
      {batches.length === 0 ? (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell colSpan={7} className="h-16 pl-14 text-muted-foreground">
            No batches have been created for this course yet.
          </TableCell>
        </TableRow>
      ) : null}
      {canCreate ? (
        <TableRow className="bg-muted/20 hover:bg-muted/30">
          <TableCell colSpan={7} className="p-0">
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full justify-center rounded-none px-4 font-medium text-primary hover:bg-primary/10 hover:text-primary"
              onClick={onCreate}
            >
              <Plus className="size-4" /> Create new batch
            </Button>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
