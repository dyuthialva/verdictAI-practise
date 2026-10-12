import { TEST_FORMAT_EXAMPLE } from "@/lib/samples";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  disabled: boolean;
}

export default function TestCaseInput({ value, onChange, onLoadSample, disabled }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor="tests" className="font-semibold">
          2. Test cases (JSON)
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
      <p className="mb-2 text-sm text-slate-600">Required format — a JSON array where every item has both fields:</p>
      <pre className="mb-2 rounded bg-slate-100 p-2 font-mono text-xs">{TEST_FORMAT_EXAMPLE}</pre>
      <textarea
        id="tests"
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
