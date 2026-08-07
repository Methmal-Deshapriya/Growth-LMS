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
  useDeleteCategoryPermanentlyMutation,
  useGetAdminCategoriesQuery,
  usePublishCategoryMutation,
  useUnarchiveCategoryMutation,
  useUnpublishCategoryMutation,
  useUpdateCategoryMutation,
} from "../catalogApi";

const EMPTY: CategoryInput = {
  serviceType: "BOOTCAMPS",
  slug: "",
  title: "",
  description: "",
  visualKey: "sparkles",
  audienceLabel: "",
  badgeLabel: "",
  sortOrder: 0,
};

const VISUAL_KEYS = [
  "sparkles",
  "cpu",
  "code2",
  "workflow",
  "calculator",
  "atom",
  "bar-chart3",
  "terminal",
  "git-branch",
  "globe",
  "languages",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function CategoryManager() {
  const { data, isLoading } = useGetAdminCategoriesQuery();
  const role = useAppSelector(selectAuthRole);
  const canPublish = hasPermission(role, PERMISSIONS.CATALOG_PUBLISH);
  const canDelete = hasPermission(
    role,
    PERMISSIONS.CATALOG_DELETE_PERMANENTLY,
  );
  const [selected, setSelectedState] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CategoryInput>(EMPTY);
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [publishCategory] = usePublishCategoryMutation();
  const [unpublishCategory] = useUnpublishCategoryMutation();
  const [archiveCategory] = useArchiveCategoryMutation();
  const [unarchiveCategory] = useUnarchiveCategoryMutation();
  const [deleteCategoryPermanently] =
    useDeleteCategoryPermanentlyMutation();

  const setSelected = (category: AdminCategory | null) => {
    setSelectedState(category);
    setForm(
      category
        ? {
            serviceType: category.serviceType,
            slug: category.slug,
            title: category.title,
            description: category.description,
            visualKey: category.visualKey,
            audienceLabel: category.audienceLabel,
            badgeLabel: category.badgeLabel,
            sortOrder: category.sortOrder,
          }
        : EMPTY,
    );
  };

  const change = (key: keyof CategoryInput, value: string | number) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      audienceLabel: form.audienceLabel?.trim() || null,
      badgeLabel: form.badgeLabel?.trim() || null,
    };
    try {
      if (selected) {
        await updateCategory({ id: selected.id, body: payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }
      toast.success(
        selected ? "Category updated" : "Category created as a draft",
      );
      setSelected(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save category"));
    }
  };

  const lifecycle = async (
    category: AdminCategory,
    action: "publish" | "unpublish" | "archive" | "unarchive",
  ) => {
    if (
      action === "archive" &&
      !window.confirm(
        `Archive ${category.title} and every course inside it? Existing learners will keep access.`,
      )
    ) {
      return;
    }

    try {
      if (action === "publish") await publishCategory(category.id).unwrap();
      if (action === "unpublish") await unpublishCategory(category.id).unwrap();
      if (action === "archive") await archiveCategory(category.id).unwrap();
      if (action === "unarchive") {
        await unarchiveCategory(category.id).unwrap();
      }
      toast.success(
        action === "unarchive"
          ? "Category restored as a draft. Its courses remain archived."
          : `Category ${action}d`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Action failed"));
    }
  };

  const permanentlyDelete = async (category: AdminCategory) => {
    const confirmation = `DELETE ${category.title}`;
    const entered = window.prompt(
      `This permanently deletes the category, its ${category.courseCount} course(s), sessions, enrollments, progress, certificates, and projects. This cannot be undone.\n\nType "${confirmation}" to continue.`,
    );
    if (entered === null) return;
    if (entered !== confirmation) {
      toast.error("Confirmation text did not match. Nothing was deleted.");
      return;
    }

    try {
      await deleteCategoryPermanently(category.id).unwrap();
      toast.success("Category and all dependent records permanently deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Permanent deletion failed"));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Service</th>
                <th className="p-4">Courses</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td className="p-6" colSpan={5}>
                    Loading categories…
                  </td>
                </tr>
              ) : (
                data?.categories.map((category) => {
                  const isArchived = category.status === "ARCHIVED";
                  return (
                    <tr key={category.id}>
                      <td className="p-4">
                        <p className="font-semibold">{category.title}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          /{category.slug}
                        </p>
                      </td>
                      <td className="p-4">
                        {category.serviceType.replaceAll("_", " ")}
                      </td>
                      <td className="p-4">{category.courseCount}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">
                          {category.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelected(category)}
                            disabled={isArchived}
                          >
                            Edit
                          </Button>
                          {canPublish && isArchived ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => lifecycle(category, "unarchive")}
                            >
                              Unarchive
                            </Button>
                          ) : null}
                          {canPublish && !isArchived ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                lifecycle(
                                  category,
                                  category.status === "PUBLISHED"
                                    ? "unpublish"
                                    : "publish",
                                )
                              }
                            >
                              {category.status === "PUBLISHED"
                                ? "Unpublish"
                                : "Publish"}
                            </Button>
                          ) : null}
                          {canPublish && !isArchived ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => lifecycle(category, "archive")}
                            >
                              Archive
                            </Button>
                          ) : null}
                          {canDelete && isArchived ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => permanentlyDelete(category)}
                            >
                              Delete permanently
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-border bg-card p-5"
      >
        <div>
          <h2 className="font-bold">
            {selected ? "Edit category" : "New category"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Categories are always created as drafts.
          </p>
        </div>
        <div>
          <Label>Service</Label>
          <select
            className="mt-1 h-10 w-full rounded-md border bg-background px-3"
            value={form.serviceType}
            onChange={(event) => change("serviceType", event.target.value)}
            disabled={selected?.status === "PUBLISHED"}
          >
            {["BOOTCAMPS", "PRETECH", "FREE_LEARNING"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Title</Label>
          <Input
            required
            minLength={2}
            value={form.title}
            onChange={(event) => {
              change("title", event.target.value);
              if (!selected) change("slug", slugify(event.target.value));
            }}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            required
            pattern="[a-z0-9-]+"
            value={form.slug}
            onChange={(event) => change("slug", event.target.value)}
            disabled={selected?.status === "PUBLISHED"}
          />
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            required
            minLength={10}
            className="mt-1 min-h-24 w-full rounded-md border bg-background p-3 text-sm"
            value={form.description}
            onChange={(event) => change("description", event.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Visual key</Label>
            <select
              className="mt-1 h-10 w-full rounded-md border bg-background px-2"
              value={form.visualKey}
              onChange={(event) => change("visualKey", event.target.value)}
            >
              {VISUAL_KEYS.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Sort order</Label>
            <Input
              type="number"
              min={0}
              value={form.sortOrder ?? 0}
              onChange={(event) =>
                change("sortOrder", Number(event.target.value))
              }
            />
          </div>
        </div>
        <div>
          <Label>Audience label</Label>
          <Input
            value={form.audienceLabel ?? ""}
            onChange={(event) => change("audienceLabel", event.target.value)}
          />
        </div>
        <div>
          <Label>Badge (optional)</Label>
          <Input
            value={form.badgeLabel ?? ""}
            onChange={(event) => change("badgeLabel", event.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={createState.isLoading || updateState.isLoading}
          >
            {selected ? "Save changes" : "Create draft"}
          </Button>
          {selected ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
