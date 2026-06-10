const items = [
  "Web siteleri",
  "Mobil uygulamalar",
  "Yönetim panelleri",
  "API tasarımı",
  "Tasarım sistemleri",
  "3D & Motion",
  "E-ticaret",
  "Saas ürünleri",
  "Native iOS / Android",
];

export default function Marquee() {
  const repeated = [...items, ...items];
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-line/60 bg-ink-2 py-7"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap will-change-transform sm:gap-12">
        {repeated.map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-8 text-xl text-bone-muted sm:gap-12 sm:text-2xl md:text-3xl"
          >
            <span className="font-display italic">{it}</span>
            <span className="size-2 rounded-full bg-ember" />
          </div>
        ))}
      </div>
    </section>
  );
}
