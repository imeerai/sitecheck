import { Section, Row } from './Section';

export default function Health({ report }) {
  const { tls } = report;
  return (
    <>
      <Section title="Server health">
        <Row label="IP" value={report.ip} />
        <Row label="Server" value={report.server} />
        <Row label="Compression" value={report.compression || 'none'} />
        <Row label="Redirects" value={report.redirects} />
        <Row label="SSL" value={tls ? `${tls.protocol}, ${tls.issuer}` : 'No HTTPS'} />
        {tls && <Row label="SSL expires in" value={`${tls.daysLeft} days`} />}
      </Section>

      <Section title="Security headers">
        <div className="grid gap-x-6 sm:grid-cols-2">
          {Object.entries(report.security).map(([name, present]) => (
            <Row key={name} label={name} value={present ? 'present' : 'missing'} valueClass={present ? 'text-green-700' : 'text-neutral-400'} />
          ))}
        </div>
      </Section>
    </>
  );
}
