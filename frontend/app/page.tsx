"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import EntryScreen from "@/components/EntryScreen";
import Sidebar, { NavTab } from "@/components/Sidebar";
import CodeInput from "@/components/CodeInput";
import TestCaseInput from "@/components/TestCaseInput";
import ConversationView from "@/components/ConversationView";
import AgentsView from "@/components/AgentsView";
import HistoryView from "@/components/HistoryView";
import { checkBackendHealth, parseTestCases, runDebug } from "@/lib/api";
import { SAMPLE_CODE, SAMPLE_TESTS } from "@/lib/samples";
import type { DebugRequest, DebugResponse, SessionRun } from "@/lib/types";

export default function Home() {
  // Navigation & Screen states
  const [showEntry, setShowEntry] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form states
  const [code, setCode] = useState(SAMPLE_CODE);
  const [testsText, setTestsText] = useState(SAMPLE_TESTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active run & session history
  const [currentRun, setCurrentRun] = useState<{
    request: DebugRequest;
    response: DebugResponse;
  } | null>(null);
  const [sessionRuns, setSessionRuns] = useState<SessionRun[]>([]);

  // Backend health state
  const [backendOnline, setBackendOnline] = useState(false);
  const [agentMode, setAgentMode] = useState("mock");

  // Health check on mount and interval
  const verifyBackend = useCallback(async () => {
    const health = await checkBackendHealth();
    setBackendOnline(health.ok);
    if (health.agentMode) {
      setAgentMode(health.agentMode);
    }
  }, []);

  useEffect(() => {
    verifyBackend();
    const timer = setInterval(verifyBackend, 15000);
    return () => clearInterval(timer);
  }, [verifyBackend]);

  // Execute debug run
  async function handleRun() {
    if (loading) return; // Prevent duplicate submissions
    setError(null);

    // 1. Validate Python code
    if (!code.trim()) {
      setError("Please enter some Python code defining solve(input_data).");
      return;
    }

    // 2. Parse & validate JSON test cases
    const parsed = parseTestCases(testsText);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    const debugReq: DebugRequest = {
      original_code: code,
      test_cases: parsed.value,
    };

    setLoading(true);
    try {
      const response = await runDebug(debugReq);
      setCurrentRun({ request: debugReq, response });
      setActiveTab("dashboard");

      // Save to session history
      const newRun: SessionRun = {
        id: `run-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        codeSnippet: code.split("\n")[0] || "def solve(input_data):",
        request: debugReq,
        response,
      };
      setSessionRuns((prev) => [newRun, ...prev]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Clear current run and return to submission input
  function handleNewChat() {
    setCurrentRun(null);
    setError(null);
    setActiveTab("dashboard");
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  }

  // Select historical run
  function handleSelectRun(run: SessionRun) {
    setCurrentRun({ request: run.request, response: run.response });
    setActiveTab("dashboard");
  }

  return (
    <>
      {/* 1. Minimal Entry Screen */}
      {showEntry && <EntryScreen onEnter={() => setShowEntry(false)} />}

      {/* 2. Main Dashboard Application Layout */}
      <div className="flex min-h-screen bg-background bg-tech-grid">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onNewChat={handleNewChat}
          historyCount={sessionRuns.length}
          backendOnline={backendOnline}
          agentMode={agentMode}
          isOpenMobile={mobileSidebarOpen}
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col md:pl-64 min-w-0">
          {/* Top Mobile Bar */}
          <header className="flex h-14 items-center justify-between border-b border-borderSubtle bg-panel/80 px-4 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="relative h-6 w-24">
              <Image
                src="/images/wordmark-transparent.png"
                alt="VerdictAI"
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={handleNewChat}
              className="rounded border border-borderSubtle bg-panelElevated px-2 py-1 text-xs font-medium text-slate-300"
            >
              New
            </button>
          </header>

          {/* Central Main View */}
          <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
            {/* VIEW 1: AGENTS TAB */}
            {activeTab === "agents" && (
              <AgentsView onBackToDebugger={() => setActiveTab("dashboard")} />
            )}

            {/* VIEW 2: HISTORY TAB */}
            {activeTab === "history" && (
              <HistoryView
                runs={sessionRuns}
                onSelectRun={handleSelectRun}
                onBackToDebugger={() => setActiveTab("dashboard")}
              />
            )}

            {/* VIEW 3: DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <>
                {currentRun ? (
                  /* 3. Debugging Conversation Group-Chat View */
                  <ConversationView
                    request={currentRun.request}
                    response={currentRun.response}
                    onEditAndRerun={() => setCurrentRun(null)}
                  />
                ) : (
                  /* 2. Code Submission Area */
                  <div className="space-y-6">
                    {/* VerdictAI Wordmark Above Submission Area */}
                    <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2 pb-4">
                      <div className="relative h-14 w-56 md:h-16 md:w-64">
                        <Image
                          src="/images/wordmark-transparent.png"
                          alt="VerdictAI"
                          fill
                          sizes="256px"
                          priority
                          className="object-contain"
                        />
                      </div>
                      <p className="max-w-lg text-xs md:text-sm text-slate-400 leading-relaxed">
                        Swarm debugger for Python. Submit your code and tests to let the Prosecutor, Defender, and Judge collaborate and compete.
                      </p>
                    </div>

                    {/* Dual Code and Tests Editors */}
                    <div className="grid gap-4 lg:grid-cols-2">
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

                    {/* Run Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-500 font-mono">
                        Press Run Debugger to start the 3-agent swarm analysis
                      </div>

                      <button
                        type="button"
                        onClick={handleRun}
                        disabled={loading}
                        className="flex items-center space-x-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-sky-500/20 focus-visible:ring-2 focus-visible:ring-sky-300"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="h-4 w-4 animate-spin text-slate-950"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            <span>Agents Deliberating…</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Run Debugger</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div
                        role="alert"
                        className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs md:text-sm text-rose-300 whitespace-pre-line leading-relaxed flex items-start space-x-3"
                      >
                        <svg
                          className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <div className="font-semibold text-rose-200 mb-0.5">Submission Error</div>
                          <div>{error}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
