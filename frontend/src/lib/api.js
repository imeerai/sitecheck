export async function analyze(url) {
  const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
