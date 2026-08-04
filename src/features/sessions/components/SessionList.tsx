"use client";

import React from "react";
import { Session } from "../sessionsTypes";
import SessionItem from "./SessionItem";

interface SessionListProps {
  sessions: Session[];
}

/**
 * SessionList Component
 * 
 * Displays the published sessions for a course.
 */
export default function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">No sessions are published for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionItem 
          key={session.id} 
          session={session}
        />
      ))}
    </div>
  );
}
