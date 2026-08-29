"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OpenAIMark, SetuLogo } from "@/components/brand/setu-logo";
import { LanguageSelect } from "@/components/layout/language-select";
import { useI18n } from "@/i18n/provider";

const SCENES = 6;
const BGS = ["landing-hero-bg", "landing-v2", "landing-v3", "landing-v4", "landing-v5", "landing-v6"] as const;

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

/** Adjacent scenes only; opacities sum to 1 so images never stack three-deep. */
function bgOpacity(pos: number, index: number) {
  const d = Math.abs(pos - index);
  if (d >= 1) return 0;
  return 1 - d;
}

export function LandingPage() {
  const { t, locale } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);

  const read = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const h = el.clientHeight || 1;
    setPos(el.scrollTop / h);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [read]);

  const scene = Math.min(SCENES - 1, Math.max(0, Math.round(pos)));
  const textOpacity = clamp(1 - Math.abs(pos - scene) * 2.4);

  function go(dir: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const current = Math.round(el.scrollTop / h);
    const next = Math.min(SCENES - 1, Math.max(0, current + dir));
    const top = next * h;
    el.style.scrollSnapType = "none";
    el.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(() => {
      el.scrollTop = top;
      el.style.scrollSnapType = "";
      read();
    }, 450);
  }

  const scenes = [
    { kicker: t.landing.kicker, title: t.landing.headline, body: t.landing.sub, end: false, href: undefined },
    { kicker: "02", title: t.landing.s1Title, body: t.landing.s1Body, end: true, href: undefined },
    { kicker: "03", title: t.landing.s2Title, body: t.landing.s2Body, end: false, href: undefined },
    { kicker: "04", title: t.landing.s3Title, body: t.landing.s3Body, end: true, href: undefined },
    { kicker: "05", title: t.landing.s4Title, body: t.landing.s4Body, end: false, href: undefined },
    { kicker: "06", title: t.landing.s5Title, body: t.landing.s5Body, end: true, href: "/overview" },
  ];
  const current = scenes[scene];

  return (
    <main className="landing-root relative h-dvh text-[#f3e6c8]">
      {BGS.map((cls, i) => (
        <span
          key={cls}
          className={`${cls} pointer-events-none fixed inset-0`}
          style={{ opacity: bgOpacity(pos, i), zIndex: i }}
          aria-hidden
        />
      ))}
      <span className="landing-grain pointer-events-none fixed inset-0 z-10" aria-hidden />
      <span className="pointer-events-none fixed inset-0 z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/30" aria-hidden />

      <header className="pointer-events-none fixed top-0 z-20 w-full">
        <nav className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-10" aria-label="Landing">
          <SetuLogo className="text-[#f3e6c8]" />
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <LanguageSelect tone="dark" className="w-36 sm:w-48" />
            <Link
              href="/overview"
              className="flex h-10 shrink-0 items-center border border-[#f3e6c8]/40 px-3 text-xs whitespace-nowrap text-[#f3e6c8] hover:border-[#f3e6c8]"
            >
              {t.landing.cta}
            </Link>
          </div>
        </nav>
      </header>

      <div
        ref={scrollerRef}
        className="landing-scroller relative z-[1] h-dvh"
        tabIndex={0}
        aria-label="SETU tour"
      >
        {scenes.map((item, i) => (
          <section key={item.title} className="landing-snap h-dvh shrink-0" aria-hidden={i !== scene} />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-[15]">
        <SceneCopy
          key={scene}
          opacity={textOpacity}
          end={current.end}
          latinKicker={locale === "en"}
          kicker={current.kicker}
          title={current.title}
          body={current.body}
          as={scene === 0 ? "h1" : "h2"}
          href={current.href}
        />
      </div>

      {scene < SCENES - 1 ? (
        <button
          type="button"
          className="fixed bottom-16 left-1/2 z-30 flex h-12 w-12 -translate-x-1/2 items-center justify-center border border-[#f3e6c8]/40 text-[#f3e6c8] hover:border-[#f3e6c8]"
          aria-label={t.landing.next}
          onClick={() => go(1)}
        >
          <span aria-hidden className="text-lg leading-none">
            ↓
          </span>
        </button>
      ) : null}

      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 py-5 text-[11px] tracking-wide text-[#f3e6c8]/40 sm:px-10">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            {t.footer.built}
            <OpenAIMark className="h-4 w-4 shrink-0 brightness-0 invert opacity-60" />
            OpenAI
          </span>
          <span dir="ltr">
            {scene + 1} / {SCENES}
          </span>
          <span>#BuildWhatMovesIndia</span>
        </p>
      </footer>
    </main>
  );
}

function SceneCopy({
  opacity,
  end,
  latinKicker,
  kicker,
  title,
  body,
  as,
  href,
}: {
  opacity: number;
  end: boolean;
  latinKicker: boolean;
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
        end
          ? "absolute inset-x-5 bottom-28 ms-auto max-w-md text-end sm:inset-x-10"
          : "absolute inset-x-5 bottom-28 max-w-lg text-start sm:inset-x-10"
      }
      style={{
        opacity,
        transform: `translate3d(0, ${(1 - opacity) * 16}px, 0)`,
        pointerEvents: opacity > 0.4 ? "auto" : "none",
      }}
    >
      <p
        className={
          latinKicker
            ? "text-[11px] tracking-[0.28em] text-[#f3e6c8]/75 uppercase"
            : "text-[11px] tracking-wide text-[#f3e6c8]/75"
        }
      >
        {kicker}
      </p>
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
