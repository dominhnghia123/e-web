import AppContent from "@/components/appContent";

export default function ViewDetailProduct({params}: {params: {slug: string}}) {
  const brand = params.slug[0];
  return <AppContent brand={brand} />;
}
