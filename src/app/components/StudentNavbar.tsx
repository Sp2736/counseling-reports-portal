// src/components/StudentNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, UploadCloud, User, LogOut, University } from "lucide-react";

export default function StudentNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/student/dashboard", icon: Home },
    { name: "Upload Report", href: "/student/upload", icon: UploadCloud },
    { name: "My Profile", href: "/student/profile", icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 print:hidden shadow-sm sticky top-0 z-50">
      {/* FIX: added 'print:hidden' to prevent navbar being printed in report while exporting */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <University className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
              Student Portal
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
                      ? "border-indigo-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Student
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Bar */}
      <div className="sm:hidden border-t border-gray-200 bg-gray-50 flex justify-around p-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
             <Link key={link.name} href={link.href} className={`flex flex-col items-center p-2 rounded-md ${isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}>
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}