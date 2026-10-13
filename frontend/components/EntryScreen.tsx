"use client";

import { useEffect, useState, useRef, RefObject } from "react";
import Image from "next/image";

import PixelReveal from "./PixelReveal";

interface Props {
  onEnter: () => void;
  targetRef?: React.RefObject<HTMLDivElement | null>;
}

export default function EntryScreen({ onEnter, targetRef }: Props) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({});
  const logoRef = useRef<HTMLDivElement>(null);
  const isTriggered = useRef(false);

  function handleTrigger() {
    if (isTriggered.current) return;
    isTriggered.current = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onEnter();
      return;
    }

    // Calculate glide and shrink to sidebar target (up to 500ms)
    if (logoRef.current && targetRef?.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const currentRect = logoRef.current.getBoundingClientRect();

      const currentCenterX = currentRect.left + currentRect.width / 2;
      const currentCenterY = currentRect.top + currentRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const deltaX = targetCenterX - currentCenterX;
      const deltaY = targetCenterY - currentCenterY;
      const scale = targetRect.width / currentRect.width;

      setTransformStyle({
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scale})`,
        transition: "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
      });
    } else {
      // Fallback glide towards top-left sidebar location
      setTransformStyle({
        transform: "translate(-38vw, -38vh) scale(0.22)",
        transition: "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
      });
    }

    setIsTransitioning(true);

    // After logo glide completes (450ms), finish transition to dashboard
    setTimeout(() => {
      onEnter();
    }, 450);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTrigger();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleTrigger}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTrigger();
        }
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-tech-grid px-6 text-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition-opacity duration-300 ${
        isTransitioning ? "pointer-events-none" : ""
      }`}
      aria-label="Welcome screen. Click or press Enter to launch VerdictAI"
    >
      {/* Landing page burgundy glow */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none bg-landing-glow transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative flex flex-col items-center max-w-xl mx-auto space-y-8 z-10">
        {/* Supplied VerdictAI Logo with PixelReveal and shared-element glide-and-shrink transform */}
        <div
          ref={logoRef}
          style={transformStyle}
          className="appear appear-scale entry-step-0 relative w-36 h-36 md:w-44 md:h-44 will-change-transform flex items-center justify-center"
        >
          <PixelReveal
            src="/images/logo-transparent.png"
            alt="VerdictAI Logo"
            width={176}
            height={176}
            duration={900}
            priority
            className="object-contain drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]"
          />
        </div>

        {/* Text & Wordmark content fades out on transition */}
        <div
          className={`flex flex-col items-center space-y-8 transition-opacity duration-200 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Supplied VerdictAI Wordmark with PixelReveal */}
          <div className="appear appear-soft entry-step-1 relative w-64 h-16 md:w-80 md:h-20 flex items-center justify-center">
            <PixelReveal
              src="/images/wordmark-transparent.png"
              alt="VerdictAI"
              width={320}
              height={80}
              duration={900}
              priority
              className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            />
          </div>

          {/* Short Tagline */}
          <p className="appear appear-soft entry-step-2 text-slate-400 text-base md:text-lg font-light tracking-wide max-w-md leading-relaxed">
            Debug Python code with clarity through adversarial swarm intelligence.
          </p>

          {/* Entry Prompt Hint */}
          <div className="appear appear-btn entry-step-3 pt-4 flex items-center space-x-2 text-xs md:text-sm text-slate-500 font-mono tracking-wider">
            <span className="inline-block px-2.5 py-1 rounded border border-white/20 bg-white/5 text-slate-300 shadow-sm">
              Enter ↵
            </span>
            <span>or click anywhere to begin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
