"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useCreateEnrollmentMutation,
  useGetEligibleStudentsQuery,
} from "../enrollmentsApi";
import { useGetAdminBootcampsQuery } from "@/features/bootcamps/bootcampsApi";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  UserPlus,
  Book,
  User as UserIcon,
  Search,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const enrollmentSchema = z.object({
  userId: z.string().uuid("Please select a student"),
  bootcampId: z.string().uuid("Please select a bootcamp"),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

/**
 * ManualEnrollmentForm Component
 *
 * Requires admins to choose a bootcamp first, then search eligible students
 * by email before confirming a manual enrollment.
 */
export default function ManualEnrollmentForm() {
  const [studentSearch, setStudentSearch] = useState("");
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const deferredStudentSearch = useDeferredValue(studentSearch.trim());

  const [createEnrollment, { isLoading: isSubmitting }] =
    useCreateEnrollmentMutation();
  const { data: bootcamps, isLoading: isLoadingBootcamps } =
    useGetAdminBootcampsQuery();

  const {
    control,
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      userId: "",
      bootcampId: "",
    },
  });

  const selectedBootcampId = useWatch({ control, name: "bootcampId" });
  const selectedUserId = useWatch({ control, name: "userId" });
  const shouldLoadEligibleStudents = Boolean(selectedBootcampId);
  const eligibleStudentsQueryArg = shouldLoadEligibleStudents
    ? {
        bootcampId: selectedBootcampId,
        q: deferredStudentSearch || undefined,
        limit: 5,
      }
    : skipToken;

  const {
    data: eligibleStudents = [],
    isLoading: isLoadingEligibleStudents,
    isFetching: isFetchingEligibleStudents,
  } = useGetEligibleStudentsQuery(eligibleStudentsQueryArg);

  const selectedStudent = useMemo(
    () => eligibleStudents.find((student) => student.id === selectedUserId),
    [eligibleStudents, selectedUserId],
  );

  const onSubmit = async (data: EnrollmentFormValues) => {
    try {
      await createEnrollment(data).unwrap();
      toast.success("Student enrolled successfully!");
      reset();
      setStudentSearch("");
      setIsStudentMenuOpen(false);
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
          ? err.message
          : "Failed to enroll student. They might already be enrolled.";

      toast.error(
        message,
      );
    }
  };

  const isLoadingData = isLoadingBootcamps;
  const isStudentSelectionLocked = !selectedBootcampId || isSubmitting;
  const studentFieldMessage = !selectedBootcampId
    ? "Select a bootcamp first to unlock student search."
    : deferredStudentSearch
      ? "Matching students are filtered by email and excluded if already enrolled."
      : "Showing up to 5 students who are not yet enrolled in this bootcamp.";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm"
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Manual Enrollment</h3>
          <p className="text-sm text-muted-foreground">
            Pick a bootcamp first, then search for an eligible student by email.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bootcampId">Select Bootcamp</Label>
        <div className="relative">
          <Book className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <select
            id="bootcampId"
            className="flex h-11 w-full appearance-none rounded-md border border-border bg-card py-2 pl-10 pr-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoadingData || isSubmitting}
            {...register("bootcampId", {
              onChange: () => {
                resetField("userId");
                setStudentSearch("");
                setIsStudentMenuOpen(false);
              },
            })}
          >
            <option value="">-- Choose a bootcamp --</option>
            {bootcamps?.map((bootcamp) => (
              <option key={bootcamp.id} value={bootcamp.id}>
                {bootcamp.title} {bootcamp.isPublished ? "" : "(Draft)"}
              </option>
            ))}
          </select>
        </div>
        {errors.bootcampId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.bootcampId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="student-search">Choose Student</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          {!selectedBootcampId ? (
            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          ) : (
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          )}
          <input
            id="student-search"
            type="text"
            value={studentSearch}
            onChange={(e) => {
              setStudentSearch(e.target.value);
              setValue("userId", "", { shouldValidate: true });
              setIsStudentMenuOpen(true);
            }}
            onFocus={() => {
              if (selectedBootcampId) {
                setIsStudentMenuOpen(true);
              }
            }}
            placeholder={
              selectedBootcampId
                ? "Type the student's email"
                : "Select a bootcamp to unlock student search"
            }
            disabled={isStudentSelectionLocked}
            autoComplete="off"
            className={cn(
              "flex h-11 w-full rounded-md border bg-card py-2 pl-10 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary",
              isStudentSelectionLocked
                ? "cursor-not-allowed border-border bg-background text-muted-foreground"
                : "border-border",
            )}
          />

          {selectedBootcampId && isStudentMenuOpen && (
            <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-xl">
              {isLoadingEligibleStudents || isFetchingEligibleStudents ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching eligible students...
                </div>
              ) : eligibleStudents.length > 0 ? (
                eligibleStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setValue("userId", student.id, { shouldValidate: true });
                      setStudentSearch(student.email);
                      setIsStudentMenuOpen(false);
                    }}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left transition-colors",
                      selectedUserId === student.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-background",
                    )}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-sm text-muted-foreground">
                  No eligible students matched that email for this bootcamp.
                </div>
              )}
            </div>
          )}
        </div>

        <input type="hidden" {...register("userId")} />

        {selectedStudent && (
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Selected Student
            </p>
            <p className="text-sm font-semibold text-primary">
              {selectedStudent.firstName} {selectedStudent.lastName}
            </p>
            <p className="text-xs text-primary">{selectedStudent.email}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{studentFieldMessage}</p>

        {errors.userId && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.userId.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          isLoadingData ||
          isSubmitting ||
          !selectedBootcampId ||
          !selectedUserId
        }
        className="mt-4 h-11 w-full rounded-xl bg-primary font-bold text-white shadow-lg shadow-blue-100 hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...
          </>
        ) : (
          "Confirm Enrollment"
        )}
      </Button>

      {isLoadingData && (
        <p className="text-center text-xs italic text-muted-foreground">
          Loading platform data...
        </p>
      )}

      {!isLoadingData && bootcamps?.length === 0 && (
        <p className="text-center text-xs italic text-amber-600 dark:text-amber-400">
          Create a bootcamp first before manually enrolling students.
        </p>
      )}
    </form>
  );
}
