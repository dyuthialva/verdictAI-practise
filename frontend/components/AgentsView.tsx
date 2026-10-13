"use client";

import PixelReveal from "./PixelReveal";

interface Props {
  onBackToDebugger: () => void;
}

export default function AgentsView({ onBackToDebugger }: Props) {
  const agents = [
    {
      name: "Prosecutor",
      role: "Bug Investigator",
      badge: "Agent 1",
      icon: "/images/prosecutor-transparent.png",
      colorBorder: "border-rose-500/40 hover:border-rose-500/70 focus:border-rose-500/70",
      colorShadow: "hover:shadow-[0_12px_32px_rgba(244,63,94,0.22)] focus:shadow-[0_12px_32px_rgba(244,63,94,0.22)]",
      colorBg: "bg-rose-950/30",
      colorAccent: "text-rose-400",
      colorPill: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      summary: "Identifies the likely bug and proposes a fix.",
      description:
        "Acts as the aggressive detective. It parses your program to pinpoint exactly where and why it crashes or produces incorrect results, providing an initial candidate code repair.",
      focus: ["Pinpoints failing line/logic", "Detects boundary exceptions", "Proposes rapid initial fix"],
    },
    {
      name: "Defender",
      role: "Counter-Analyst",
      badge: "Agent 2",
      icon: "/images/defender-transparent.png",
      colorBorder: "border-rose-700/50 hover:border-rose-600/70 focus:border-rose-600/70",
      colorShadow: "hover:shadow-[0_12px_32px_rgba(190,18,60,0.22)] focus:shadow-[0_12px_32px_rgba(190,18,60,0.22)]",
      colorBg: "bg-rose-950/40",
      colorAccent: "text-rose-300",
      colorPill: "bg-rose-900/30 text-rose-200 border-rose-700/40",
      summary: "Challenges the first diagnosis and proposes an alternative.",
      description:
        "Acts as the skeptical safeguard. It scrutinizes the Prosecutor's reasoning, exposes unhandled edge cases (such as nulls, empty payloads, or extreme inputs), and drafts a superior alternative solution.",
      focus: ["Challenges early assumptions", "Uncovers subtle edge cases", "Engineers defensive code"],
    },
    {
      name: "Judge",
      role: "Impartial Arbiter",
      badge: "Agent 3",
      icon: "/images/judge-transparent.png",
      colorBorder: "border-rose-900/60 hover:border-rose-700/80 focus:border-rose-700/80",
      colorShadow: "hover:shadow-[0_12px_32px_rgba(136,19,55,0.25)] focus:shadow-[0_12px_32px_rgba(136,19,55,0.25)]",
      colorBg: "bg-rose-950/20",
      colorAccent: "text-rose-200",
      colorPill: "bg-rose-950/40 text-rose-300 border-rose-800/40",
      summary: "Runs the original and candidate programs against the same tests, then bases the verdict on observed results.",
      description:
        "Acts as the evidence-driven court. It executes every candidate solution inside an isolated test sandbox, measures exact pass/fail counts against your test suite, and renders an indisputable verdict.",
      focus: ["Runs strict test suites", "Evaluates concrete evidence", "Delivers final verdict"],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Swarm Debugger Agents
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Meet the three adversarial agents that deliberate and resolve your Python code flaws.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDebugger}
          className="btn-secondary btn-shine flex items-center space-x-2 px-4 h-[40px] text-sm font-medium text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <span>← Back to Debugger</span>
        </button>
      </div>

      {/* 3 Horizontally Aligned Cards on Desktop, Stacking on Narrow Screens */}
      {/* Container has padding so scale(1.02) and soft shadows do not clip or shift neighbors */}
      <div className="grid gap-6 md:grid-cols-3 p-2">
        {agents.map((agent) => (
          <div
            key={agent.name}
            tabIndex={0}
            role="region"
            aria-label={`${agent.name} Agent Card`}
            className={`flex flex-col justify-between rounded-xl border bg-black/80 p-6 shadow-sm transform transition-transform duration-200 ease-out will-change-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${agent.colorBorder} ${agent.colorShadow}`}
          >
            <div className="space-y-5">
              {/* Agent Icon & Header */}
              <div className="flex items-start justify-between">
                <div
                  className={`relative h-16 w-16 rounded-xl p-2 border border-white/10 ${agent.colorBg} flex items-center justify-center`}
                >
                  <PixelReveal
                    src={agent.icon}
                    alt={`${agent.name} Icon`}
                    width={56}
                    height={56}
                    duration={900}
                    className="object-contain p-0.5"
                  />
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${agent.colorPill}`}
                >
                  {agent.badge}
                </span>
              </div>

              {/* Title & Role */}
              <div>
                <h3 className={`text-xl font-bold ${agent.colorAccent}`}>{agent.name}</h3>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {agent.role}
                </p>
              </div>

              {/* Concise Beginner-Friendly Summary */}
              <div className="rounded-lg border border-white/10 bg-black/60 p-3">
                <p className="text-xs font-semibold text-slate-200 leading-snug">
                  {agent.summary}
                </p>
              </div>

              {/* Detailed Description */}
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                {agent.description}
              </p>

              {/* Key Competencies list */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  Core Responsibilities
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {agent.focus.map((item) => (
                    <li key={item} className="flex items-center space-x-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${agent.colorAccent}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={onBackToDebugger}
                className="btn-secondary btn-shine w-full h-[38px] flex items-center justify-center text-xs font-medium text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Test with {agent.name} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
