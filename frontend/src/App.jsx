import { useState } from 'react';
import { analyze } from './lib/api';
import UrlForm from './components/UrlForm';
import Status from './components/Status';
import Benchmark from './components/Benchmark';
import TechStack from './components/TechStack';
import Health from './components/Health';

export default function App() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function check(url) {
    setLoading(true);
    setError('');
    setReport(null);
    try {
      setReport(await analyze(url));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-14">
      <h1 className="text-xl font-semibold">SiteCheck</h1>
      <p className="mt-1 text-sm text-neutral-500">Speed, tech stack and server health of any website.</p>

      <UrlForm onSubmit={check} loading={loading} />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {report && (
        <div className="mt-8">
          <Status report={report} />
          {report.bench && (
            <>
              <Benchmark report={report} />
              <TechStack stack={report.stack} blocked={report.blocked} />
              <Health report={report} />
            </>
          )}
        </div>
      )}
    </main>
  );
}
