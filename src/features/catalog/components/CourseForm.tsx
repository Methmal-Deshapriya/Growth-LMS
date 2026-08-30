"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  type AdminCategory,
  type AdminCourse,
  type CourseInput,
} from "../catalogApi";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const prefixify = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "");
const toList = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
const toText = (value: string[]) => value.join("\n");

/**
 * The real-world program a student browses and enrolls in. Everything here
 * is content shared by every intake this course will ever have — see the
 * 2026-08-30 course-to-program-intake rename plan.
 */
export function CourseForm({
  category,
  initial,
  onSuccess,
  onCancel,
}: {
  category: AdminCategory;
  initial?: AdminCourse;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const isFree = category.service.accessType === "FREE";
  const isEditing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [intakeCodePrefix, setIntakeCodePrefix] = useState(initial?.intakeCodePrefix ?? "");
  const [certificateEnabled, setCertificateEnabled] = useState<boolean | null>(
    initial ? initial.certificateEnabled : null,
  );
  const [discountAmount, setDiscountAmount] = useState(initial?.discountAmount?.toString() ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [level, setLevel] = useState<AdminCourse["level"]>(initial?.level ?? (isFree ? "OPEN" : "BEGINNER"));
  const [durationValue, setDurationValue] = useState(initial?.durationValue?.toString() ?? "");
  const [durationUnit, setDurationUnit] = useState<NonNullable<AdminCourse["durationUnit"]>>(
    initial?.durationUnit ?? (isFree ? "SESSION" : "WEEK"),
  );
  const [price, setPrice] = useState(initial ? initial.price.toString() : isFree ? "0" : "");
  const [highlights, setHighlights] = useState(toText(initial?.highlights ?? []));
  const [skills, setSkills] = useState(toText(initial?.skills ?? []));
  const [prerequisites, setPrerequisites] = useState(toText(initial?.prerequisites ?? []));
  const [create, createState] = useCreateCourseMutation();
  const [update, updateState] = useUpdateCourseMutation();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isEditing && certificateEnabled == null) {
      toast.error("Select whether this course issues certificates.");
      return;
    }
    const content = {
      title,
      slug,
      summary,
      description,
      level,
      durationValue: durationValue ? Number(durationValue) : null,
      durationUnit: durationValue ? durationUnit : null,
      price: isFree ? 0 : Number(price),
      highlights: toList(highlights),
      skills: toList(skills),
      prerequisites: toList(prerequisites),
      thumbnailUrl: null,
      sortOrder: 0,
    };
    try {
      if (initial) {
        await update({ id: initial.id, body: content }).unwrap();
        toast.success("Course updated");
      } else {
        const body: CourseInput = {
          categoryId: category.id,
          intakeCodePrefix,
          certificateEnabled: certificateEnabled as boolean,
          ...(category.service.accessType === "PAID" ? { discountAmount: Number(discountAmount) || 0 } : {}),
          ...content,
        };
        await create(body).unwrap();
        toast.success("Course created. Add its first intake next.");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save course"));
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <p className="text-sm text-muted-foreground">
        This is the real-world program students browse and click Enroll on. It
        never varies between intakes — dates, timezone, and capacity are set
        per intake instead.
      </p>

      <div className="space-y-2">
        <Label htmlFor="course-title">Title</Label>
        <Input
          id="course-title"
          required
          minLength={3}
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (!isEditing) {
              setSlug(slugify(value));
              setIntakeCodePrefix(prefixify(value));
            }
          }}
          placeholder="AI/ML Ignition Program"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="course-slug">Stable public slug</Label>
          <Input
            id="course-slug"
            required
            disabled={isEditing}
            pattern="[a-z0-9-]+"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
        </div>
        {!isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="course-prefix">Intake code prefix</Label>
            <Input
              id="course-prefix"
              required
              pattern="[A-Z0-9-]+"
              value={intakeCodePrefix}
              onChange={(event) => setIntakeCodePrefix(event.target.value.toUpperCase())}
            />
          </div>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="space-y-2">
          <Label htmlFor="course-certificate-policy">Certificate policy</Label>
          <select
            id="course-certificate-policy"
            required
            value={certificateEnabled == null ? "" : String(certificateEnabled)}
            onChange={(event) => setCertificateEnabled(event.target.value === "true")}
            className="h-10 w-full rounded-md border bg-background px-3"
          >
            <option value="" disabled>Select once</option>
            <option value="true">Every intake issues certificates</option>
            <option value="false">Intakes do not issue certificates</option>
          </select>
          <p className="text-xs text-muted-foreground">Applies to every current and future intake and cannot be changed later.</p>
        </div>
      ) : null}

      {!isEditing && category.service.accessType === "PAID" ? (
        <div className="space-y-2">
          <Label htmlFor="course-discount-amount">One-time-payment discount (LKR)</Label>
          <Input
            id="course-discount-amount"
            type="number"
            min={0}
            step={1}
            value={discountAmount}
            onChange={(event) => setDiscountAmount(event.target.value)}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Students who pay an intake&apos;s full price in one go get this much off. Paying in two halves never gets a discount. Applies to every intake and cannot be changed later.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="course-summary">Public summary</Label>
        <Input id="course-summary" required minLength={10} value={summary} onChange={(event) => setSummary(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course-description">Public description</Label>
        <textarea
          id="course-description"
          required
          minLength={20}
          className="min-h-28 w-full rounded-md border bg-background p-3 text-sm"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="course-level">Level</Label>
          <select
            id="course-level"
            className="h-10 w-full rounded-md border bg-background px-3"
            value={level}
            onChange={(event) => setLevel(event.target.value as AdminCourse["level"])}
          >
            {["OPEN", "FOUNDATION", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" type="number" min={1} value={durationValue} onChange={(event) => setDurationValue(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration-unit">Unit</Label>
          <select
            id="duration-unit"
            className="h-10 w-full rounded-md border bg-background px-3"
            value={durationUnit}
            onChange={(event) => setDurationUnit(event.target.value as NonNullable<AdminCourse["durationUnit"]>)}
          >
            {["SESSION", "DAY", "WEEK", "MONTH"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (LKR)</Label>
          <Input
            id="price"
            required={!isFree}
            disabled={isFree}
            type="number"
            min={isFree ? 0 : 1}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Highlights", highlights, setHighlights],
          ["Skills", skills, setSkills],
          ["Prerequisites", prerequisites, setPrerequisites],
        ].map(([label, value, setter]) => (
          <div key={label as string} className="space-y-2">
            <Label>{label as string} (one per line)</Label>
            <textarea
              className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
              value={value as string}
              onChange={(event) => (setter as (value: string) => void)(event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={createState.isLoading || updateState.isLoading}>
          {isEditing ? "Save course" : "Create course"}
        </Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  );
}
