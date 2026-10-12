interface Props {
  value: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  disabled: boolean;
}

export default function CodeInput({ value, onChange, onLoadSample, disabled }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="code" className="font-semibold">
          1. Buggy Python code
        </label>
        <button
          type="button"
          onClick={onLoadSample}
          disabled={disabled}
          className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          Load sample
        </button>
      </div>
      <p className="mb-2 text-sm text-slate-600">
        Enter a program that contains a bug. It must define <code className="font-mono">def solve(input_data):</code>,
        which receives the decoded JSON input and returns a JSON-compatible value.
      </p>
      <textarea
        id="code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        rows={12}
        className="w-full rounded border border-slate-300 bg-slate-50 p-3 font-mono text-sm"
      />
    </section>
  );
}
