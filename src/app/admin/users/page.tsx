// src/app/admin/users/page.tsx
"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user.");
      }

      setStatus("success");
      setMessage(data.message);
      
      // Clear form on success
      setEmail("");
      setPassword("");
      setRole("student");

    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Provision new accounts for the platform.</p>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-5 sm:mb-6 border-b border-gray-100 pb-4">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Add New User</h2>
          </div>

          {status === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-green-800">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-red-800">{message}</p>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className={inputStyles}
                  placeholder="user@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input 
                  type="password" 
                  required 
                  className={inputStyles}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Assign Role</label>
              <select 
                className={inputStyles}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student (Requires Profile Setup)</option>
                <option value="counselor">Counselor (Requires Profile Setup)</option>
                <option value="admin">System Admin (Full Access)</option>
              </select>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors text-sm sm:text-base flex justify-center items-center cursor-pointer"
              >
                {status === "loading" ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}