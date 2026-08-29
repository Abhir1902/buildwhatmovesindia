import { describe, expect, it } from "vitest";
import { dictionaries, en, locales, type LocaleCode, type Messages } from "@/i18n/dictionaries";
import { landingPacks, landingTourKeys } from "@/i18n/landing-packs";
import { mergeMessages } from "@/i18n/merge";

function walkStrings(value: unknown, path: string, visit: (path: string, text: string) => void) {
  if (typeof value === "string") {
    visit(path, value);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    walkStrings(child, path ? `${path}.${key}` : key, visit);
  }
}

function landingKeys(landing: Messages["landing"]) {
  return Object.keys(landing).sort();
}

describe("i18n dictionaries", () => {
  it("registers every locale listed in the picker", () => {
    const codes = locales.map((item) => item.code).sort();
    expect(Object.keys(dictionaries).sort()).toEqual(codes);
  });

  it("marks only Urdu as RTL", () => {
    for (const item of locales) {
      expect(item.dir).toBe(item.code === "ur" ? "rtl" : "ltr");
    }
  });

  it("keeps landing keys identical to English for every locale", () => {
    const expected = landingKeys(en.landing);
    for (const item of locales) {
      const landing = dictionaries[item.code].landing;
      expect(landingKeys(landing), item.code).toEqual(expected);
    }
  });

  it("fills every landing tour string in every locale", () => {
    for (const item of locales) {
      const landing = dictionaries[item.code].landing;
      for (const key of landingTourKeys) {
        expect(landing[key].trim().length, `${item.code}.landing.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("translates landing packs off English for Indic copy", () => {
    for (const [code, pack] of Object.entries(landingPacks)) {
      expect(pack.kicker, code).not.toBe(en.landing.kicker);
      expect(pack.headline, code).not.toBe(en.landing.headline);
      expect(pack.next, code).not.toBe(en.landing.next);
    }
  });

  it("deep-merges so a sparse locale still has every English leaf", () => {
    const codes = locales.map((item) => item.code) as LocaleCode[];
    for (const code of codes) {
      const merged = mergeMessages(en, dictionaries[code]);
      const missing: string[] = [];
      walkStrings(en, "", (path, base) => {
        if (path === "fallback") return;
        let cursor: unknown = merged;
        for (const part of path.split(".")) {
          if (!cursor || typeof cursor !== "object") {
            missing.push(path);
            return;
          }
          cursor = (cursor as Record<string, unknown>)[part];
        }
        if (typeof cursor !== "string" || (base.length > 0 && cursor.trim().length === 0)) {
          missing.push(path);
        }
      });
      expect(missing, code).toEqual([]);
    }
  });
});

describe("mergeMessages", () => {
  it("fills nested gaps from the English base", () => {
    const over = { landing: { headline: "शीर्षक" } } as unknown as Messages;
    const merged = mergeMessages(en, over);
    expect(merged.landing.headline).toBe("शीर्षक");
    expect(merged.landing.kicker).toBe(en.landing.kicker);
    expect(merged.nav.overview).toBe(en.nav.overview);
  });
});
