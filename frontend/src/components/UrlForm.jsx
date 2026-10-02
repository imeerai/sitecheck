import { useState } from 'react';

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="example.com"
        autoFocus
        className="min-w-0 flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
      />
      <button disabled={loading} className="bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700 disabled:opacity-50">
        {loading ? 'Checking…' : 'Check'}
      </button>
    </form>
  );
}
