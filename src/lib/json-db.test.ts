import { afterEach, describe, expect, it } from "vitest";
import { computeHealth } from "@/lib/health";
import {
  createRecord,
  deleteRecord,
  getById,
  getDb,
  listAll,
  resetDb,
  resetDbForTests,
  SEED,
  updateRecord,
} from "@/lib/json-db";

afterEach(() => {
  resetDbForTests();
});

describe("json-db", () => {
  it("starts from the JSON seed", () => {
    expect(getDb().business.id).toBe(SEED.business.id);
    expect(listAll("tasks").length).toBe(SEED.tasks.length);
    expect(listAll("documents")).toEqual([]);
    expect(getDb().health).toEqual(computeHealth(SEED));
    expect(listAll("users").map((user) => user.email)).toEqual(SEED.users.map((user) => user.email));
  });

  it("creates, reads, updates and deletes a task", () => {
    const created = createRecord("tasks", {
      ...SEED.tasks[0],
      id: "task-crud",
      title: "Created in JSON db",
    });
    expect(getById("tasks", "task-crud")?.title).toBe("Created in JSON db");
    expect(listAll("tasks")[0]).toEqual(created);

    updateRecord("tasks", "task-crud", { status: "completed" });
    expect(getById("tasks", "task-crud")?.status).toBe("completed");

    deleteRecord("tasks", "task-crud");
    expect(getById("tasks", "task-crud")).toBeNull();
  });

  it("creates and deletes a vault document", () => {
    createRecord("documents", {
      id: "doc-crud",
      name: "Policy.pdf",
      category: "policies",
      status: "uploaded",
      uploadedDate: "2026-08-29",
      linkedComplianceId: "posh",
    });
    expect(getById("documents", "doc-crud")?.name).toBe("Policy.pdf");
    expect(getDb().health.readiness).toBeGreaterThan(computeHealth(SEED).readiness);
    deleteRecord("documents", "doc-crud");
    expect(listAll("documents").some((doc) => doc.id === "doc-crud")).toBe(false);
    expect(getDb().health.readiness).toBe(computeHealth(SEED).readiness);
  });

  it("restores the seed on reset", () => {
    deleteRecord("tasks", SEED.tasks[0].id);
    expect(listAll("tasks").length).toBe(SEED.tasks.length - 1);
    resetDb();
    expect(listAll("tasks").length).toBe(SEED.tasks.length);
    expect(getById("tasks", SEED.tasks[0].id)?.id).toBe(SEED.tasks[0].id);
  });
});
