"use client";

import { useParams } from "next/navigation";
import { AdminBatchDetails } from "@/features/batches/components/AdminBatchDetails";

export default function AdminBatchPage() {
  const { id } = useParams<{ id: string }>();
  return <AdminBatchDetails batchId={id} />;
}
