import Image from "next/image";
import { Lock } from "lucide-react";

export default function BrowserMockup({
  src,
  alt,
  url,
  accent,
}: {
  src: string;
  alt: string;
  url: string;
  accent: string;
}) {
  return (
    <div className="relative size-full overflow-hidden">
      {/* Accent glow backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% -10%, ${accent}45, transparent 55%), radial-gradient(90% 70% at 85% 110%, ${accent}28, transparent 70%), #0e0e14`,
        }}
      />
      {/* Soft grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating browser window — peeks off the bottom edge */}
      <div className="absolute inset-x-6 top-8 -bottom-5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-3 sm:inset-x-10 sm:top-10">
        <div className="flex h-full flex-col overflow-hidden rounded-t-2xl border border-bone/15 bg-ink-2 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75)] ring-1 ring-black/40">
          {/* Chrome bar */}
          <div className="flex items-center gap-3 border-b border-bone/10 bg-ink/70 px-4 py-2.5 backdrop-blur">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-1 flex flex-1 items-center gap-1.5 rounded-full bg-bone/5 px-3 py-1 text-[0.7rem] text-mute">
              <Lock size={10} className="shrink-0" />
              <span className="truncate">{url}</span>
            </div>
          </div>
          {/* Screenshot */}
          <div className="relative flex-1 overflow-hidden bg-ink">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
