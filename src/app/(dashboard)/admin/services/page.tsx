"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { useGetAdminLearningServiceSummariesQuery } from "@/features/catalog/catalogApi";
import { AdminCatalogBreadcrumbs } from "@/features/catalog/components/AdminCatalogBreadcrumbs";
import { AdminCatalogPageHeader } from "@/features/catalog/components/AdminCatalogPageHeader";
import { AdminSummaryStrip } from "@/features/catalog/components/AdminSummaryStrip";
import { NavigableTableRow } from "@/features/catalog/components/NavigableTableRow";

export default function AdminServicesPage() {
  const { data, isLoading, isError, refetch } =
    useGetAdminLearningServiceSummariesQuery();
  const services = data?.services ?? [];

  const totals = services.reduce(
    (summary, service) => ({
      categories: summary.categories + service.categories.total,
      courses: summary.courses + service.courses.total,
      learners: summary.learners + service.learners.activeUnique,
      attention: summary.attention + service.attentionCount,
    }),
    { categories: 0, courses: 0, learners: 0, attention: 0 },
  );

  return (
    <div className="space-y-6 pb-20">
      <AdminCatalogBreadcrumbs crumbs={[{ label: "Services" }]} />
      <AdminCatalogPageHeader
        title="Services"
        description="Review each learning service and open it to manage its categories. Services are fixed and cannot be created, edited, or deleted."
      />

      <AdminSummaryStrip
        items={[
          { label: "Categories", value: totals.categories, detail: "Across all services" },
          { label: "Courses", value: totals.courses, detail: "Including archived records" },
          { label: "Active learners", value: totals.learners, detail: "Unique per service" },
          { label: "Needs attention", value: totals.attention, detail: "Drafts and delivery gaps" },
        ]}
      />

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <tr>
              <TableHead className="px-4">Service</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Active learners</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead className="pr-4 text-right">Attention</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <tr>
                <TableCell colSpan={6} className="h-32 px-4 text-center text-muted-foreground">
                  Loading service summaries…
                </TableCell>
              </tr>
            ) : isError ? (
              <tr>
                <TableCell colSpan={6} className="h-32 px-4 text-center">
                  <p className="text-sm text-destructive">Could not load service summaries.</p>
                  <Button className="mt-3" size="sm" variant="outline" onClick={() => refetch()}>
                    Try again
                  </Button>
                </TableCell>
              </tr>
            ) : (
              services.map((service) => {
                const activeCategoryCount =
                  service.categories.total - service.categories.archived;
                const activeCourseCount =
                  service.courses.total - service.courses.archived;
                const href = `/admin/services/${service.serviceSlug}/categories`;

                return (
                  <NavigableTableRow
                    key={service.serviceType}
                    href={href}
                    label={`Open ${service.label} categories`}
                  >
                    <TableCell className="max-w-sm whitespace-normal px-4 py-4">
                      <p className="font-semibold text-foreground">{service.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{service.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono font-medium tabular-nums">
                        {service.categories.published} / {activeCategoryCount}
                      </p>
                      <p className="text-xs text-muted-foreground">published</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono font-medium tabular-nums">
                        {service.courses.published} / {activeCourseCount}
                      </p>
                      <p className="text-xs text-muted-foreground">published</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono font-medium tabular-nums">
                        {service.learners.activeUnique}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.learners.activeEnrollments} active enrollments
                      </p>
                    </TableCell>
                    <TableCell>
                      {service.batches ? (
                        <>
                          <p className="font-medium">Cohort</p>
                          <p className="text-xs text-muted-foreground">
                            {service.batches.active} active · {service.batches.enrolling} enrolling
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">Self-paced</p>
                          <p className="text-xs text-muted-foreground">Self enrollment</p>
                        </>
                      )}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {service.attentionCount > 0 ? (
                        <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="size-3" />
                          {service.attentionCount}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="size-3" /> Ready
                        </Badge>
                      )}
                    </TableCell>
                  </NavigableTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Attention includes unpublished categories and courses, courses without curriculum sessions, and paid enrollments awaiting payment completion.
      </p>
    </div>
  );
}
