"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  disabled: boolean;
}

export default function CodeInput({ value, onChange, onLoadSample, disabled }: Props) {
  const lineCount = Math.max(1, value.split("\n").length);

  return (
    <section className="flex flex-col rounded-xl border border-borderSubtle bg-panel p-4 md:p-5 shadow-sm space-y-3 transition-colors focus-within:border-sky-500/50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[11px] font-mono text-slate-300">
            1
          </span>
          <label htmlFor="python-code" className="text-sm font-semibold text-slate-200">
            Buggy Python Code
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onLoadSample}
            disabled={disabled}
            className="rounded border border-borderSubtle bg-panelElevated px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-panelHover hover:text-white disabled:opacity-50 transition-colors focus-visible:ring-1 focus-visible:ring-sky-500"
          >
            Load sample
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={disabled}
              className="rounded px-2 py-1 text-xs text-slate-500 hover:text-slate-300 disabled:opacity-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Submitted program must define <code className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-sky-300">def solve(input_data):</code> which receives the decoded JSON input and returns a JSON-compatible result.
      </p>

      {/* Editor surface with line counter preview */}
      <div className="relative rounded-lg border border-borderSubtle bg-background overflow-hidden font-mono text-xs md:text-sm">
        <textarea
          id="python-code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`def solve(input_data):\n    # Write or paste your Python code here\n    numbers = input_data["numbers"]\n    return sum(numbers) / len(numbers)`}
          spellCheck={false}
          rows={11}
          className="w-full resize-y bg-transparent p-3.5 font-mono leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-60"
        />
        <div className="flex items-center justify-between border-t border-borderSubtle/60 bg-panel/40 px-3 py-1.5 text-[11px] text-slate-500">
          <span>Python 3.10+</span>
          <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
        </div>
      </div>
    </section>
  );
}
