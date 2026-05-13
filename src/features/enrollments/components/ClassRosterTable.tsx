"use client";

import React, { useState } from "react";
import { ClassRosterEntry, PaymentStatus, EnrollmentStatus } from "../enrollmentsTypes";
import { useUpdateEnrollmentMutation } from "../enrollmentsApi";
import { useIssueCertificateMutation } from "@/features/certificates/certificatesApi";
import { format } from "date-fns";
import { User, Mail, Calendar, Shield, Edit2, Check, X, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClassRosterTableProps {
  entries: ClassRosterEntry[];
}

export default function ClassRosterTable({ entries }: ClassRosterTableProps) {
  const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation();
  const [issueCertificate, { isLoading: isIssuing }] = useIssueCertificateMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    status: EnrollmentStatus;
    paymentStatus: PaymentStatus;
    studentCode: string;
  }>({
    status: "ACTIVE",
    paymentStatus: "PENDING",
    studentCode: "",
  });

  const handleEdit = (entry: ClassRosterEntry) => {
    setEditingId(entry.id);
    setEditForm({
      status: entry.status,
      paymentStatus: entry.paymentStatus,
      studentCode: entry.studentCode || "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      await updateEnrollment({ id, data: editForm }).unwrap();
      toast.success("Enrollment updated successfully");
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update enrollment");
    }
  };

  const handleIssueCertificate = async (enrollmentId: string) => {
    if (!window.confirm("Are you sure you want to issue a certificate for this student?")) return;
    try {
      await issueCertificate({
        enrollmentId,
        data: { description: "Successfully completed the bootcamp." },
      }).unwrap();
      toast.success("Certificate issued successfully!");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to issue certificate");
    }
  };

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case "COMPLETED": return "bg-green-50 text-green-700 border-green-100";
      case "CANCELLED": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    switch (status) {
      case "COMPLETED": return "bg-green-50 text-green-700 border-green-100";
      case "PARTIAL": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-orange-50 text-orange-700 border-orange-100";
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Enrollment Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Payment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student Code</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{entry.user?.name}</span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail className="h-3 w-3" />
                        {entry.user?.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {editingId === entry.id ? (
                    <select
                      className="border-gray-200 rounded-md text-sm p-1"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as EnrollmentStatus })}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  ) : (
                    <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getStatusColor(entry.status))}>
                      {entry.status}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === entry.id ? (
                    <select
                      className="border-gray-200 rounded-md text-sm p-1"
                      value={editForm.paymentStatus}
                      onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value as PaymentStatus })}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PARTIAL">PARTIAL</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  ) : (
                    <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", getPaymentColor(entry.paymentStatus))}>
                      {entry.paymentStatus}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {editingId === entry.id ? (
                    <Input
                      className="h-8 text-sm"
                      value={editForm.studentCode}
                      onChange={(e) => setEditForm({ ...editForm, studentCode: e.target.value })}
                      placeholder="Code"
                    />
                  ) : (
                    <span className="text-sm font-mono text-gray-600">{entry.studentCode || "-"}</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === entry.id ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleSave(entry.id)} disabled={isUpdating}>
                          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-600" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} disabled={isUpdating}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {entry.status === "COMPLETED" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Issue Certificate"
                            onClick={() => handleIssueCertificate(entry.id)}
                            disabled={isIssuing}
                          >
                            <Award className="h-4 w-4 text-purple-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                      </>
                    )}
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
