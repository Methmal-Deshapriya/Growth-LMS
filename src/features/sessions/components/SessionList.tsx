"use client";

import React from "react";
import { Session } from "../sessionsTypes";
import SessionItem from "./SessionItem";

interface SessionListProps {
  sessions: Session[];
  enrollmentId: string;
}

/**
 * SessionList Component
 * 
 * Displays a list of sessions for a bootcamp.
 */
export default function SessionList({ sessions, enrollmentId }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500">No sessions published yet for this bootcamp.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionItem 
          key={session.id} 
          session={session} 
          enrollmentId={enrollmentId}
        />
      ))}
    </div>
  );
}
