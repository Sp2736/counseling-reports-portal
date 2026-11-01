"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/src/lib/demo-context";
import { Users, GraduationCap, ArrowRight, X, AlertCircle } from "lucide-react";

export default function DemoRoleSwitchModal() {
  const router = useRouter();
  const {
    role,
    isRoleSwitchModalOpen,
    targetRoleToSwitch,
    confirmRoleSwitch,
    cancelRoleSwitch,
  } = useDemo();

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isRoleSwitchModalOpen) {
      setMounted(true);
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isRoleSwitchModalOpen]);

  if (!mounted) return null;

  const destinationRole = targetRoleToSwitch || (role === "student" ? "counselor" : "student");
  const destinationTitle = destinationRole === "counselor" ? "Faculty / Counselor" : "Student";
  const currentTitle = role === "student" ? "Student" : "Faculty / Counselor";

  const handleConfirm = () => {
    setIsTransitioning(true);
    // Smooth fade transition
    setTimeout(() => {
      confirmRoleSwitch();
      if (destinationRole === "counselor") {
        router.push("/counselor/waiting-list");
      } else {
        router.push("/student/dashboard");
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 300);
  };

  return (
    <>
      {/* Full screen fade overlay when switching roles */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white transition-opacity duration-300">
          <div className="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-bold">Switching to {destinationTitle} View...</p>
          <p className="text-sm text-slate-400 mt-1">Preserving all live submission data</p>
        </div>
      )}

      {/* Confirmation Dialog Box */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          visible
            ? "bg-slate-950/70 backdrop-blur-sm opacity-100"
            : "bg-slate-950/0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 ${
            visible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-3"
          }`}
        >
          {/* Top header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center space-x-2 text-slate-800 font-bold">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <span>Confirm Role Switch</span>
            </div>
            <button
              onClick={cancelRoleSwitch}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center space-x-3 py-3 px-4 bg-slate-100/80 rounded-xl text-slate-700 font-semibold text-sm">
              <span className="flex items-center space-x-1.5 text-slate-600">
                {role === "student" ? (
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Users className="w-4 h-4 text-indigo-600" />
                )}
                <span>{currentTitle}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="flex items-center space-x-1.5 text-indigo-600 font-bold">
                {destinationRole === "counselor" ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <GraduationCap className="w-4 h-4" />
                )}
                <span>{destinationTitle}</span>
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to switch your active portal view to <strong>{destinationTitle}</strong>?
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 leading-relaxed font-medium">
              💡 <strong>Session Preserved:</strong> Any student SWOT analysis you submitted in this session is safely stored in memory and will appear immediately in the counselor action queue.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={cancelRoleSwitch}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition cursor-pointer flex items-center space-x-1.5"
              >
                <span>Confirm Switch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

