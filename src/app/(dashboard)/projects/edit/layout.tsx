import type { ReactNode } from "react";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

export default function EditProjectLayout({ children }: { children: ReactNode }) {
  return <StudentOnlyRoute>{children}</StudentOnlyRoute>;
}
