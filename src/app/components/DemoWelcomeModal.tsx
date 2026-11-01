"use client";

import React, { useEffect, useState } from "react";
import { useDemo } from "@/src/lib/demo-context";
import { GraduationCap, ArrowRight, X, Sparkles, ShieldCheck } from "lucide-react";

export default function DemoWelcomeModal() {
  const { isWelcomeModalOpen, dismissWelcomeModal } = useDemo();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isWelcomeModalOpen) {
      setMounted(true);
      // Small tick for smooth fade-in
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isWelcomeModalOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        visible
          ? "bg-slate-950/70 backdrop-blur-md opacity-100"
          : "bg-slate-950/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden transform transition-all duration-500 ${
          visible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        }`}
      >
        {/* Header gradient banner */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white text-center overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={dismissWelcomeModal}
            className="absolute top-4 right-4 p-2 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span>Interactive Demo Tour</span>
          </div>

          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-950/50">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to the Demo
          </h2>
          <p className="text-indigo-200 text-sm mt-2 font-medium">
            CHARUSAT · DEPSTAR AI Counseling Platform
          </p>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Current Assigned Role: Student</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              You are currently being taken to the role of <strong>Student</strong>. As a visitor, you can review personal profiles, fill SWOT forms using our one-click dummy data button, submit reports, and view generated analysis.
            </p>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 space-y-2">
            <p className="font-semibold text-slate-900">What to experience next:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
              <li>
                Explore the <strong>BYOK Architecture</strong> brief on the welcoming home page.
              </li>
              <li>
                Submit a sample SWOT analysis as student <strong>Arjun Mehta</strong>.
              </li>
              <li>
                Click <strong>"Switch to Faculty Role"</strong> in the top navigation anytime to review the submitted report live in the counselor action queue.
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={dismissWelcomeModal}
              className="w-full cursor-pointer py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center group"
            >
              <span>Enter Portal as Student</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

