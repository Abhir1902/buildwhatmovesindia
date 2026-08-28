export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-200 px-6 py-12 text-center">
      <p className="text-base font-medium">{title}</p>
      <p className="mt-2 text-sm text-neutral-500">{body}</p>
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <p className="font-mono text-xs tracking-wide text-neutral-500" role="status">
      {label}
    </p>
  );
}

export function ErrorState({ title }: { title: string }) {
  return (
    <p className="text-sm text-red-700" role="alert">
      {title}
    </p>
  );
}
