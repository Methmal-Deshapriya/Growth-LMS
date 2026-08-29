"use client";

import type { ClassroomSession } from "../sessionsTypes";
import SessionItem from "./SessionItem";

interface SessionListProps {
  enrollmentId: string;
  sessions: ClassroomSession[];
  isReadOnly?: boolean;
}

export default function SessionList({
  enrollmentId,
  sessions,
  isReadOnly = false,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          No sessions are available for you yet. New sessions will appear here
          when they are released.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionItem
          key={session.courseSessionId}
          enrollmentId={enrollmentId}
          session={session}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
  );
}
