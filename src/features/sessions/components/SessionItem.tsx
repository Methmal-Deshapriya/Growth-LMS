"use client";

import React, { useState } from "react";
import { Session } from "../sessionsTypes";
import { 
  useMarkSessionCompleteMutation, 
  useUnmarkSessionCompleteMutation
} from "../sessionsApi";
import { 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  Circle, 
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SessionItemProps {
  session: Session;
}

/**
 * SessionItem Component
 * 
 * Displays a single session with links and completion toggle.
 */
export default function SessionItem({ session }: SessionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [markComplete, { isLoading: isMarking }] = useMarkSessionCompleteMutation();
  const [unmarkComplete, { isLoading: isUnmarking }] = useUnmarkSessionCompleteMutation();
  const [completed, setCompleted] = useState(Boolean(session.isCompleted));

  React.useEffect(() => {
    setCompleted(Boolean(session.isCompleted));
  }, [session.isCompleted]);

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (completed) {
        await unmarkComplete(session.id).unwrap();
        setCompleted(false);
        toast.success("Marked as incomplete");
      } else {
        await markComplete(session.id).unwrap();
        setCompleted(true);
        toast.success("Session completed!");
      }
    } catch {
      toast.error("Failed to update progress");
    }
  };

  return (
    <div 
      className={cn(
        "group bg-card rounded-xl border transition-all duration-200 overflow-hidden",
        isExpanded ? "border-primary/30 shadow-sm" : "border-border hover:border-border shadow-xs"
      )}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={handleToggleComplete}
            disabled={isMarking || isUnmarking}
            className="focus:outline-hidden"
          >
            {completed ? (
              <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-50" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground group-hover:text-blue-400" />
            )}
          </button>
          
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
              Session {session.orderIndex + 1}
            </p>
            <h3 className={cn(
              "font-bold transition-colors",
              completed ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
            )}>
              {session.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session.durationMinutes && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {session.durationMinutes}m
            </div>
          )}
          {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-14 pb-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {session.description && (
            <p className="text-sm text-foreground leading-relaxed">
              {session.description}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {session.recordingUrl && (
              <a 
                href={session.recordingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 transition-colors border border-red-100 dark:border-red-900/40"
              >
                <Video className="h-5 w-5" />
                <span className="text-sm font-bold">Watch Recording</span>
                <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-50" />
              </a>
            )}
            
            {session.materialUrl && (
              <a 
                href={session.materialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary hover:bg-blue-100 transition-colors border border-primary/20"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-bold">Learning Materials</span>
                <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-50" />
              </a>
            )}

            {session.quizUrl && (
              <a 
                href={session.quizUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors border border-amber-100 dark:border-amber-900/40"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-sm font-bold">Take Session Quiz</span>
                <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-50" />
              </a>
            )}

            {session.feedbackUrl && (
              <a 
                href={session.feedbackUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 hover:bg-purple-100 transition-colors border border-purple-100 dark:border-purple-900/40"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-bold">Submit Feedback</span>
                <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-50" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
