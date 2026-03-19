// src/app/onboarding/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [counselorId, setCounselorId] = useState("");
  const [availableCounselors, setAvailableCounselors] = useState<{_id: string, fullName: string}[]>([]);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.role === "student") {
      fetch("/api/counselors")
        .then((res) => res.json())
        .then((data) => setAvailableCounselors(data || []))
        .catch(() => console.error("Failed to load counselors"));
    }
  }, [session]);

  if (!session?.user) return <div className="p-8 text-center text-gray-800">Loading...</div>;

  const role = session.user.role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (role === "student" && !/^\d{2}[A-Za-z]{3}\d{3}$/.test(identifier)) {
      setError("Student ID must be in the format XXCCCXXX (e.g., 23CSE102)");
      setIsLoading(false); return;
    }
    if (role === "student" && !counselorId) {
      setError("Please select a counselor.");
      setIsLoading(false); return;
    }
    if (role === "counselor" && !/^\d{4}$/.test(identifier)) {
      setError("Employee ID must be exactly 4 digits.");
      setIsLoading(false); return;
    }

    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, identifier, counselorId, role }),
      });

      if (!res.ok) throw new Error((await res.json()).error);

      // CRITICAL FIX: Explicitly tell NextAuth to update the cookie state
      await update({ isProfileComplete: true });
      
      // CRITICAL FIX: Force a hard browser navigation to clear stale caches
      if (role === "student") window.location.href = "/student/upload";
      if (role === "counselor") window.location.href = "/counselor/waiting-list";

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // UI FIX: We created a reusable input class to guarantee text visibility
  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600 mb-6 text-sm">Welcome! Please provide your details to continue.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required 
              className={inputStyles}
              placeholder="e.g., Jane Doe"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === "student" ? "Student ID" : "Employee ID"}
            </label>
            <input 
              type="text" 
              required 
              className={`${inputStyles} uppercase`}
              placeholder={role === "student" ? "e.g., 23CSE102" : "e.g., 1042"}
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
            />
          </div>

          {role === "student" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Counselor</label>
              <select 
                required 
                className={inputStyles}
                value={counselorId} 
                onChange={(e) => setCounselorId(e.target.value)}
              >
                <option value="" disabled>Select your counselor...</option>
                {availableCounselors.map((c) => (
                  <option key={c._id} value={c._id}>{c.fullName}</option>
                ))}
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {isLoading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}