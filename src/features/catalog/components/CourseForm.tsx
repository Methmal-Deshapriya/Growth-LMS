"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import {
  type AdminCourse,
  type AdminCourseGroup,
  type CourseInput,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../catalogApi";

const toList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export function CourseForm({
  group,
  initial,
  onSuccess,
  onCancel,
}: {
  group: AdminCourseGroup;
  initial?: AdminCourse;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const firstCourse = group.courses.length === 0;
  const service = group.category.service;
  const isFree = service.accessType === "FREE";
  const [sourceCourseId, setSourceCourseId] = useState(
    group.courses[0]?.id ?? "",
  );
  const [intakeKey, setIntakeKey] = useState(
    initial?.intakeKey ?? (isFree ? "EVERGREEN" : ""),
  );
  const [startDate, setStartDate] = useState(
    initial?.startDate?.slice(0, 10) ?? "",
  );
  const [expectedEndDate, setExpectedEndDate] = useState(
    initial?.expectedEndDate?.slice(0, 10) ?? "",
  );
  const [timezone, setTimezone] = useState(initial?.timezone ?? "Asia/Colombo");
  const [capacity, setCapacity] = useState(initial?.capacity?.toString() ?? "");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<AdminCourse["level"]>(
    isFree ? "OPEN" : "BEGINNER",
  );
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState<
    NonNullable<AdminCourse["durationUnit"]>
  >(isFree ? "SESSION" : "WEEK");
  const [price, setPrice] = useState(isFree ? "0" : "");
  const [highlights, setHighlights] = useState("");
  const [skills, setSkills] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [createCourse, createState] = useCreateCourseMutation();
  const [updateCourse, updateState] = useUpdateCourseMutation();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (initial) {
        await updateCourse({
          id: initial.id,
          body: {
            startDate: isFree ? null : startDate,
            expectedEndDate: isFree ? null : expectedEndDate,
            timezone,
            capacity: capacity ? Number(capacity) : null,
          },
        }).unwrap();
        toast.success("Course intake setup updated");
      } else {
        const body: CourseInput = {
          courseGroupId: group.id,
          intakeKey,
          startDate: isFree ? null : startDate,
          expectedEndDate: isFree ? null : expectedEndDate,
          timezone,
          capacity: capacity ? Number(capacity) : null,
          ...(firstCourse
            ? {
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
              }
            : { sourceCourseId }),
        };
        await createCourse(body).unwrap();
        toast.success(
          firstCourse
            ? "First course created as draft"
            : "New intake copied as draft",
        );
      }
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save course intake"));
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="rounded-md border bg-muted/30 p-4 text-sm">
        <p className="font-semibold">{group.title}</p>
        <p className="text-muted-foreground">
          Code prefix: {group.batchCodePrefix}. The server creates the final
          code.
        </p>
        <p className="mt-2 text-muted-foreground">
          Inherited from {service.title}: {service.accessType.toLowerCase()}{" "}
          access, {service.courseMode.toLowerCase()} delivery,{" "}
          {service.enrollmentMode.toLowerCase()} enrollment.
        </p>
      </div>

      {!firstCourse && !initial ? (
        <div className="space-y-2">
          <Label htmlFor="source-course">
            Copy curriculum and fixed course details from
          </Label>
          <select
            id="source-course"
            required
            className="h-10 w-full rounded-md border bg-background px-3"
            value={sourceCourseId}
            onChange={(event) => setSourceCourseId(event.target.value)}
          >
            {group.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.intakeKey} · {course.code}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!initial ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="intake-key">Intake key</Label>
            <Input
              id="intake-key"
              required
              disabled={isFree}
              pattern="[A-Z0-9]+(?:-[A-Z0-9]+)*"
              value={intakeKey}
              onChange={(event) =>
                setIntakeKey(event.target.value.toUpperCase())
              }
              placeholder="2026-B2"
            />
          </div>
          <div className="space-y-2">
            <Label>Resulting code</Label>
            <Input
              readOnly
              value={`${group.batchCodePrefix}-${intakeKey || "…"}`}
            />
          </div>
        </div>
      ) : null}

      {service.courseMode === "SEASONAL" ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="course-start">Start date</Label>
            <Input
              id="course-start"
              required
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course-end">Expected end date</Label>
            <Input
              id="course-end"
              required
              type="date"
              value={expectedEndDate}
              onChange={(event) => setExpectedEndDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course-timezone">Timezone</Label>
            <Input
              id="course-timezone"
              required
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course-capacity">Capacity</Label>
            <Input
              id="course-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              placeholder="Unlimited"
            />
          </div>
        </div>
      ) : null}

      {firstCourse && !initial ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="course-summary">Public summary</Label>
            <Input
              id="course-summary"
              required
              minLength={10}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
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
                onChange={(event) =>
                  setLevel(event.target.value as AdminCourse["level"])
                }
              >
                {[
                  "OPEN",
                  "FOUNDATION",
                  "BEGINNER",
                  "INTERMEDIATE",
                  "ADVANCED",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                value={durationValue}
                onChange={(event) => setDurationValue(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration-unit">Unit</Label>
              <select
                id="duration-unit"
                className="h-10 w-full rounded-md border bg-background px-3"
                value={durationUnit}
                onChange={(event) =>
                  setDurationUnit(
                    event.target.value as NonNullable<
                      AdminCourse["durationUnit"]
                    >,
                  )
                }
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
                  onChange={(event) =>
                    (setter as (value: string) => void)(event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={createState.isLoading || updateState.isLoading}
        >
          {initial
            ? "Save setup"
            : firstCourse
              ? "Create first course"
              : "Create intake"}
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
