"use client";

import { useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import { useCreateBatchMutation } from "../batchesApi";
import type { BatchInput } from "../batchesTypes";

const EMPTY_BATCH: BatchInput = {
  name: "",
  code: "",
  startDate: "",
  expectedEndDate: "",
  timezone: "Asia/Colombo",
  capacity: null,
  initializeCurriculum: true,
};

export function BatchForm({
  courseId,
  onSuccess,
  onCancel,
}: {
  courseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const formId = useId();
  const [form, setForm] = useState<BatchInput>(EMPTY_BATCH);
  const [createBatch, createState] = useCreateBatchMutation();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await createBatch({ courseId, data: form }).unwrap();
      toast.success(
        `Batch created with ${result.initializedSessionCount} hidden session(s)`,
      );
      setForm(EMPTY_BATCH);
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create batch"));
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`${formId}-name`}>Name</Label>
        <Input
          id={`${formId}-name`}
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="August 2026"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-code`}>Code</Label>
        <Input
          id={`${formId}-code`}
          required
          value={form.code}
          onChange={(event) =>
            setForm({ ...form, code: event.target.value.toUpperCase() })
          }
          placeholder="ML1-2026-AUG"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-start`}>Start date</Label>
        <Input
          id={`${formId}-start`}
          required
          type="date"
          value={form.startDate}
          onChange={(event) =>
            setForm({ ...form, startDate: event.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-end`}>Expected end</Label>
        <Input
          id={`${formId}-end`}
          required
          type="date"
          value={form.expectedEndDate}
          onChange={(event) =>
            setForm({ ...form, expectedEndDate: event.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-capacity`}>Capacity</Label>
        <Input
          id={`${formId}-capacity`}
          type="number"
          min={1}
          value={form.capacity ?? ""}
          onChange={(event) =>
            setForm({
              ...form,
              capacity: event.target.value ? Number(event.target.value) : null,
            })
          }
        />
      </div>
      <label className="flex items-center gap-2 self-end pb-3 text-sm">
        <input
          type="checkbox"
          checked={form.initializeCurriculum}
          onChange={(event) =>
            setForm({ ...form, initializeCurriculum: event.target.checked })
          }
        />
        Copy current curriculum as hidden lessons
      </label>
      <div className="flex gap-2 md:col-span-2">
        <Button type="submit" disabled={createState.isLoading}>
          {createState.isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Create draft batch
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
