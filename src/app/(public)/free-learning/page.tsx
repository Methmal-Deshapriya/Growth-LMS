import { ServiceLanding } from "@/components/marketing/public-service/ServiceLanding";
import { getPublicServiceCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Free Learning | Foundry Academy" };
export default async function FreeLearningPage() {
  const catalog = await getPublicServiceCatalog("free-learning");
  return <ServiceLanding service="free-learning" categories={catalog?.categories ?? []} />;
}
