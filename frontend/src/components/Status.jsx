const STATES = {
  up: { label: 'Up', dot: 'bg-green-600' },
  warn: { label: 'Warning', dot: 'bg-amber-500' },
  down: { label: 'Down', dot: 'bg-red-600' },
};

export default function Status({ report }) {
  const { label, dot } = STATES[report.state];
  return (
    <div className="pb-4">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span className="font-medium">{label}</span>
        {report.status && <span className="font-mono text-sm text-neutral-500">HTTP {report.status}</span>}
      </div>
      {report.error && <p className="mt-2 text-sm text-red-600">{report.error}</p>}
      {report.notes?.map((note) => <p key={note} className="mt-1 text-sm text-amber-700">• {note}</p>)}
    </div>
  );
}
