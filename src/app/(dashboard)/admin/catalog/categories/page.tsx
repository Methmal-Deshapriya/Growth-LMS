import { CatalogNavigation } from "@/features/catalog/components/CatalogNavigation";
import { CategoryManager } from "@/features/catalog/components/CategoryManager";

export default function AdminCategoriesPage() {
  return <div className="space-y-6 pb-20"><div><h1 className="text-3xl font-bold">Catalog categories</h1><p className="mt-1 text-muted-foreground">Organize the three learning services into public course categories.</p></div><CatalogNavigation /><CategoryManager /></div>;
}
