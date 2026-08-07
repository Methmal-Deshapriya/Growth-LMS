import { CourseForm } from "@/features/catalog/components/CourseForm";
export default function NewCoursePage() { return <div className="mx-auto max-w-5xl space-y-6 pb-20"><div><h1 className="text-3xl font-bold">Create course</h1><p className="text-muted-foreground">The course starts as a draft and can be reviewed before publication.</p></div><CourseForm /></div>; }
