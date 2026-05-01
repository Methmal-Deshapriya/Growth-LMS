"use client";

import React from "react";
import { ClassRosterEntry } from "../enrollmentsTypes";
import { format } from "date-fns";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassRosterTableProps {
  entries: ClassRosterEntry[];
}

/**
 * ClassRosterTable Component
 * 
 * Displays a list of students enrolled in a specific bootcamp.
 */
export default function ClassRosterTable({ entries }: ClassRosterTableProps) {
  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Enrolled On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors group">
                {/* 1. Student Identity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{entry.student.name}</span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail className="h-3 w-3" />
                        {entry.student.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Role */}
                <td className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    entry.student.role === "SUPER_ADMIN" ? "bg-purple-50 text-purple-700 border-purple-100" :
                    entry.student.role === "ADMIN" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-gray-50 text-gray-600 border-gray-100"
                  )}>
                    <Shield className="h-3 w-3" />
                    {entry.student.role}
                  </div>
                </td>

                {/* 3. Enrollment Date */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-300" />
                    {format(new Date(entry.enrolledAt), "MMM dd, yyyy")}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
