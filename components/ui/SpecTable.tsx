export type Spec = {
  label: string;
  value: string;
};

export function SpecTable({ specs, title }: { specs: Spec[]; title?: string }) {
  return (
    <div>
      {title && <p className="eyebrow mb-4">{title}</p>}
      <dl className="w-full">
        {specs.map((s, i) => (
          <div key={i} className="spec-row">
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
