export function Section({ title, children }) {
  return (
    <section className="border-t border-neutral-200 py-5">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

export function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className={`break-all text-right font-mono ${valueClass}`}>{value ?? '—'}</span>
    </div>
  );
}
