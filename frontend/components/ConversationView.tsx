"use client";

import { useState } from "react";
import PixelReveal from "./PixelReveal";
import type { DebugRequest, DebugResponse } from "@/lib/types";

interface Props {
  request: DebugRequest;
  response: DebugResponse;
  onEditAndRerun: () => void;
}

export default function ConversationView({ request, response, onEditAndRerun }: Props) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showFullSubmission, setShowFullSubmission] = useState(false);

  const { prosecutor, defender, judge, results, agent_mode, status, message } = response;
  const isMockMode = agent_mode === "mock";

  function copyCode(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            Debugging Conversation
          </h2>
          <p className="text-xs text-slate-400">
            Multi-agent deliberation and verified test results
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isMockMode && (
            <span
              className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400"
              title="Agent responses generated via deterministic mock heuristics. Test execution is real."
            >
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Mock Agent Mode
            </span>
          )}

          <button
            type="button"
            onClick={onEditAndRerun}
            className="btn-secondary btn-shine px-3.5 h-[36px] flex items-center justify-center text-xs font-medium text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Edit & Re-run
          </button>
        </div>
      </div>

      {/* Mock Mode Notice Banner */}
      {isMockMode && (
        <div
          role="note"
          className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300/90 leading-relaxed"
        >
          <span className="font-semibold text-amber-300">Notice:</span> Agent responses
          (Prosecutor, Defender, and Judge reasoning) are running in <strong>mock mode</strong>.
          Test case execution against the code was evaluated against actual test inputs.
        </div>
      )}

      {/* 1. User's Submitted Code & Tests Card */}
      <div className="rounded-xl border border-white/10 bg-black/80 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-mono font-semibold text-sky-400">
              U
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-200">You</span>
              <span className="ml-2 text-xs text-slate-500 font-mono">Original Submission</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFullSubmission(!showFullSubmission)}
            className="text-xs text-slate-400 transition-all duration-200 hover:text-white active:text-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
          >
            {showFullSubmission ? "Collapse ↑" : "Expand Code & Tests ↓"}
          </button>
        </div>

        {showFullSubmission ? (
          <div className="grid gap-4 p-4 md:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
                <span>Submitted Code ({response.code_line_count} lines)</span>
                <button
                  type="button"
                  onClick={() => copyCode(request.original_code, "orig")}
                  className="rounded px-2 py-0.5 text-xs text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white active:bg-white/5 disabled:opacity-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                >
                  {copiedSection === "orig" ? "Copied!" : "Copy code"}
                </button>
              </div>
              <pre className="max-h-60 overflow-auto rounded-lg border border-white/10 bg-black p-3 text-xs font-mono text-slate-300">
                <code>{request.original_code}</code>
              </pre>
            </div>

            <div>
              <div className="mb-1.5 text-xs text-slate-400">
                <span>Test Cases ({response.test_case_count})</span>
              </div>
              <pre className="max-h-60 overflow-auto rounded-lg border border-white/10 bg-black p-3 text-xs font-mono text-slate-300">
                <code>{JSON.stringify(request.test_cases, null, 2)}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-3 text-xs text-slate-400 flex items-center justify-between bg-black/40">
            <span className="font-mono text-slate-300 truncate max-w-md">
              {request.original_code.split("\n")[0] || "def solve(input_data): ..."}
            </span>
            <span className="text-slate-500">
              {response.code_line_count} lines · {response.test_case_count} tests
            </span>
          </div>
        )}
      </div>

      {/* If Milestone 1 validated response only */}
      {status === "validated" && !prosecutor && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5 text-sm text-sky-200 space-y-2">
          <div className="font-semibold text-sky-400">Request Validated by Backend</div>
          <p className="text-slate-300">{message}</p>
          <div className="text-xs font-mono text-slate-400 pt-2">
            Mode: {agent_mode} | Lines: {response.code_line_count} | Tests: {response.test_case_count}
          </div>
        </div>
      )}

      {/* 2. PROSECUTOR AGENT CARD */}
      {prosecutor && (
        <div className="rounded-xl border border-orange-500/30 bg-black/80 overflow-hidden shadow-sm transition-all duration-200 hover:border-orange-500/60 hover:shadow-[0_8px_24px_rgba(234,88,12,0.15)]">
          <div className="flex items-center justify-between border-b border-orange-500/20 bg-orange-950/20 px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="relative h-9 w-9 flex-shrink-0 rounded-lg bg-orange-900/40 p-1 border border-orange-500/30 flex items-center justify-center">
                <PixelReveal
                  src="/images/prosecutor-transparent.png"
                  alt="Prosecutor Icon"
                  width={30}
                  height={30}
                  duration={900}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-orange-400">Prosecutor</span>
                  <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-orange-300">
                    Agent 1
                  </span>
                </div>
                <span className="text-xs text-slate-400">Identifies bug & proposes initial fix</span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400/90 mb-1">
                Root Cause
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {prosecutor.root_cause}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Reasoning & Diagnosis
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {prosecutor.reasoning}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400/90">
                  Proposed Fix
                </h4>
                <button
                  type="button"
                  onClick={() => copyCode(prosecutor.proposed_code, "pros")}
                  className="rounded border border-borderSubtle bg-panelElevated px-2 py-0.5 text-xs text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white active:bg-slate-900 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                >
                  {copiedSection === "pros" ? "Copied!" : "Copy code"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-borderSubtle bg-background p-3 text-xs md:text-sm font-mono text-emerald-300">
                <code>{prosecutor.proposed_code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEFENDER AGENT CARD */}
      {defender && (
        <div className="rounded-xl border border-sky-500/30 bg-black/80 overflow-hidden shadow-sm transition-all duration-200 hover:border-sky-500/60 hover:shadow-[0_8px_24px_rgba(2,132,199,0.15)]">
          <div className="flex items-center justify-between border-b border-sky-500/20 bg-sky-950/20 px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="relative h-9 w-9 flex-shrink-0 rounded-lg bg-sky-900/40 p-1 border border-sky-500/30 flex items-center justify-center">
                <PixelReveal
                  src="/images/defender-transparent.png"
                  alt="Defender Icon"
                  width={30}
                  height={30}
                  duration={900}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-sky-400">Defender</span>
                  <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-sky-300">
                    Agent 2
                  </span>
                </div>
                <span className="text-xs text-slate-400">Challenges diagnosis & proposes alternative fix</span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400/90 mb-1">
                Criticism of Prosecutor
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {defender.criticism}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Edge Cases Identified
              </h4>
              <p className="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {defender.edge_cases}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Alternative Reasoning
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {defender.alternative_reasoning}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400/90">
                  Alternative Proposed Code
                </h4>
                <button
                  type="button"
                  onClick={() => copyCode(defender.proposed_code, "def")}
                  className="rounded border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white active:bg-white/5 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                >
                  {copiedSection === "def" ? "Copied!" : "Copy code"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black p-3 text-xs md:text-sm font-mono text-sky-300">
                <code>{defender.proposed_code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 4. JUDGE AGENT CARD */}
      {judge && (
        <div className="rounded-xl border border-emerald-500/40 bg-black/80 overflow-hidden shadow-sm transition-all duration-200 hover:border-emerald-500/70 hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="relative h-9 w-9 flex-shrink-0 rounded-lg bg-emerald-900/40 p-1 border border-emerald-500/30 flex items-center justify-center">
                <PixelReveal
                  src="/images/judge-transparent.png"
                  alt="Judge Icon"
                  width={30}
                  height={30}
                  duration={900}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-emerald-400">Judge</span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-300">
                    Agent 3
                  </span>
                </div>
                <span className="text-xs text-slate-400">Impartial test-driven evaluation</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Winner:</span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-300">
                {judge.winner}
              </span>
            </div>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 mb-1">
                Final Verdict
              </h4>
              <p className="text-sm md:text-base text-slate-100 font-semibold leading-relaxed">
                {judge.verdict}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Evidence from Test Execution
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {judge.evidence}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. RESULTS COMPARISON MATRIX */}
      {results && (
        <section className="rounded-xl border border-borderSubtle bg-panel overflow-hidden shadow-sm space-y-4 p-4 md:p-5">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Results Comparison Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Verified execution of Original, Prosecutor, and Defender programs against test cases
            </p>
          </div>

          {/* Three comparison scorecards */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Original */}
            <div className="rounded-lg border border-borderSubtle bg-background p-3.5 space-y-1.5">
              <div className="text-xs text-slate-400 font-medium">Original Code</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-slate-200">
                  {results.original.passed_count}/{results.original.total_count}
                </span>
                <span className="text-xs text-slate-500">passed</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {results.original.failed_count > 0 ? (
                  <span className="text-rose-400">{results.original.failed_count} failed</span>
                ) : (
                  <span className="text-emerald-400">All tests passed</span>
                )}
              </div>
            </div>

            {/* Prosecutor */}
            <div className="rounded-lg border border-orange-500/20 bg-orange-950/10 p-3.5 space-y-1.5">
              <div className="text-xs text-orange-400/90 font-medium">Prosecutor&apos;s Fix</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-orange-300">
                  {results.prosecutor.passed_count}/{results.prosecutor.total_count}
                </span>
                <span className="text-xs text-slate-500">passed</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {results.prosecutor.failed_count > 0 ? (
                  <span className="text-rose-400">{results.prosecutor.failed_count} failed</span>
                ) : (
                  <span className="text-emerald-400">100% pass rate</span>
                )}
              </div>
            </div>

            {/* Defender */}
            <div className="rounded-lg border border-sky-500/20 bg-sky-950/10 p-3.5 space-y-1.5">
              <div className="text-xs text-sky-400/90 font-medium">Defender&apos;s Fix</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-sky-300">
                  {results.defender.passed_count}/{results.defender.total_count}
                </span>
                <span className="text-xs text-slate-500">passed</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {results.defender.failed_count > 0 ? (
                  <span className="text-rose-400">{results.defender.failed_count} failed</span>
                ) : (
                  <span className="text-emerald-400">100% pass rate</span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed per-test breakdown table */}
          <div className="overflow-x-auto rounded-lg border border-borderSubtle bg-background">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-borderSubtle bg-panelElevated text-slate-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Test #</th>
                  <th className="py-2.5 px-3">Input</th>
                  <th className="py-2.5 px-3">Expected</th>
                  <th className="py-2.5 px-3">Original</th>
                  <th className="py-2.5 px-3">Prosecutor</th>
                  <th className="py-2.5 px-3">Defender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle/60 text-slate-300">
                {results.original.tests.map((origTest, idx) => {
                  const prosTest = results.prosecutor.tests[idx];
                  const defTest = results.defender.tests[idx];

                  return (
                    <tr key={origTest.test_index} className="hover:bg-panel/40">
                      <td className="py-3 px-3 font-semibold text-slate-400">
                        #{origTest.test_index}
                      </td>
                      <td className="py-3 px-3 max-w-[140px] truncate" title={JSON.stringify(origTest.input)}>
                        {JSON.stringify(origTest.input)}
                      </td>
                      <td className="py-3 px-3 max-w-[120px] truncate" title={JSON.stringify(origTest.expected_output)}>
                        {JSON.stringify(origTest.expected_output)}
                      </td>

                      {/* Original result */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col space-y-0.5">
                          <span
                            className={`inline-flex items-center w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              origTest.passed
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {origTest.passed ? "PASS" : "FAIL"}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={String(origTest.actual_output ?? origTest.error)}>
                            {origTest.error ? origTest.error : JSON.stringify(origTest.actual_output)}
                          </span>
                        </div>
                      </td>

                      {/* Prosecutor result */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col space-y-0.5">
                          <span
                            className={`inline-flex items-center w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              prosTest?.passed
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {prosTest?.passed ? "PASS" : "FAIL"}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={String(prosTest?.actual_output ?? prosTest?.error)}>
                            {prosTest?.error ? prosTest.error : JSON.stringify(prosTest?.actual_output)}
                          </span>
                        </div>
                      </td>

                      {/* Defender result */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col space-y-0.5">
                          <span
                            className={`inline-flex items-center w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              defTest?.passed
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {defTest?.passed ? "PASS" : "FAIL"}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={String(defTest?.actual_output ?? defTest?.error)}>
                            {defTest?.error ? defTest.error : JSON.stringify(defTest?.actual_output)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
