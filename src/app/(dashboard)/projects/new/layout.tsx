import type { ReactNode } from "react";
import StudentOnlyRoute from "@/components/access/StudentOnlyRoute";

export default function NewProjectLayout({ children }: { children: ReactNode }) {
  return <StudentOnlyRoute>{children}</StudentOnlyRoute>;
}
