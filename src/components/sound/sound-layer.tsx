"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { requirements } from "@/data/requirements";
import { playClick, playDueNotice } from "@/lib/sounds";

const DUE_KEY = "setu-due-chime";

function dueCount() {
  return requirements.filter((item) => item.status === "attention").length;
}

export function SoundLayer() {
  const pathname = usePathname();

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("a, button, [role='button'], [role='option']")) return;
      playClick();
    }

    function maybeDue() {
      if (dueCount() === 0) return;
      if (sessionStorage.getItem(DUE_KEY)) return;
      sessionStorage.setItem(DUE_KEY, "1");
      playDueNotice();
    }

    function onFirstGesture() {
      maybeDue();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerdown", onFirstGesture, { once: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pathname]);

  return null;
}
