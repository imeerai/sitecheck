import { Section, Row } from './Section';
import { ms } from '../lib/format';

export default function Benchmark({ report }) {
  const { bench, timing } = report;
  const stats = [['Avg first byte', bench.ttfbAvg], ['Fastest', bench.ttfbMin], ['Slowest', bench.ttfbMax]];
  const steps = [['DNS', timing.dns], ['TCP', timing.tcp], ['TLS', timing.tls], ['First byte', timing.ttfb], ['Total', timing.total]];

  return (
    <>
      <Section title="Benchmark">
        <div className="grid grid-cols-3 gap-4 pb-3">
          {stats.map(([label, value]) => (
            <div key={label}>
              <div className="font-mono text-lg">{ms(value)}</div>
              <div className="text-xs text-neutral-500">{label}</div>
            </div>
          ))}
        </div>
        <Row label={`Avg total load (${bench.runs} runs)`} value={ms(bench.totalAvg)} />
        <Row label="Page size" value={`${report.sizeKb} KB`} />
      </Section>

      <Section title="Timing breakdown">
        {steps.map(([label, value]) => (
          <div key={label} className="flex items-center gap-3 py-1 text-sm">
            <span className="w-20 text-neutral-500">{label}</span>
            <div className="h-1.5 flex-1 bg-neutral-100">
              <div className="h-full bg-neutral-900" style={{ width: `${Math.min(100, ((value || 0) / timing.total) * 100)}%` }} />
            </div>
            <span className="w-20 text-right font-mono">{ms(value)}</span>
          </div>
        ))}
      </Section>
    </>
  );
}
