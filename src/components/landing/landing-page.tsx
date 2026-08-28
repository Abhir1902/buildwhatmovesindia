"use client";

import { useEffect, useRef, useState } from "react";
import { OpenAIMark, SetuLogo } from "@/components/brand/setu-logo";
import { LanguageSelect } from "@/components/layout/language-select";
import { useI18n } from "@/i18n/provider";

const SCENES = 6;
const BGS = ["landing-hero-bg", "landing-v2", "landing-v3", "landing-v4", "landing-v5", "landing-v6"] as const;

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function bgWeight(progress: number, index: number) {
  const x = progress * SCENES;
  const d = Math.abs(x - (index + 0.5));
  return clamp(1.15 - d);
}

export function LandingPage() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    function measure() {
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const rect = el.getBoundingClientRect();
      setProgress(clamp(-rect.top / Math.max(total, 1)));
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active = Math.min(SCENES - 1, Math.max(0, Math.floor(progress * SCENES)));
  const scenes = [
    { kicker: t.landing.kicker, title: t.landing.headline, body: t.landing.sub, side: "left" as const, href: undefined },
    { kicker: "02", title: t.landing.s1Title, body: t.landing.s1Body, side: "right" as const, href: undefined },
    { kicker: "03", title: t.landing.s2Title, body: t.landing.s2Body, side: "left" as const, href: undefined },
    { kicker: "04", title: t.landing.s3Title, body: t.landing.s3Body, side: "right" as const, href: undefined },
    { kicker: "05", title: t.landing.s4Title, body: t.landing.s4Body, side: "left" as const, href: undefined },
    { kicker: "06", title: t.landing.s5Title, body: t.landing.s5Body, side: "right" as const, href: "/overview" },
  ];

  return (
    <main className="landing-root text-[#f3e6c8]">
      <header className="fixed top-0 z-20 w-full">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-10" aria-label="Landing">
          <SetuLogo className="text-[#f3e6c8]" />
          <LanguageSelect tone="dark" className="w-44 sm:w-52" />
        </nav>
      </header>

      <article ref={trackRef} className="relative h-[540vh]">
        <div className="sticky top-0 h-dvh overflow-hidden">
          {BGS.map((cls, i) => (
            <span key={cls} className={`${cls} absolute inset-0`} style={{ opacity: bgWeight(progress, i) }} aria-hidden />
          ))}
          <span className="landing-grain pointer-events-none absolute inset-0" aria-hidden />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" aria-hidden />

          <div className="relative z-[1] mx-auto h-full max-w-6xl px-5 sm:px-10">
            {scenes.map((scene, i) => (
              <SceneCopy
                key={scene.title}
                show={i === active}
                side={scene.side}
                kicker={scene.kicker}
                title={scene.title}
                body={scene.body}
                as={i === 0 ? "h1" : "h2"}
                href={scene.href}
              />
            ))}
          </div>
        </div>
      </article>

      <footer className="relative px-5 py-6 text-[11px] tracking-wide text-[#f3e6c8]/40 sm:px-10">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            {t.footer.built}
            <OpenAIMark className="h-4 w-4 shrink-0 brightness-0 invert opacity-60" />
            OpenAI
          </span>
          <span>#BuildWhatMovesIndia</span>
        </p>
      </footer>
    </main>
  );
}

function SceneCopy({
  show,
  side,
  kicker,
  title,
  body,
  as,
  href,
}: {
  show: boolean;
  side: "left" | "right";
  kicker: string;
  title: string;
  body: string;
  as: "h1" | "h2";
  href?: string;
}) {
  const Heading = as;
  return (
    <header
      className={
        side === "right"
          ? "absolute inset-x-5 bottom-20 max-w-md text-right sm:inset-x-10 sm:bottom-28 sm:left-auto"
          : "absolute inset-x-5 bottom-20 max-w-lg sm:inset-x-10 sm:bottom-28"
      }
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translate3d(0,0,0)" : "translate3d(0,18px,0)",
        transition: "opacity 420ms ease, transform 420ms ease",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <p className="text-[11px] tracking-[0.28em] text-[#f3e6c8]/75 uppercase">{kicker}</p>
      <Heading className="mt-5 text-4xl leading-[0.95] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {title}
      </Heading>
      <p className="mt-6 text-base leading-relaxed text-[#f3e6c8]/70 sm:text-lg">{body}</p>
      {href ? (
        <p className="mt-8 text-sm text-[#f3e6c8]/45">
          <a href={href} className="underline decoration-[#f3e6c8]/30 underline-offset-4">
            {href}
          </a>
        </p>
      ) : null}
    </header>
  );
}
