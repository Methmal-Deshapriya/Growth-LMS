"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ExternalLink, Loader2, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
import { useGetAllCertificatesAdminQuery, useRevokeCertificateMutation } from "@/features/certificates/certificatesApi";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CursorPagination } from "@/components/ui/cursor-pagination";

export default function AdminCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const page = cursors.length - 1;
  const normalizedSearch = searchTerm.trim();
  const { data, isLoading, isError, isFetching } =
    useGetAllCertificatesAdminQuery({
      q: normalizedSearch,
      cursor: cursors[page],
      limit: 50,
    });
  const [revokeCertificate, { isLoading: isRevoking }] = useRevokeCertificateMutation();
  const certificates = data?.certificates ?? [];

  const handleRevoke = async (id: string, code: string) => {
    const reason = window.prompt(`Please enter a reason for revoking certificate ${code}:`);
    if (!reason?.trim()) return;

    try {
      await revokeCertificate({ id, data: { revocationReason: reason.trim() } }).unwrap();
      toast.success("Certificate revoked successfully");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to revoke certificate"));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Certificate Management</h1>
        <p className="mt-1 text-muted-foreground">View issued certificates and manage their validity.</p>
      </div>

      <div className="rounded-md border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Search certificates"
            placeholder="Search by code, student, or course…"
            className="h-11 pl-10"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCursors([undefined]);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card" aria-busy={isLoading || isFetching}>
        <Table>
          <TableCaption className="sr-only">Issued and revoked certificates</TableCaption>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="px-4">Certificate code</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={cn(isFetching && !isLoading && "opacity-60")}>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading certificates…
                  </span>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-destructive">
                  <span role="alert">Failed to load certificates. Please try again.</span>
                </TableCell>
              </TableRow>
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 whitespace-normal text-center text-muted-foreground">
                  {normalizedSearch ? "No certificates match your search." : "No certificates have been issued yet."}
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell className="px-4 py-4 font-mono">{certificate.certificateCode}</TableCell>
                  <TableCell className="font-medium">{certificate.studentName}</TableCell>
                  <TableCell className="max-w-xs whitespace-normal">{certificate.courseName}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                        certificate.status === "ISSUED"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-destructive/20 bg-destructive/10 text-destructive",
                      )}
                    >
                      {certificate.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{format(new Date(certificate.issuedDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link
                          href={`/certificates/verify/${certificate.certificateCode}`}
                          target="_blank"
                          aria-label={`Open public verification for ${certificate.certificateCode}`}
                        >
                          <ExternalLink className="size-4 text-primary" aria-hidden="true" />
                        </Link>
                      </Button>
                      {certificate.status === "ISSUED" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Revoke certificate ${certificate.certificateCode}`}
                          onClick={() => handleRevoke(certificate.id, certificate.certificateCode)}
                          disabled={isRevoking}
                        >
                          <XCircle className="size-4 text-destructive" aria-hidden="true" />
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <CursorPagination
        page={page}
        hasMore={data?.pagination.hasMore ?? false}
        isFetching={isFetching}
        onPrevious={() => setCursors((current) => current.slice(0, -1))}
        onNext={() => {
          const nextCursor = data?.pagination.nextCursor;
          if (nextCursor) setCursors((current) => [...current, nextCursor]);
        }}
      />
    </div>
  );
}
