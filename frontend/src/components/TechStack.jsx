import { Section } from './Section';

export default function TechStack({ stack, blocked }) {
  return (
    <Section title="Tech stack">
      {blocked && (
        <p className="mb-3 text-sm text-amber-700">
          This site is behind bot protection, so its real tech stack is hidden. Below is only what the protection page reveals.
        </p>
      )}
      {stack.length === 0 && <p className="text-sm text-neutral-500">Nothing detected.</p>}
      <div className="flex flex-wrap gap-2">
        {stack.map(({ name, category }) => (
          <span key={name} className="border border-neutral-300 px-2 py-1 text-sm">
            {name} <span className="text-xs text-neutral-400">{category}</span>
          </span>
        ))}
      </div>
    </Section>
  );
}
