import { describe, expect, it } from "vitest";
import { can, type Capability } from "@/lib/permissions";

const caps: Capability[] = ["file.submit", "vault.upload", "tasks.move", "demo.reset", "profile.edit"];

describe("permissions", () => {
  it("lets the owner do everything", () => {
    for (const cap of caps) expect(can("owner", cap)).toBe(true);
  });

  it("lets the accountant file, upload and move tasks but not reset or edit the profile", () => {
    expect(can("accountant", "file.submit")).toBe(true);
    expect(can("accountant", "vault.upload")).toBe(true);
    expect(can("accountant", "tasks.move")).toBe(true);
    expect(can("accountant", "demo.reset")).toBe(false);
    expect(can("accountant", "profile.edit")).toBe(false);
  });

  it("keeps the expert read-only except for assigned tasks", () => {
    expect(can("expert", "file.submit")).toBe(false);
    expect(can("expert", "vault.upload")).toBe(false);
    expect(can("expert", "tasks.move")).toBe(true);
    expect(can("expert", "demo.reset")).toBe(false);
    expect(can("expert", "profile.edit")).toBe(false);
  });
});
