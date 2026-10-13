"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  duration?: number; // default 900ms
  className?: string;
  priority?: boolean;
}

export default function PixelReveal({
  src,
  alt,
  width,
  height,
  duration = 900,
  className = "",
}: Props) {
  const [completed, setCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // If user prefers reduced motion, skip canvas and show normal image immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCompleted(true);
      return;
    }

    let isMounted = true;
    let animId: number;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onerror = () => {
      if (isMounted) setCompleted(true);
    };

    img.onload = () => {
      if (!isMounted) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        setCompleted(true);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setCompleted(true);
        return;
      }

      // 6 progressive blocky steps: 8, 16, 32, 64, 128, and full resolution
      const steps = [8, 16, 32, 64, 128, null];
      const stepDuration = duration / steps.length;
      const startTime = performance.now();

      // Offscreen canvas for downscaling
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");

      function drawFrame(now: number) {
        if (!isMounted) return;
        const elapsed = now - startTime;
        const stepIndex = Math.min(
          steps.length - 1,
          Math.floor(elapsed / stepDuration)
        );
        const res = steps[stepIndex];

        if (res === null || elapsed >= duration) {
          // Final step complete: switch to normal crisp <img>
          setCompleted(true);
          return;
        }

        if (offCtx && ctx && canvas) {
          const aspect = height / width;
          const miniW = res;
          const miniH = Math.max(1, Math.round(res * aspect));

          offscreen.width = miniW;
          offscreen.height = miniH;
          offCtx.clearRect(0, 0, miniW, miniH);
          offCtx.drawImage(img, 0, 0, miniW, miniH);

          // Disable smoothing so enlarged pixels look sharp and blocky
          ctx.imageSmoothingEnabled = false;
          // @ts-expect-error webkit prefix fallback
          ctx.webkitImageSmoothingEnabled = false;
          // @ts-expect-error moz prefix fallback
          ctx.mozImageSmoothingEnabled = false;

          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(offscreen, 0, 0, width, height);
        }

        animId = requestAnimationFrame(drawFrame);
      }

      animId = requestAnimationFrame(drawFrame);
    };

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [src, width, height, duration]);

  if (completed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-label={alt}
      role="img"
      className={`${className} object-contain`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
