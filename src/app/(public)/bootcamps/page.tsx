import { ServiceLanding } from "@/components/marketing/public-service/ServiceLanding";
import { getPublicServiceCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bootcamps | Foundry Academy" };

export default async function BootcampsPage() {
  const catalog = await getPublicServiceCatalog("bootcamps");
  return <ServiceLanding service="bootcamps" categories={catalog?.categories ?? []} />;
}
