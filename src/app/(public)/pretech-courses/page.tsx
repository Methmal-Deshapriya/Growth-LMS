import { ServiceLanding } from "@/components/marketing/public-service/ServiceLanding";
import { getPublicServiceCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "PreTech Courses | Foundry Academy" };
export default async function PretechPage() {
  const catalog = await getPublicServiceCatalog("pretech-courses");
  return <ServiceLanding service="pretech-courses" categories={catalog?.categories ?? []} />;
}
