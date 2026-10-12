"use client";

import { useState } from "react";
import CodeInput from "@/components/CodeInput";
import TestCaseInput from "@/components/TestCaseInput";
import { parseTestCases, runDebug } from "@/lib/api";
import { SAMPLE_CODE, SAMPLE_TESTS } from "@/lib/samples";
import type { DebugResponse } from "@/lib/types";

export default function Home() {
  const [code, setCode] = useState("");
  const [testsText, setTestsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DebugResponse | null>(null);

  async function handleRun() {
    if (loading) return; // guard against duplicate submissions
    setError(null);
    setResult(null);

    if (!code.trim()) {
      setError("Enter some Python code first.");
      return;
    }
    const parsed = parseTestCases(testsText);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    setLoading(true);
    try {
      setResult(await runDebug({ original_code: code, test_cases: parsed.value }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <header>
        <h1 className="text-3xl font-bold">Swarm Debugger</h1>
        <p className="text-slate-600">
          A Prosecutor, a Defender and a Judge compete to fix your bug, and real test execution decides the winner.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <CodeInput
          value={code}
          onChange={setCode}
          onLoadSample={() => setCode(SAMPLE_CODE)}
          disabled={loading}
        />
        <TestCaseInput
          value={testsText}
          onChange={setTestsText}
          onLoadSample={() => setTestsText(SAMPLE_TESTS)}
          disabled={loading}
        />
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="rounded bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? "Running…" : "Run Debugger"}
      </button>

      {error && (
        <div role="alert" className="whitespace-pre-line rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {result && (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-2 font-semibold">Backend response (Milestone 1)</h2>
          <p className="mb-2 text-sm text-slate-600">{result.message}</p>
          <dl className="grid grid-cols-2 gap-1 text-sm md:w-80">
            <dt className="text-slate-500">Agent mode</dt>
            <dd className="font-mono">{result.agent_mode}</dd>
            <dt className="text-slate-500">Lines of code</dt>
            <dd className="font-mono">{result.code_line_count}</dd>
            <dt className="text-slate-500">Test cases</dt>
            <dd className="font-mono">{result.test_case_count}</dd>
          </dl>
        </section>
      )}
    </main>
  );
}
