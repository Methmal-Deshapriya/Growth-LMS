"use client";

import { use } from "react";
import { format } from "date-fns";
import { Award, CircleAlert, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { useVerifyCertificateQuery } from "@/features/certificates/certificatesApi";

export default function PublicCertificateVerificationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { data: certificate, isLoading, isError } = useVerifyCertificateQuery(code);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 py-20">
        <p role="status" aria-live="polite" className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          Verifying certificate…
        </p>
      </main>
    );
  }

  if (isError || !certificate) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 py-20">
        <section role="alert" className="w-full rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <CircleAlert className="mx-auto size-10 text-destructive" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-semibold">Certificate not found</h1>
          <p className="mt-2 text-muted-foreground">
            This code does not match a certificate issued by Foundry Academy.
          </p>
        </section>
      </main>
    );
  }

  const isIssued = certificate.status === "ISSUED";

  return (
    <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-20">
      <article className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 p-8 text-center">
          <Award className="mx-auto size-12 text-primary" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Foundry Academy certificate
          </p>
          <h1 className="mt-2 text-3xl font-bold">Credential verification</h1>
        </div>
        <div className="space-y-6 p-8">
          <div
            role="status"
            className={
              isIssued
                ? "flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300"
                : "flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive"
            }
          >
            {isIssued ? (
              <ShieldCheck className="size-6 shrink-0" aria-hidden="true" />
            ) : (
              <ShieldX className="size-6 shrink-0" aria-hidden="true" />
            )}
            <div>
              <p className="font-semibold">{isIssued ? "Valid certificate" : "Revoked certificate"}</p>
              <p className="text-sm opacity-90">
                {isIssued
                  ? "This credential is currently valid."
                  : "This credential is retained for verification history but is no longer valid."}
              </p>
            </div>
          </div>

          <dl className="grid gap-5 sm:grid-cols-2">
            <CertificateField label="Student" value={certificate.studentName} />
            <CertificateField label="Course" value={certificate.courseName} />
            <CertificateField
              label="Issued date"
              value={format(new Date(certificate.issuedDate), "MMMM dd, yyyy")}
            />
            <CertificateField label="Certificate code" value={certificate.certificateCode} mono />
          </dl>

          {certificate.skills.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Skills recorded</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {certificate.skills.map((skill) => (
                  <span key={skill} className="rounded-md border bg-background px-2.5 py-1 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}

function CertificateField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={mono ? "mt-1 font-mono font-medium" : "mt-1 font-medium"}>{value}</dd>
    </div>
  );
}
