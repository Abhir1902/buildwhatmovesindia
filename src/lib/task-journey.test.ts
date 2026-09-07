import { describe, expect, it } from "vitest";
import { focusStepIndex, pendingForTask, stepsForRequirement, stepsForTask } from "@/lib/task-journey";
import type { ComplianceRequirement, ComplianceStep, Professional, Task } from "@/domain/types";

const gstSteps: ComplianceStep[] = [
  {
    id: "gst-1",
    number: "01",
    title: "Confirm registration",
    summary: "GSTIN on file.",
    whyItMatters: "Buyers ask for it.",
    action: "Keep the certificate.",
    documents: ["GST certificate"],
    status: "complete",
  },
  {
    id: "gst-2",
    number: "02",
    title: "Prepare upcoming return",
    summary: "Reconcile invoices.",
    whyItMatters: "Mismatches attract notices.",
    action: "Review the pack.",
    documents: ["Invoice register", "GSTR-3B draft"],
    status: "current",
  },
  {
    id: "gst-3",
    number: "03",
    title: "File and archive",
    summary: "File on GSTN.",
    whyItMatters: "Proof of filing.",
    action: "Submit.",
    documents: ["Filing acknowledgement"],
    status: "upcoming",
  },
];

const gstTask: Task = {
  id: "task-gst",
  title: "Review September GST pack",
  reason: "Return window",
  dueDate: "2026-09-16",
  owner: "Accounts",
  status: "todo",
  complianceId: "gst",
  requiredDocuments: ["Invoice register", "GSTR-3B draft"],
  nextAction: "Open GST journey",
};

describe("task journey", () => {
  it("focuses the step whose documents match the task", () => {
    expect(focusStepIndex(gstTask, gstSteps)).toBe(1);
  });

  it("ticks every step when the task is complete", () => {
    const overlay = stepsForTask({ ...gstTask, status: "completed" }, gstSteps);
    expect(overlay.every((step) => step.status === "complete")).toBe(true);
  });

  it("prefers a live step when several steps share the same documents", () => {
    const shops: ComplianceStep[] = [
      { ...gstSteps[0], id: "shops-1", title: "Confirm", documents: ["Establishment certificate"], status: "complete" },
      {
        ...gstSteps[1],
        id: "shops-3",
        title: "Review fee",
        documents: ["Establishment certificate", "Address proof"],
        status: "current",
      },
    ];
    const task: Task = {
      ...gstTask,
      id: "task-shops",
      complianceId: "shops",
      requiredDocuments: ["Establishment certificate"],
    };
    expect(focusStepIndex(task, shops)).toBe(1);
  });

  it("names who is holding a waiting task and which stage is stuck", () => {
    const priya: Professional = {
      id: "priya-shah",
      name: "Priya Shah",
      type: "posh_specialist",
      specialty: "POSH & Employment Law",
      city: "Mumbai",
      years: 8,
      verified: true,
      canHelp: [],
      languages: [],
      forRequirementIds: ["posh"],
    };
    const poshSteps: ComplianceStep[] = [
      { ...gstSteps[0], id: "posh-1", title: "Understand applicability", documents: ["Employee roster"], status: "complete" },
      {
        ...gstSteps[1],
        id: "posh-2",
        title: "Set up Internal Committee",
        documents: ["IC nomination letters"],
        status: "complete",
      },
    ];
    const task: Task = {
      id: "task-ic-letters",
      title: "File IC nomination letters",
      reason: "Letters should sit in the vault.",
      dueDate: "2026-09-05",
      owner: "HR",
      status: "waiting_professional",
      complianceId: "posh",
      requiredDocuments: ["IC nomination letters"],
      nextAction: "Wait for Priya Shah",
    };
    const pending = pendingForTask(
      task,
      poshSteps,
      [
        {
          id: "req-ic",
          professionalId: "priya-shah",
          requirementId: "posh",
          status: "waiting",
          stage: "External member consent",
          detail: "Priya still has the unsigned consent.",
        },
      ],
      [priya],
    );
    expect(pending?.who).toBe("Priya Shah");
    expect(pending?.stage).toBe("External member consent");
    expect(pending?.city).toBe("Mumbai");
    expect(stepsForTask(task, poshSteps).map((step) => step.status)).toEqual(["complete", "current"]);
  });
});

describe("register journey", () => {
  const base: ComplianceRequirement = {
    id: "healthy-1",
    slug: "healthy-1",
    title: "Director KYC",
    category: "On track",
    description: "Done.",
    status: "healthy",
    priority: "low",
    jurisdiction: "India",
    dueDate: "2026-12-15",
    progress: 100,
    nextAction: "No action needed",
    href: "/compliance",
    confidence: "medium",
    applicability: "",
    sources: [],
    requiredDocuments: [],
    professionalTypes: ["cs"],
    scaleRelevance: ["small"],
    steps: [],
  };

  it("ticks every step when the obligation is 100% complete", () => {
    const overlay = stepsForRequirement(base);
    expect(overlay.length).toBe(3);
    expect(overlay.every((step) => step.status === "complete")).toBe(true);
  });

  it("keeps seed steps for an in-progress obligation", () => {
    const overlay = stepsForRequirement({
      ...base,
      id: "gst",
      title: "GST filing",
      status: "upcoming",
      progress: 72,
      steps: gstSteps,
    });
    expect(overlay.map((step) => step.status)).toEqual(["complete", "current", "upcoming"]);
  });
});
