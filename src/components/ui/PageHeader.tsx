import SplitWords from "@/components/ui/SplitWords";

export default function PageHeader({
  eyebrow,
  title,
  serif,
  description,
}: {
  eyebrow: string;
  title: string;
  serif?: string;
  description?: string;
}) {
  return (
    <header className="relative mx-auto max-w-[1440px] overflow-hidden px-6 pb-16 pt-32 sm:pt-36 lg:px-10 lg:pb-24 lg:pt-56">
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -left-32 top-32 -z-10 size-[420px] rounded-full bg-champagne/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -right-20 top-20 -z-10 size-[360px] rounded-full bg-champagne/10 blur-[140px]"
        style={{ animationDelay: "-6s" }}
      />
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="headline text-[clamp(2.75rem,11vw,5.5rem)] text-bone md:text-8xl lg:text-[9rem]">
        <SplitWords text={title} />
        {serif ? (
          <>
            {" "}
            <span className="headline-serif text-champagne">
              <SplitWords text={serif} delay={0.15} />
            </span>
          </>
        ) : null}
      </h1>
      {description ? (
        <p className="mt-8 max-w-xl text-bone-muted md:mt-10 lg:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
