"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export type NavTab = "dashboard" | "agents" | "history";
export type BackendStatus = "checking" | "online" | "offline";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewChat: () => void;
  historyCount: number;
  backendStatus: BackendStatus;
  agentMode: string;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  logoRef?: React.Ref<HTMLDivElement>;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  onNewChat,
  historyCount,
  backendStatus,
  agentMode,
  isOpenMobile,
  onToggleMobile,
  logoRef,
}: Props) {
  // Section 4: Profile state for current browser session only (no backend/localStorage)
  const [userName, setUserName] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const signInTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus trap and keyboard controls for Sign in dialog
  useEffect(() => {
    if (!isSignInOpen) return;
    nameInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsSignInOpen(false);
        signInTriggerRef.current?.focus();
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSignInOpen]);

  function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("Please enter a display name to continue.");
      return;
    }
    setUserName(trimmed);
    setNameInput("");
    setNameError(null);
    setIsSignInOpen(false);
  }

  function handleSignOut() {
    setUserName(null);
    signInTriggerRef.current?.focus();
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onClick={onToggleMobile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") onToggleMobile();
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-white/10 bg-black flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 space-y-6">
          {/* Logo Brand Header */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onSelectTab("dashboard")}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSelectTab("dashboard");
            }}
            className="flex items-center space-x-3 cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            title="VerdictAI Home"
          >
            {/* Target logo icon anchor for transition glide */}
            <div ref={logoRef} className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="VerdictAI Icon"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div className="relative w-28 h-6 flex-shrink-0">
              <Image
                src="/images/wordmark-transparent.png"
                alt="VerdictAI"
                fill
                sizes="112px"
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* New Chat Button (Ghost/Secondary with diagonal shine sweep) */}
          <button
            type="button"
            onClick={onNewChat}
            className="btn-secondary btn-shine flex items-center justify-center space-x-2 w-full text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <svg
              className="w-4 h-4 text-rose-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New chat</span>
          </button>

          {/* Navigation Items with liquid metal style and clear active highlight */}
          <nav className="flex flex-col space-y-2" aria-label="Main Navigation">
            {/* Dashboard Nav Item */}
            <button
              type="button"
              onClick={() => {
                onSelectTab("dashboard");
                if (isOpenMobile) onToggleMobile();
              }}
              className={`appear appear-soft stagger-1 sidebar-item flex items-center space-x-3 w-full py-2.5 px-3 text-sm font-medium text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                activeTab === "dashboard" ? "sidebar-item-active" : ""
              }`}
            >
              <svg
                className={`w-4 h-4 ${activeTab === "dashboard" ? "text-rose-300" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* Agents Nav Item */}
            <button
              type="button"
              onClick={() => {
                onSelectTab("agents");
                if (isOpenMobile) onToggleMobile();
              }}
              className={`appear appear-soft stagger-2 sidebar-item flex items-center space-x-3 w-full py-2.5 px-3 text-sm font-medium text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                activeTab === "agents" ? "sidebar-item-active" : ""
              }`}
            >
              <svg
                className={`w-4 h-4 ${activeTab === "agents" ? "text-rose-300" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Agents</span>
            </button>

            {/* History Nav Item */}
            <button
              type="button"
              onClick={() => {
                onSelectTab("history");
                if (isOpenMobile) onToggleMobile();
              }}
              className={`appear appear-soft stagger-3 sidebar-item flex items-center justify-between w-full py-2.5 px-3 text-sm font-medium text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                activeTab === "history" ? "sidebar-item-active" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg
                  className={`w-4 h-4 ${activeTab === "history" ? "text-rose-300" : "text-slate-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>History</span>
              </div>
              {historyCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Controls: Profile (Section 4) + Backend Status (A2) */}
        <div className="flex flex-col">
          {/* Section 4: Profile / Sign in Control */}
          <div className="mx-3 mb-2 p-2.5 rounded-lg border border-white/10 bg-black/60 shadow-sm flex items-center justify-between gap-2 min-w-0">
            {userName ? (
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <div
                  className="w-7 h-7 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-200 font-mono text-xs font-semibold flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-200 truncate min-w-0" title={userName}>
                  {userName}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/15 text-slate-400 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 truncate">Guest</span>
              </div>
            )}

            {userName ? (
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out of profile"
                className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors duration-150 hover:bg-white/10 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 flex-shrink-0"
              >
                Sign out
              </button>
            ) : (
              <button
                ref={signInTriggerRef}
                type="button"
                onClick={() => {
                  setNameError(null);
                  setIsSignInOpen(true);
                }}
                aria-label="Sign in"
                className="btn-secondary btn-shine px-2.5 h-[28px] text-[11px] font-medium text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 flex-shrink-0"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Backend System Status Card (A2 Rebuilt) */}
          <div className="appear appear-soft stagger-4 mx-3 mb-4 p-3.5 rounded-lg border border-white/10 bg-black/80 shadow-sm text-xs space-y-2">
            {/* Row 1: Backend */}
            <div className="flex items-center justify-between min-w-0 gap-2">
              <span className="text-slate-400 font-medium truncate flex-shrink-0">Backend</span>
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    backendStatus === "online"
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                      : backendStatus === "checking"
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"
                      : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                  }`}
                />
                <span
                  className={`font-mono text-xs truncate ${
                    backendStatus === "online"
                      ? "text-emerald-300 font-semibold"
                      : backendStatus === "checking"
                      ? "text-amber-300"
                      : "text-rose-400 font-semibold"
                  }`}
                >
                  {backendStatus === "online" ? "Online" : backendStatus === "checking" ? "Checking..." : "Offline"}
                </span>
              </div>
            </div>

            {/* Row 2: Agent mode */}
            <div className="flex items-center justify-between min-w-0 gap-2">
              <span className="text-slate-400 font-medium truncate flex-shrink-0">Agent mode</span>
              <span className="text-slate-200 font-mono capitalize truncate min-w-0 text-right">
                {backendStatus === "offline" ? "Unknown" : agentMode || "mock"}
              </span>
            </div>

            {/* Offline hint */}
            {backendStatus === "offline" && (
              <p className="pt-2 border-t border-white/10 text-[11px] text-slate-400/90 leading-tight">
                Start the backend on port 8000.
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Profile Sign-in Dialog Modal */}
      {isSignInOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            ref={dialogRef}
            className="w-full max-w-sm rounded-xl border border-white/15 bg-black p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 id="profile-dialog-title" className="text-sm font-semibold text-slate-100">
                Sign in
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsSignInOpen(false);
                  signInTriggerRef.current?.focus();
                }}
                aria-label="Close dialog"
                className="text-slate-400 hover:text-white p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div>
                <label
                  htmlFor="profile-display-name"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  Display name
                </label>
                <input
                  ref={nameInputRef}
                  id="profile-display-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder="e.g. Alex Turing"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                />
                {nameError && (
                  <p role="alert" className="mt-1.5 text-[11px] text-rose-400">
                    {nameError}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-white/5 pt-2">
                Demo profile for this session only. Nothing is saved.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignInOpen(false);
                    signInTriggerRef.current?.focus();
                  }}
                  className="btn-secondary px-3.5 h-[34px] text-xs font-medium text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-shine px-4 h-[34px] text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
