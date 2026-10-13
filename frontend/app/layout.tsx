import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerdictAI — Swarm Debugger for Python",
  description:
    "Adversarial multi-agent debugging for Python code. Prosecutor, Defender, and Judge resolve code flaws through multi-perspective analysis and verified execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        {children}
      </body>
    </html>
  );
}
