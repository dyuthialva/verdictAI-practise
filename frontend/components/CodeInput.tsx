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
    <section className="appear appear-soft stagger-4 flex flex-col rounded-xl border border-white/10 bg-black/80 p-4 md:p-5 shadow-sm space-y-3 transition-all duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[11px] font-mono text-slate-300">
            1
          </span>
          <label htmlFor="python-code" className="text-sm font-semibold text-slate-200">
            Buggy Python Code
          </label>
        </div>

        <div className="flex items-center space-x-2">
          {/* Load Sample Button (Ghost/Secondary with diagonal shine sweep) */}
          <button
            type="button"
            onClick={onLoadSample}
            disabled={disabled}
            className="btn-secondary btn-shine text-xs px-3 h-[36px] flex items-center justify-center disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Load sample
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={disabled}
              className="rounded px-2.5 py-1 text-xs text-slate-500 transition-all duration-200 hover:bg-white/10 hover:text-slate-300 active:bg-white/5 active:text-slate-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Submitted program must define <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sky-300">def solve(input_data):</code> which receives the decoded JSON input and returns a JSON-compatible result.
      </p>

      {/* Editor surface with pure dark base, soft glow, and brighter border on focus (B5) */}
      <div className="box-glow relative rounded-lg overflow-hidden font-mono text-xs md:text-sm">
        <textarea
          id="python-code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`def solve(input_data):\n    # Write or paste your Python code here\n    numbers = input_data["numbers"]\n    return sum(numbers) / len(numbers)`}
          spellCheck={false}
          rows={11}
          className="w-full resize-y bg-transparent p-3.5 font-mono leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-60 transition-colors duration-200"
        />
        <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-slate-400">
          <span>Python 3.10+</span>
          <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
        </div>
      </div>
    </section>
  );
}
