"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import { useCreateCourseGroupMutation, type AdminCategory } from "../catalogApi";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const prefixify = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");

export function CourseGroupForm({ category, onSuccess, onCancel }: { category: AdminCategory; onSuccess?: () => void; onCancel?: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [batchCodePrefix, setBatchCodePrefix] = useState("");
  const [certificateEnabled, setCertificateEnabled] = useState<boolean | null>(null);
  const [create, state] = useCreateCourseGroupMutation();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (certificateEnabled == null) {
      toast.error("Select whether this real-world course issues certificates.");
      return;
    }
    try {
      await create({ categoryId: category.id, title, slug, batchCodePrefix, certificateEnabled }).unwrap();
      toast.success("Course group created. Add its first course next.");
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create course group"));
    }
  };

  return <form className="space-y-4" onSubmit={submit}>
    <p className="text-sm text-muted-foreground">This internal structure groups all seasonal intakes that represent the same real-world course. It is never shown publicly.</p>
    <div className="space-y-2"><Label htmlFor="group-title">Course name</Label><Input id="group-title" required minLength={3} value={title} onChange={(event) => { const value = event.target.value; setTitle(value); setSlug(slugify(value)); setBatchCodePrefix(prefixify(value)); }} placeholder="AI/ML Ignition Program" /></div>
    <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="group-slug">Stable public slug</Label><Input id="group-slug" required pattern="[a-z0-9-]+" value={slug} onChange={(event) => setSlug(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="group-prefix">Course code prefix</Label><Input id="group-prefix" required pattern="[A-Z0-9-]+" value={batchCodePrefix} onChange={(event) => setBatchCodePrefix(event.target.value.toUpperCase())} /></div></div>
    <div className="space-y-2">
      <Label htmlFor="group-certificate-policy">Certificate policy</Label>
      <select id="group-certificate-policy" required value={certificateEnabled == null ? "" : String(certificateEnabled)} onChange={(event) => setCertificateEnabled(event.target.value === "true")} className="h-10 w-full rounded-md border bg-background px-3">
        <option value="" disabled>Select once</option>
        <option value="true">Every course intake issues certificates</option>
        <option value="false">Course intakes do not issue certificates</option>
      </select>
      <p className="text-xs text-muted-foreground">This applies to every current and future intake in the group and cannot be changed later.</p>
    </div>
    <div className="flex gap-2"><Button type="submit" disabled={state.isLoading}>Create course group</Button>{onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}</div>
  </form>;
}
