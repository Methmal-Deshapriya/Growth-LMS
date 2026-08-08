"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  type AdminCategory,
  type AdminCourse,
  type CourseInput,
  useCreateCourseMutation,
  useGetAdminCategoriesQuery,
  useUpdateCourseMutation,
} from "../catalogApi";

type FormState = Omit<
  CourseInput,
  "highlights" | "skills" | "prerequisites"
> & {
  highlights: string;
  skills: string;
  prerequisites: string;
};

const fromList = (items?: string[]) => items?.join("\n") ?? "";
const toList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const empty = (
  categoryId = "",
  accessType: AdminCourse["accessType"] = "PAID",
): FormState => ({
  categoryId,
  slug: "",
  title: "",
  summary: "",
  description: "",
  level: "BEGINNER",
  durationValue: null,
  durationUnit: null,
  accessType,
  price: 0,
  currency: "LKR",
  certificateEnabled: false,
  highlights: "",
  skills: "",
  prerequisites: "",
  thumbnailUrl: null,
  sortOrder: 0,
});

export function CourseForm({
  initial,
  lockedCategory,
  returnHref = "/admin/services",
  onSuccess,
  onCancel,
  embedded = false,
}: {
  initial?: AdminCourse;
  lockedCategory?: AdminCategory;
  returnHref?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}) {
  const router = useRouter();
  const { data: categoriesData } = useGetAdminCategoriesQuery(undefined, {
    skip: Boolean(lockedCategory),
  });
  const categories = lockedCategory
    ? [lockedCategory]
    : categoriesData?.categories.filter(
        (category) => category.status !== "ARCHIVED",
      ) ?? [];
  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          ...initial,
          highlights: fromList(initial.highlights),
          skills: fromList(initial.skills),
          prerequisites: fromList(initial.prerequisites),
        }
      : empty(
          lockedCategory?.id,
          lockedCategory?.serviceType === "FREE_LEARNING" ? "FREE" : "PAID",
        ),
  );
  const [createCourse, createState] = useCreateCourseMutation();
  const [updateCourse, updateState] = useUpdateCourseMutation();

  const change = (
    key: keyof FormState,
    value: FormState[keyof FormState],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: CourseInput = {
      ...form,
      price: form.accessType === "FREE" ? 0 : Number(form.price),
      durationValue: form.durationValue ? Number(form.durationValue) : null,
      durationUnit: form.durationValue
        ? form.durationUnit || "WEEK"
        : null,
      highlights: toList(form.highlights),
      skills: toList(form.skills),
      prerequisites: toList(form.prerequisites),
      thumbnailUrl: form.thumbnailUrl || null,
    };

    try {
      if (initial) {
        await updateCourse({ id: initial.id, body: payload }).unwrap();
      } else {
        await createCourse(payload).unwrap();
      }
      toast.success(initial ? "Course updated" : "Course created as a draft");
      if (onSuccess) onSuccess();
      else router.push(returnHref);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save course"));
    }
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "space-y-6",
        !embedded && "rounded-md border border-border bg-card p-6",
      )}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="course-category">Category</Label>
          <select
            id="course-category"
            required
            className="mt-1 h-10 w-full rounded-md border bg-background px-3"
            value={form.categoryId}
            onChange={(event) => change("categoryId", event.target.value)}
            disabled={Boolean(lockedCategory) || initial?.status === "PUBLISHED"}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.serviceType.replaceAll("_", " ")} - {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="course-level">Level</Label>
          <select
            id="course-level"
            className="mt-1 h-10 w-full rounded-md border bg-background px-3"
            value={form.level}
            onChange={(event) => change("level", event.target.value)}
          >
            {["OPEN", "FOUNDATION", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map(
              (value) => (
                <option key={value}>{value}</option>
              ),
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="course-title">Title</Label>
          <Input
            id="course-title"
            required
            minLength={3}
            value={form.title}
            onChange={(event) => {
              change("title", event.target.value);
              if (!initial) change("slug", slugify(event.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="course-slug">Slug</Label>
          <Input
            id="course-slug"
            required
            pattern="[a-z0-9-]+"
            value={form.slug}
            onChange={(event) => change("slug", event.target.value)}
            disabled={initial?.status === "PUBLISHED"}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="course-summary">Card summary</Label>
        <Input
          id="course-summary"
          required
          minLength={10}
          value={form.summary}
          onChange={(event) => change("summary", event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="course-description">Full description</Label>
        <textarea
          id="course-description"
          required
          minLength={20}
          className="mt-1 min-h-32 w-full rounded-md border bg-background p-3 text-sm"
          value={form.description}
          onChange={(event) => change("description", event.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div>
          <Label htmlFor="course-access">Access</Label>
          <select
            id="course-access"
            className="mt-1 h-10 w-full rounded-md border bg-background px-3"
            value={form.accessType}
            onChange={(event) => change("accessType", event.target.value)}
            disabled={Boolean(lockedCategory)}
          >
            <option>PAID</option>
            <option>FREE</option>
          </select>
        </div>
        <div>
          <Label htmlFor="course-price">Price</Label>
          <Input
            id="course-price"
            type="number"
            min={0}
            disabled={form.accessType === "FREE"}
            value={form.accessType === "FREE" ? 0 : form.price}
            onChange={(event) => change("price", Number(event.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="course-duration">Duration</Label>
          <Input
            id="course-duration"
            type="number"
            min={1}
            value={form.durationValue ?? ""}
            onChange={(event) =>
              change(
                "durationValue",
                event.target.value ? Number(event.target.value) : null,
              )
            }
          />
        </div>
        <div>
          <Label htmlFor="course-unit">Unit</Label>
          <select
            id="course-unit"
            className="mt-1 h-10 w-full rounded-md border bg-background px-3"
            value={form.durationUnit ?? ""}
            onChange={(event) =>
              change("durationUnit", event.target.value || null)
            }
          >
            <option value="">None</option>
            {["SESSION", "DAY", "WEEK", "MONTH"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {(["highlights", "skills", "prerequisites"] as const).map((key) => (
          <div key={key}>
            <Label htmlFor={`course-${key}`}>
              {key[0].toUpperCase() + key.slice(1)} (one per line)
            </Label>
            <textarea
              id={`course-${key}`}
              className="mt-1 min-h-32 w-full rounded-md border bg-background p-3 text-sm"
              value={form[key]}
              onChange={(event) => change(key, event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="course-thumbnail">Thumbnail URL</Label>
          <Input
            id="course-thumbnail"
            type="url"
            value={form.thumbnailUrl ?? ""}
            onChange={(event) =>
              change("thumbnailUrl", event.target.value || null)
            }
          />
        </div>
        <div>
          <Label htmlFor="course-sort-order">Sort order</Label>
          <Input
            id="course-sort-order"
            type="number"
            min={0}
            value={form.sortOrder ?? 0}
            onChange={(event) =>
              change("sortOrder", Number(event.target.value))
            }
          />
        </div>
        <label className="flex items-center gap-2 pt-7 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.certificateEnabled ?? false}
            onChange={(event) =>
              change("certificateEnabled", event.target.checked)
            }
          />
          Certificate enabled
        </label>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={
            !form.categoryId ||
            createState.isLoading ||
            updateState.isLoading
          }
        >
          {initial ? "Save course" : "Create draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onCancel) onCancel();
            else router.back();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
