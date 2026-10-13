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
    } catch {
      setFormatError("Cannot format: invalid JSON syntax");
      setTimeout(() => setFormatError(null), 3000);
    }
  }

  return (
    <section className="appear appear-soft stagger-5 flex flex-col rounded-xl border border-white/10 bg-black/80 p-4 md:p-5 shadow-sm space-y-3 transition-all duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[11px] font-mono text-slate-300">
            2
          </span>
          <label htmlFor="test-cases-json" className="text-sm font-semibold text-slate-200">
            JSON Test Cases
          </label>
        </div>

        <div className="flex items-center space-x-2">
          {/* Load Sample Button */}
          <button
            type="button"
            onClick={onLoadSample}
            disabled={disabled}
            className="btn-secondary btn-shine text-xs px-3 h-[36px] flex items-center justify-center disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Load sample
          </button>

          {/* Prettify Button */}
          <button
            type="button"
            onClick={handleFormatJson}
            disabled={disabled || !value.trim()}
            className="btn-secondary btn-shine text-xs px-3 h-[36px] flex items-center justify-center disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            title="Prettify JSON indentation"
          >
            Prettify
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
        Must be a JSON array of test objects. Each test case requires an{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-sky-300">&quot;input&quot;</code> and an{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-sky-300">&quot;expected_output&quot;</code> field.
      </p>

      {/* Editor surface with pure dark base, soft glow, and brighter border on focus (B5) */}
      <div className="box-glow relative rounded-lg overflow-hidden font-mono text-xs md:text-sm">
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
          className="w-full resize-y bg-transparent p-3.5 font-mono leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-60 transition-colors duration-200"
        />
        <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-slate-400">
          <span>Valid JSON format required</span>
          {formatError && <span className="text-amber-400">{formatError}</span>}
        </div>
      </div>
    </section>
  );
}
