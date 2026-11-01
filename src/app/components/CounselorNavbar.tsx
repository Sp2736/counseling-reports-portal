"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, ClipboardList, Briefcase, Shield, ArrowLeftRight } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function CounselorNavbar() {
  const pathname = usePathname();
  const { requestRoleSwitch } = useDemo();

  const links = [
    { name: "Action Queue", href: "/counselor/waiting-list", icon: ClipboardList },
    { name: "Student Roster", href: "/counselor/students", icon: Users },
    { name: "Settings", href: "/counselor/profile", icon: Briefcase },
  ];

  return (
    <nav
      data-role="navigation"
      className="bg-slate-900 border-b border-slate-800 print-hidden print:hidden shadow-md sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Portal title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center group">
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-400 transition">
                <Shield className="h-5 w-5" />
              </div>
              <div className="ml-2.5">
                <span className="text-base font-black text-white tracking-tight block leading-tight">
                  Counselor Command
                </span>
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                  Faculty Center · Demo University
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-indigo-400 text-white"
                      : "border-transparent text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Role Switcher & Badges */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Faculty / Counselor
            </span>

            {/* Switch to Student button */}
            <button
              onClick={() => requestRoleSwitch("student")}
              className="inline-flex cursor-pointer items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
              title="Switch to Student role"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-200" />
              <span>Switch to Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden border-t border-slate-800 bg-slate-900 flex justify-around p-2 print-hidden print:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center p-2 rounded-md ${
                isActive ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
