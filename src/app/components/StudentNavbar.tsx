"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UploadCloud, User, University, ArrowLeftRight } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";

export default function StudentNavbar() {
  const pathname = usePathname();
  const { requestRoleSwitch } = useDemo();

  const links = [
    { name: "Dashboard", href: "/student/dashboard", icon: Home },
    { name: "New Report", href: "/student/upload", icon: UploadCloud },
    { name: "My Profile", href: "/student/profile", icon: User },
  ];

  return (
    <nav
      data-role="navigation"
      className="bg-white border-b border-gray-200 print-hidden print:hidden shadow-sm sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Portal title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center group">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition">
                <University className="h-5 w-5" />
              </div>
              <div className="ml-2.5">
                <span className="text-base font-black text-gray-900 tracking-tight block leading-tight">
                  Student Portal
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">
                  DEMO UNIVERSITY MATRIX
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
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Role Switcher & Badges */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-1.5"></span>
              Student Role
            </span>

            {/* Switch to Faculty button */}
            <button
              onClick={() => requestRoleSwitch("counselor")}
              className="inline-flex cursor-pointer items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
              title="Switch to Faculty / Counselor role"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-300" />
              <span>Switch to Faculty</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50 flex justify-around p-2 print-hidden print:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center p-2 rounded-md ${
                isActive ? "text-indigo-600 font-bold" : "text-gray-500 hover:text-gray-900"
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
