"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEnrollmentRequestMutation } from "@/features/enrollments/enrollmentRequestsApi";
import { getApiErrorMessage } from "@/lib/api";

/**
 * A visitor clicking "Enroll" on a PAID course — see the 2026-08-30
 * course-to-program-intake rename plan §8a. The course's currently open
 * intake is resolved server-side; this just captures a contact phone number
 * and submits the request. The ?requestCourse= query param stays in the URL
 * (and so keeps driving `courseId` at render time) until the dialog is
 * dismissed, rather than being stripped in an effect.
 */
export default function EnrollmentRequestIntentHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("requestCourse");
  const [contactPhone, setContactPhone] = useState("");
  const [createRequest, { isLoading }] = useCreateEnrollmentRequestMutation();

  const close = () => {
    setContactPhone("");
    router.replace("/dashboard");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!courseId) return;
    try {
      await createRequest({ courseId, body: { contactPhone: contactPhone.trim() } }).unwrap();
      toast.success("Enrollment request sent — an admin will contact you shortly.");
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "The enrollment request could not be sent."));
    }
  };

  return (
    <Dialog open={Boolean(courseId)} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request enrollment</DialogTitle>
          <DialogDescription>
            Leave your phone number and an admin will reach out to arrange payment and confirm your seat.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="enrollment-request-phone">Phone number</Label>
            <Input
              id="enrollment-request-phone"
              type="tel"
              required
              minLength={6}
              maxLength={30}
              autoFocus
              placeholder="0771234567"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !contactPhone.trim()}>
              {isLoading ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
