"use client";

import { useState, type MouseEvent } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageSquare,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCompleteClassroomSessionMutation,
  useUncompleteClassroomSessionMutation,
} from "../sessionsApi";
import type { ClassroomSession } from "../sessionsTypes";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api";

interface SessionItemProps {
  enrollmentId: string;
  session: ClassroomSession;
  isReadOnly?: boolean;
}

export default function SessionItem({
  enrollmentId,
  session,
  isReadOnly = false,
}: SessionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [complete, { isLoading: isCompleting }] =
    useCompleteClassroomSessionMutation();
  const [uncomplete, { isLoading: isUncompleting }] =
    useUncompleteClassroomSessionMutation();
  const isUpdating = isCompleting || isUncompleting;

  const handleToggleComplete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isReadOnly) return;
    const input = {
      enrollmentId,
      courseSessionId: session.courseSessionId,
    };

    try {
      if (session.completed) {
        await uncomplete(input).unwrap();
        toast.success("Marked as incomplete");
      } else {
        await complete(input).unwrap();
        toast.success("Session completed!");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update progress."));
    }
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-all duration-200",
        isExpanded
          ? "border-primary/30 shadow-sm"
          : "border-border shadow-xs hover:border-primary/20",
      )}
    >
      <div className="flex items-center gap-4 p-4">
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={isUpdating || isReadOnly}
          aria-label={
            isReadOnly
              ? `Session completion is locked: ${session.completed ? "completed" : "incomplete"}`
              : session.completed
                ? "Mark session incomplete"
                : "Mark session complete"
          }
          title={isReadOnly ? "Completed enrollment history is read-only" : undefined}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {session.completed ? (
            <CheckCircle2 className="h-6 w-6 fill-green-50 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground group-hover:text-blue-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="min-w-0 space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
              Session {(session.orderIndex ?? 0) + 1}
            </p>
            <h3
              className={cn(
                "truncate font-bold transition-colors",
                session.completed
                  ? "text-muted-foreground"
                  : "text-foreground group-hover:text-primary",
              )}
            >
              {session.title}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {session.durationMinutes ? (
              <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
                <Clock className="h-3.5 w-3.5" />
                {session.durationMinutes}m
              </span>
            ) : null}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>
      </div>

      {isExpanded ? (
        <div className="animate-in space-y-4 px-4 pb-5 pt-0 duration-200 fade-in slide-in-from-top-2 sm:px-14">
          {session.description ? (
            <p className="text-sm leading-relaxed text-foreground">
              {session.description}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            {session.recordingUrl ? (
              <ResourceLink href={session.recordingUrl} label="Watch Recording" icon={Video} tone="red" />
            ) : null}
            {session.materialUrl ? (
              <ResourceLink href={session.materialUrl} label="Learning Materials" icon={FileText} tone="blue" />
            ) : null}
            {session.quizUrl ? (
              <ResourceLink href={session.quizUrl} label="Take Session Quiz" icon={HelpCircle} tone="amber" />
            ) : null}
            {session.feedbackUrl ? (
              <ResourceLink href={session.feedbackUrl} label="Submit Feedback" icon={MessageSquare} tone="purple" />
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

const tones = {
  red: "border-red-100 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400",
  blue: "border-primary/20 bg-primary/10 text-primary hover:bg-blue-100",
  amber: "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-400",
  purple: "border-purple-100 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-400",
} as const;

function ResourceLink({
  href,
  label,
  icon: Icon,
  tone,
}: {
  href: string;
  label: string;
  icon: typeof Video;
  tone: keyof typeof tones;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
        tones[tone],
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-bold">{label}</span>
      <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-50" />
    </a>
  );
}
