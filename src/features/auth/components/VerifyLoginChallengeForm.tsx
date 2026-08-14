"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isNormalizedApiError } from "@/lib/api";
import { useVerifyLoginChallengeMutation } from "../authApi";

export default function VerifyLoginChallengeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challenge") ?? "";
  const enrollmentCourseId = searchParams.get("enrollCourse");
  const [code, setCode] = useState("");
  const [verify, { isLoading }] = useVerifyLoginChallengeMutation();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challengeId) {
      toast.error("This login challenge is missing. Please sign in again.");
      return;
    }
    try {
      await verify({ challengeId, code }).unwrap();
      toast.success("Administrator login verified.");
      const intent = enrollmentCourseId
        ? `?enrollCourse=${encodeURIComponent(enrollmentCourseId)}`
        : "";
      router.replace(`/dashboard${intent}`);
    } catch (error: unknown) {
      toast.error(
        isNormalizedApiError(error)
          ? error.message
          : "The login code could not be verified.",
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <ShieldCheck className="size-8 text-primary" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Verify administrator login</h1>
        <p className="text-muted-foreground">
          Enter the six-digit code sent to your administrator email.
        </p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <Label htmlFor="login-code">Login code</Label>
          <Input
            id="login-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]{6}"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            disabled={isLoading}
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading || code.length !== 6}>
          {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Verify and sign in
        </Button>
      </form>
    </div>
  );
}

