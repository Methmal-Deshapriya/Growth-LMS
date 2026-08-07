import SessionLibraryManager from "@/features/sessions/components/admin/SessionLibraryManager";

export default function AdminSessionLibraryPage() {
  return <div className="space-y-6 pb-20"><div><h1 className="text-3xl font-bold">Session Library</h1><p className="mt-1 text-muted-foreground">Create teaching resources once, then attach them to one or many course curricula.</p></div><SessionLibraryManager /></div>;
}
