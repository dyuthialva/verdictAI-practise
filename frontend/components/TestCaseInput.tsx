"use client";

import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  disabled: boolean;
}

export default function TestCaseInput({ value, onChange, onLoadSample, disabled }: Props) {
  const [formatError, setFormatError] = useState<string | null>(null);

  function handleFormatJson() {
    setFormatError(null);
    if (!value.trim()) return;
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setFormatError("Cannot format: invalid JSON syntax");
      setTimeout(() => setFormatError(null), 3000);
    }
  }

  return (
    <section className="flex flex-col rounded-xl border border-borderSubtle bg-panel p-4 md:p-5 shadow-sm space-y-3 transition-colors focus-within:border-sky-500/50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[11px] font-mono text-slate-300">
            2
          </span>
          <label htmlFor="test-cases-json" className="text-sm font-semibold text-slate-200">
            JSON Test Cases
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
          <button
            type="button"
            onClick={handleFormatJson}
            disabled={disabled || !value.trim()}
            className="rounded border border-borderSubtle bg-panelElevated px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-panelHover hover:text-slate-200 disabled:opacity-50 transition-colors"
            title="Prettify JSON indentation"
          >
            Prettify
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
        Must be a JSON array of test objects. Each test case requires an{" "}
        <code className="rounded bg-slate-800/80 px-1 py-0.5 font-mono text-sky-300">&quot;input&quot;</code> and an{" "}
        <code className="rounded bg-slate-800/80 px-1 py-0.5 font-mono text-sky-300">&quot;expected_output&quot;</code> field.
      </p>

      {/* Editor surface */}
      <div className="relative rounded-lg border border-borderSubtle bg-background overflow-hidden font-mono text-xs md:text-sm">
        <textarea
          id="test-cases-json"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (formatError) setFormatError(null);
          }}
          disabled={disabled}
          placeholder={`[\n  {\n    "input": { "numbers": [2, 4, 6] },\n    "expected_output": 4\n  },\n  {\n    "input": { "numbers": [] },\n    "expected_output": 0\n  }\n]`}
          spellCheck={false}
          rows={11}
          className="w-full resize-y bg-transparent p-3.5 font-mono leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-60"
        />
        <div className="flex items-center justify-between border-t border-borderSubtle/60 bg-panel/40 px-3 py-1.5 text-[11px] text-slate-500">
          <span>Valid JSON format required</span>
          {formatError && <span className="text-amber-400">{formatError}</span>}
        </div>
      </div>
    </section>
  );
}
