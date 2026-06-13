import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CTA from "@/components/sections/CTA";
import { projects } from "@/lib/site";
import ProjectGrid from "@/components/sections/ProjectGrid";
import Testimonials from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "Çalışmalar",
  description:
    "Son dönemde teslim ettiğimiz web siteleri, mobil uygulamalar ve panel + API sistemleri.",
  alternates: { canonical: "/calismalar" },
  openGraph: {
    title: "Çalışmalar · CAWELT",
    description:
      "Son dönemde teslim ettiğimiz web siteleri, mobil uygulamalar ve panel + API sistemleri.",
    url: "/calismalar",
  },
};

export default function CalismalarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portföy — seçki"
        title="Yaptığımız"
        serif="işler."
        description="Bu liste sürekli güncelleniyor. Bazı projeler NDA nedeniyle burada listelenmiyor; talep üzerine paylaşılır."
      />

      <ProjectGrid items={projects} />

      <Testimonials />

      <CTA />
    </>
  );
}
