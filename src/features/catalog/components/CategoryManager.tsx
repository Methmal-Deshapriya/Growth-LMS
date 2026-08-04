"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/store/hooks";
import { selectAuthRole } from "@/features/auth/authSelectors";
import { getApiErrorMessage } from "@/lib/api";
import { hasPermission, PERMISSIONS } from "@/lib/access";
import {
  type AdminCategory,
  type CategoryInput,
  useArchiveCategoryMutation,
  useCreateCategoryMutation,
  useGetAdminCategoriesQuery,
  usePublishCategoryMutation,
  useUnpublishCategoryMutation,
  useUpdateCategoryMutation,
} from "../catalogApi";

const EMPTY: CategoryInput = { serviceType: "BOOTCAMPS", slug: "", title: "", description: "", visualKey: "sparkles", audienceLabel: "", badgeLabel: "", sortOrder: 0 };
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function CategoryManager() {
  const { data, isLoading } = useGetAdminCategoriesQuery();
  const role = useAppSelector(selectAuthRole);
  const canPublish = hasPermission(role, PERMISSIONS.CATALOG_PUBLISH);
  const [selected, setSelectedState] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CategoryInput>(EMPTY);
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [publishCategory] = usePublishCategoryMutation();
  const [unpublishCategory] = useUnpublishCategoryMutation();
  const [archiveCategory] = useArchiveCategoryMutation();
  const setSelected = (category: AdminCategory | null) => {
    setSelectedState(category);
    setForm(category ? { serviceType: category.serviceType, slug: category.slug, title: category.title, description: category.description, visualKey: category.visualKey, audienceLabel: category.audienceLabel, badgeLabel: category.badgeLabel, sortOrder: category.sortOrder } : EMPTY);
  };

  const change = (key: keyof CategoryInput, value: string | number) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      audienceLabel: form.audienceLabel?.trim() || null,
      badgeLabel: form.badgeLabel?.trim() || null,
    };
    try {
      if (selected) await updateCategory({ id: selected.id, body: payload }).unwrap();
      else await createCategory(payload).unwrap();
      toast.success(selected ? "Category updated" : "Category created as a draft");
      setSelected(null); setForm(EMPTY);
    } catch (error) { toast.error(getApiErrorMessage(error, "Could not save category")); }
  };
  const lifecycle = async (category: AdminCategory, action: "publish" | "unpublish" | "archive") => {
    if (action === "archive" && !confirm(`Archive ${category.title} and every course inside it?`)) return;
    try {
      if (action === "publish") await publishCategory(category.id).unwrap();
      if (action === "unpublish") await unpublishCategory(category.id).unwrap();
      if (action === "archive") await archiveCategory(category.id).unwrap();
      toast.success(`Category ${action}d`);
    } catch (error) { toast.error(getApiErrorMessage(error, "Action failed")); }
  };

  return <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
    <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="p-4">Category</th><th className="p-4">Service</th><th className="p-4">Courses</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{isLoading ? <tr><td className="p-6" colSpan={5}>Loading categories…</td></tr> : data?.categories.map((category) => <tr key={category.id}><td className="p-4"><p className="font-semibold">{category.title}</p><p className="font-mono text-xs text-muted-foreground">/{category.slug}</p></td><td className="p-4">{category.serviceType.replaceAll("_", " ")}</td><td className="p-4">{category.courseCount}</td><td className="p-4"><span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{category.status}</span></td><td className="p-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => setSelected(category)} disabled={category.status === "ARCHIVED"}>Edit</Button>{canPublish && category.status !== "ARCHIVED" && <Button size="sm" variant="outline" onClick={() => lifecycle(category, category.status === "PUBLISHED" ? "unpublish" : "publish")}>{category.status === "PUBLISHED" ? "Unpublish" : "Publish"}</Button>}{canPublish && category.status !== "ARCHIVED" && <Button size="sm" variant="destructive" onClick={() => lifecycle(category, "archive")}>Archive</Button>}</div></td></tr>)}</tbody></table></div></div>
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5"><div><h2 className="font-bold">{selected ? "Edit category" : "New category"}</h2><p className="text-xs text-muted-foreground">Categories are always created as drafts.</p></div>
      <div><Label>Service</Label><select className="mt-1 h-10 w-full rounded-md border bg-background px-3" value={form.serviceType} onChange={(e) => change("serviceType", e.target.value)} disabled={selected?.status === "PUBLISHED"}>{["BOOTCAMPS", "PRETECH", "FREE_LEARNING"].map((value) => <option key={value}>{value}</option>)}</select></div>
      <div><Label>Title</Label><Input required minLength={2} value={form.title} onChange={(e) => { change("title", e.target.value); if (!selected) change("slug", slugify(e.target.value)); }} /></div>
      <div><Label>Slug</Label><Input required pattern="[a-z0-9-]+" value={form.slug} onChange={(e) => change("slug", e.target.value)} disabled={selected?.status === "PUBLISHED"} /></div>
      <div><Label>Description</Label><textarea required minLength={10} className="mt-1 min-h-24 w-full rounded-md border bg-background p-3 text-sm" value={form.description} onChange={(e) => change("description", e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3"><div><Label>Visual key</Label><select className="mt-1 h-10 w-full rounded-md border bg-background px-2" value={form.visualKey} onChange={(e) => change("visualKey", e.target.value)}>{["sparkles", "cpu", "code2", "workflow", "calculator", "atom", "bar-chart3", "terminal", "git-branch", "globe", "languages"].map((value) => <option key={value}>{value}</option>)}</select></div><div><Label>Sort order</Label><Input type="number" min={0} value={form.sortOrder ?? 0} onChange={(e) => change("sortOrder", Number(e.target.value))} /></div></div>
      <div><Label>Audience label</Label><Input value={form.audienceLabel ?? ""} onChange={(e) => change("audienceLabel", e.target.value)} /></div><div><Label>Badge (optional)</Label><Input value={form.badgeLabel ?? ""} onChange={(e) => change("badgeLabel", e.target.value)} /></div>
      <div className="flex gap-2"><Button type="submit" disabled={createState.isLoading || updateState.isLoading}>{selected ? "Save changes" : "Create draft"}</Button>{selected && <Button type="button" variant="outline" onClick={() => setSelected(null)}>Cancel</Button>}</div>
    </form>
  </div>;
}
