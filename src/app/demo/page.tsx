import Link from "next/link";

const routes = [
  ["/overview", "Overview — 86% ready, POSH attention, Ask Setu"],
  ["/compliance", "Compliance list and filters"],
  ["/compliance/posh", "POSH 5-step journey, why, professionals, request"],
  ["/file", "File every government portal inside SETU"],
  ["/compliance/epf", "EPFO filing desk"],
  ["/compliance/esi", "ESIC filing desk"],
  ["/compliance/shops", "Maharashtra Shop Act filing"],
  ["/compliance/mca", "MCA21 filing"],
  ["/compliance/factory", "DISH factory licence"],
  ["/compliance/ptax", "Professional tax filing"],
  ["/discover", "I'm not sure what I'm missing"],
  ["/tasks", "Tasks and status changes"],
  ["/professionals", "Contextual professional matches"],
  ["/documents", "Document vault and mock upload"],
  ["/business", "Aarav Engineering profile"],
  ["/settings", "Language and disclaimer"],
];

export default function DemoMapPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-medium tracking-tight">Agent walkthrough</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Public demo. No authentication. Visit every link below in order.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5">
        {routes.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="underline-offset-4 hover:underline">
              {href}
            </Link>
            <span className="text-neutral-500"> — {label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
