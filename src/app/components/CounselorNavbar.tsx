// src/components/CounselorNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Users, ClipboardList, Briefcase, LogOut, Shield } from "lucide-react";

export default function CounselorNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/counselor/waiting-list", icon: ClipboardList },
    { name: "Student Roster", href: "/counselor/students", icon: Users },
    { name: "Settings", href: "/counselor/profile", icon: Briefcase },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold text-white tracking-tight hidden sm:block">
              Counselor Command
            </span>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "border-indigo-400 text-white" 
                      : "border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200 border border-indigo-700">
              Staff
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex items-center justify-center cursor-pointer p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Bar */}
      <div className="sm:hidden border-t border-slate-800 bg-slate-900 flex justify-around p-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
             <Link key={link.name} href={link.href} className={`flex flex-col items-center p-2 rounded-md ${isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}