"use client";

import { useEffect } from "react";
import Image from "next/image";

interface Props {
  onEnter: () => void;
}

export default function EntryScreen({ onEnter }: Props) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onEnter();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEnter();
        }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background bg-tech-grid px-6 text-center transition-opacity duration-500 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      aria-label="Welcome screen. Click or press Enter to launch VerdictAI"
    >
      <div className="flex flex-col items-center max-w-xl mx-auto space-y-8 animate-fade-in">
        {/* Supplied VerdictAI Logo */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/logo-transparent.png"
            alt="VerdictAI Logo"
            fill
            sizes="176px"
            priority
            className="object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]"
          />
        </div>

        {/* Supplied VerdictAI Wordmark / Typography */}
        <div className="relative w-64 h-16 md:w-80 md:h-20">
          <Image
            src="/images/wordmark-transparent.png"
            alt="VerdictAI"
            fill
            sizes="320px"
            priority
            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Short Tagline */}
        <p className="text-slate-400 text-base md:text-lg font-light tracking-wide max-w-md leading-relaxed">
          Debug Python code with clarity through adversarial swarm intelligence.
        </p>

        {/* Entry Prompt */}
        <div className="pt-4 flex items-center space-x-2 text-xs md:text-sm text-slate-500 font-mono tracking-wider">
          <span className="inline-block px-2.5 py-1 rounded border border-borderSubtle bg-panel text-slate-300">
            Enter ↵
          </span>
          <span>or click anywhere to begin</span>
        </div>
      </div>
    </div>
  );
}
