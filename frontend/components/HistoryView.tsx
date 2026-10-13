"use client";

import type { SessionRun } from "@/lib/types";

interface Props {
  runs: SessionRun[];
  onSelectRun: (run: SessionRun) => void;
  onBackToDebugger: () => void;
}

export default function HistoryView({ runs, onSelectRun, onBackToDebugger }: Props) {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Session History
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review previous debugging runs executed in this active browser session.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDebugger}
          className="btn-secondary btn-shine flex items-center space-x-2 px-4 h-[40px] text-sm font-medium text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <span>← Back to Debugger</span>
        </button>
      </div>

      {runs.length === 0 ? (
        /* Simple Clean Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/60 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-200">No session history yet</h3>
          <p className="mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
            Runs from this active browser session will appear here. No database or persistent storage is used.
          </p>
          <button
            type="button"
            onClick={onBackToDebugger}
            className="btn-primary btn-shine mt-6 px-4 h-[38px] text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Run your first debugging session →
          </button>
        </div>
      ) : (
        /* History Run List */
        <div className="space-y-3">
          {runs.map((run, idx) => {
            const winner = run.response.judge?.winner ?? "Complete";
            const prosPassed = run.response.results?.prosecutor.passed_count ?? 0;
            const defPassed = run.response.results?.defender.passed_count ?? 0;
            const totalTests = run.response.results?.original.total_count ?? run.response.test_case_count;

            return (
              <div
                key={run.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectRun(run)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSelectRun(run);
                }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/80 p-4 transition-all duration-200 hover:border-white/30 hover:bg-white/5 active:bg-black cursor-pointer shadow-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-semibold text-sky-400">
                      Run #{runs.length - idx}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {run.timestamp}
                    </span>
                    <span className="rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      {totalTests} {totalTests === 1 ? "test" : "tests"}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-300 truncate max-w-xl">
                    {run.codeSnippet}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-mono">Winner</div>
                    <div className="text-xs font-bold text-rose-300">{winner}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-400 font-mono">Top Pass</div>
                    <div className="text-xs font-mono text-slate-200">
                      {Math.max(prosPassed, defPassed)}/{totalTests}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRun(run);
                    }}
                    className="btn-secondary btn-shine px-3 h-[32px] text-xs font-medium text-slate-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                  >
                    View Conversation →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
