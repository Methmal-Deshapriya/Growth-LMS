"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import { type AdminCourse, type CourseInput, useCreateCourseMutation, useGetAdminCategoriesQuery, useUpdateCourseMutation } from "../catalogApi";

type FormState = Omit<CourseInput, "highlights" | "skills" | "prerequisites"> & { highlights: string; skills: string; prerequisites: string };
const fromList = (items?: string[]) => items?.join("\n") ?? "";
const toList = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const empty = (categoryId = ""): FormState => ({ categoryId, slug: "", title: "", summary: "", description: "", level: "BEGINNER", durationValue: null, durationUnit: null, accessType: "PAID", price: 0, currency: "LKR", certificateEnabled: false, highlights: "", skills: "", prerequisites: "", thumbnailUrl: null, sortOrder: 0 });

export function CourseForm({ initial }: { initial?: AdminCourse }) {
  const router = useRouter();
  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const categories = categoriesData?.categories.filter((category) => category.status !== "ARCHIVED") ?? [];
  const [form, setForm] = useState<FormState>(() => initial ? { ...initial, highlights: fromList(initial.highlights), skills: fromList(initial.skills), prerequisites: fromList(initial.prerequisites) } : empty());
  const [createCourse, createState] = useCreateCourseMutation();
  const [updateCourse, updateState] = useUpdateCourseMutation();
  const change = (key: keyof FormState, value: FormState[keyof FormState]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: CourseInput = { ...form, price: form.accessType === "FREE" ? 0 : Number(form.price), durationValue: form.durationValue ? Number(form.durationValue) : null, durationUnit: form.durationValue ? form.durationUnit || "WEEK" : null, highlights: toList(form.highlights), skills: toList(form.skills), prerequisites: toList(form.prerequisites), thumbnailUrl: form.thumbnailUrl || null };
    try {
      if (initial) await updateCourse({ id: initial.id, body: payload }).unwrap(); else await createCourse(payload).unwrap();
      toast.success(initial ? "Course updated" : "Course created as a draft"); router.push("/admin/catalog/courses");
    } catch (error) { toast.error(getApiErrorMessage(error, "Could not save course")); }
  };
  return <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-card p-6">
    <div className="grid gap-5 md:grid-cols-2"><div><Label>Category</Label><select required className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={form.categoryId} onChange={(e) => change("categoryId", e.target.value)} disabled={initial?.status === "PUBLISHED"}>{categories.map((category) => <option key={category.id} value={category.id}>{category.serviceType.replaceAll("_", " ")} — {category.title}</option>)}</select></div><div><Label>Level</Label><select className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={form.level} onChange={(e) => change("level", e.target.value)}>{["OPEN", "FOUNDATION", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((value) => <option key={value}>{value}</option>)}</select></div>
      <div><Label>Title</Label><Input required minLength={3} value={form.title} onChange={(e) => { change("title", e.target.value); if (!initial) change("slug", slugify(e.target.value)); }} /></div><div><Label>Slug</Label><Input required pattern="[a-z0-9-]+" value={form.slug} onChange={(e) => change("slug", e.target.value)} disabled={initial?.status === "PUBLISHED"} /></div></div>
    <div><Label>Card summary</Label><Input required minLength={10} value={form.summary} onChange={(e) => change("summary", e.target.value)} /></div><div><Label>Full description</Label><textarea required minLength={20} className="mt-1 min-h-32 w-full rounded-md border bg-background p-3 text-sm" value={form.description} onChange={(e) => change("description", e.target.value)} /></div>
    <div className="grid gap-5 md:grid-cols-4"><div><Label>Access</Label><select className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={form.accessType} onChange={(e) => change("accessType", e.target.value)}><option>PAID</option><option>FREE</option></select></div><div><Label>Price</Label><Input type="number" min={0} disabled={form.accessType === "FREE"} value={form.accessType === "FREE" ? 0 : form.price} onChange={(e) => change("price", Number(e.target.value))} /></div><div><Label>Duration</Label><Input type="number" min={1} value={form.durationValue ?? ""} onChange={(e) => change("durationValue", e.target.value ? Number(e.target.value) : null)} /></div><div><Label>Unit</Label><select className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={form.durationUnit ?? ""} onChange={(e) => change("durationUnit", e.target.value || null)}><option value="">None</option>{["SESSION", "DAY", "WEEK", "MONTH"].map((value) => <option key={value}>{value}</option>)}</select></div></div>
    <div className="grid gap-5 md:grid-cols-3">{(["highlights", "skills", "prerequisites"] as const).map((key) => <div key={key}><Label>{key[0].toUpperCase() + key.slice(1)} (one per line)</Label><textarea className="mt-1 min-h-32 w-full rounded-md border bg-background p-3 text-sm" value={form[key]} onChange={(e) => change(key, e.target.value)} /></div>)}</div>
    <div className="grid gap-5 md:grid-cols-3"><div><Label>Thumbnail URL</Label><Input type="url" value={form.thumbnailUrl ?? ""} onChange={(e) => change("thumbnailUrl", e.target.value || null)} /></div><div><Label>Sort order</Label><Input type="number" min={0} value={form.sortOrder ?? 0} onChange={(e) => change("sortOrder", Number(e.target.value))} /></div><label className="flex items-center gap-2 pt-7 text-sm font-medium"><input type="checkbox" checked={form.certificateEnabled ?? false} onChange={(e) => change("certificateEnabled", e.target.checked)} /> Certificate enabled</label></div>
    <div className="flex gap-3"><Button type="submit" disabled={!form.categoryId || createState.isLoading || updateState.isLoading}>{initial ? "Save course" : "Create draft"}</Button><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button></div>
  </form>;
}
