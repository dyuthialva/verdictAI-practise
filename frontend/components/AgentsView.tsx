"use client";

import Image from "next/image";

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
      colorBorder: "border-orange-500/30 hover:border-orange-500/60",
      colorBg: "bg-orange-950/10",
      colorAccent: "text-orange-400",
      colorPill: "bg-orange-500/10 text-orange-400 border-orange-500/20",
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
      colorBorder: "border-sky-500/30 hover:border-sky-500/60",
      colorBg: "bg-sky-950/10",
      colorAccent: "text-sky-400",
      colorPill: "bg-sky-500/10 text-sky-400 border-sky-500/20",
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
      colorBorder: "border-emerald-500/30 hover:border-emerald-500/60",
      colorBg: "bg-emerald-950/10",
      colorAccent: "text-emerald-400",
      colorPill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      summary: "Runs the original and candidate programs against the same tests, then bases the verdict on observed results.",
      description:
        "Acts as the evidence-driven court. It executes every candidate solution inside an isolated test sandbox, measures exact pass/fail counts against your test suite, and renders an indisputable verdict.",
      focus: ["Runs strict test suites", "Evaluates concrete evidence", "Delivers final verdict"],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borderSubtle pb-6">
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
          className="flex items-center space-x-2 rounded-lg border border-borderSubtle bg-panel px-4 py-2 text-sm font-medium text-slate-200 hover:bg-panelHover hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span>← Back to Debugger</span>
        </button>
      </div>

      {/* 3 Horizontally Aligned Cards on Desktop, Stacking on Narrow Screens */}
      <div className="grid gap-6 md:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`flex flex-col justify-between rounded-xl border bg-panel p-6 shadow-sm transition-all duration-300 ${agent.colorBorder}`}
          >
            <div className="space-y-5">
              {/* Agent Icon & Header */}
              <div className="flex items-start justify-between">
                <div
                  className={`relative h-16 w-16 rounded-xl p-2 border border-borderSubtle ${agent.colorBg} flex items-center justify-center`}
                >
                  <Image
                    src={agent.icon}
                    alt={`${agent.name} Icon`}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
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
              <div className="rounded-lg border border-borderSubtle/60 bg-background/60 p-3">
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

            <div className="pt-6 border-t border-borderSubtle/60 mt-6">
              <button
                type="button"
                onClick={onBackToDebugger}
                className="w-full rounded-lg border border-borderSubtle bg-panelElevated py-2 text-xs font-medium text-slate-300 hover:bg-panelHover hover:text-white transition-colors"
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
