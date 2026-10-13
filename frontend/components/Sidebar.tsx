"use client";

import Image from "next/image";

export type NavTab = "dashboard" | "agents" | "history";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewChat: () => void;
  historyCount: number;
  backendOnline: boolean;
  agentMode: string;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  onNewChat,
  historyCount,
  backendOnline,
  agentMode,
  isOpenMobile,
  onToggleMobile,
}: Props) {
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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-borderSubtle bg-panel flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
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
            className="flex items-center space-x-3 cursor-pointer py-1 px-2 rounded-lg hover:bg-panelHover transition-colors focus-visible:ring-1 focus-visible:ring-sky-500"
            title="VerdictAI Home"
          >
            <div className="relative w-9 h-9 flex-shrink-0">
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

          {/* New Chat Primary Button */}
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 rounded-lg border border-borderSubtle bg-panelElevated hover:border-sky-500/50 hover:bg-panelHover text-sm font-medium text-slate-200 transition-all shadow-sm active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <svg
              className="w-4 h-4 text-sky-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New chat</span>
          </button>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-1.5" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => {
                onSelectTab("dashboard");
                if (isOpenMobile) onToggleMobile();
              }}
              className={`flex items-center space-x-3 w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === "dashboard"
                  ? "bg-slate-800 text-sky-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-panelHover"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab("agents");
                if (isOpenMobile) onToggleMobile();
              }}
              className={`flex items-center space-x-3 w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === "agents"
                  ? "bg-slate-800 text-sky-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-panelHover"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Agents</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab("history");
                if (isOpenMobile) onToggleMobile();
              }}
              className={`flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === "history"
                  ? "bg-slate-800 text-sky-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-panelHover"
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Backend System Status */}
        <div className="p-4 border-t border-borderSubtle bg-background/50 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">FastAPI Backend</span>
            <div className="flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span className={backendOnline ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>
                {backendOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Agent Mode</span>
            <span className="text-slate-400 capitalize">{agentMode || "mock"}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
