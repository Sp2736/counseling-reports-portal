"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Send, Sparkles, RotateCcw, ArrowRight, UserCheck } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";
import { DUMMY_SWOT_TEXT } from "@/src/lib/demo-data";

export default function StudentUploadPage() {
  const router = useRouter();
  const { studentProfile, counselorProfile, addSwotSubmission, requestRoleSwitch } = useDemo();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    semester: DUMMY_SWOT_TEXT.semester,
    strengths: DUMMY_SWOT_TEXT.strengths,
    weaknesses: DUMMY_SWOT_TEXT.weaknesses,
    opportunities: DUMMY_SWOT_TEXT.opportunities,
    threats: DUMMY_SWOT_TEXT.threats,
  });

  const handleFillDemoData = () => {
    setFormData({
      semester: DUMMY_SWOT_TEXT.semester,
      strengths: DUMMY_SWOT_TEXT.strengths,
      weaknesses: DUMMY_SWOT_TEXT.weaknesses,
      opportunities: DUMMY_SWOT_TEXT.opportunities,
      threats: DUMMY_SWOT_TEXT.threats,
    });
    setUploadStatus("idle");
  };

  const handleClear = () => {
    setFormData({
      semester: "4",
      strengths: "",
      weaknesses: "",
      opportunities: "",
      threats: "",
    });
    setUploadStatus("idle");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (uploadStatus !== "idle") {
      setUploadStatus("idle");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const id = addSwotSubmission(formData);
        setLastSubmittedId(id);
        setUploadStatus("success");
      } catch (err: any) {
        setUploadStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }, 450);
  };

  const inputStyles =
    "w-full p-3 border border-gray-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm sm:text-base";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Student Context Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Submit SWOT Analysis Form
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Active Student: <strong>{studentProfile.fullName}</strong> ({studentProfile.studentId}) · Assigned Counselor: <strong>{studentProfile.assignedCounselorName}</strong>
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleFillDemoData}
              className="cursor-pointer inline-flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              <span>Fill Sample SWOT Data</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 border border-slate-200 transition"
              title="Clear form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {uploadStatus === "success" ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-200 space-y-5">
            <div className="flex items-center space-x-3 text-emerald-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  SWOT Analysis Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  The simulated AI diagnostic pipeline has processed your submission and queued it for faculty review.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs sm:text-sm text-emerald-900 space-y-1">
              <p>
                <strong>Live Session Status:</strong> Your submission is now visible in the counselor action queue with calculated AI diagnostic metrics.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/student/dashboard")}
                className="w-full sm:w-auto cursor-pointer px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
              >
                Go to Student Dashboard
              </button>

              <button
                type="button"
                onClick={() => requestRoleSwitch("counselor")}
                className="w-full sm:w-auto cursor-pointer px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5"
              >
                <span>Switch to Faculty to Review Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
          >
            {/* Semester Input */}
            <div>
              <label htmlFor="semester" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Current Semester
              </label>
              <input
                type="number"
                id="semester"
                name="semester"
                min="1"
                max="10"
                required
                value={formData.semester}
                onChange={handleChange}
                className={`${inputStyles} md:w-1/3`}
                placeholder="e.g., 4"
              />
            </div>

            {/* 4 Quadrants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Strengths */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="strengths" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Strengths
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">1 point per line</span>
                </div>
                <textarea
                  id="strengths"
                  name="strengths"
                  required
                  rows={5}
                  value={formData.strengths}
                  onChange={handleChange}
                  className={`${inputStyles} resize-y leading-relaxed`}
                  placeholder="What are your key strengths? (Separate points with a new line)"
                />
              </div>

              {/* Weaknesses */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="weaknesses" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Weaknesses
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">1 point per line</span>
                </div>
                <textarea
                  id="weaknesses"
                  name="weaknesses"
                  required
                  rows={5}
                  value={formData.weaknesses}
                  onChange={handleChange}
                  className={`${inputStyles} resize-y leading-relaxed`}
                  placeholder="What areas need improvement? (Separate points with a new line)"
                />
              </div>

              {/* Opportunities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="opportunities" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Opportunities
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">1 point per line</span>
                </div>
                <textarea
                  id="opportunities"
                  name="opportunities"
                  required
                  rows={5}
                  value={formData.opportunities}
                  onChange={handleChange}
                  className={`${inputStyles} resize-y leading-relaxed`}
                  placeholder="What opportunities are available to you right now?"
                />
              </div>

              {/* Threats */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="threats" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Threats / Challenges
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">1 point per line</span>
                </div>
                <textarea
                  id="threats"
                  name="threats"
                  required
                  rows={5}
                  value={formData.threats}
                  onChange={handleChange}
                  className={`${inputStyles} resize-y leading-relaxed`}
                  placeholder="What challenges or obstacles do you face?"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Clicking submit invokes the simulated Gemini AI diagnostic synthesis.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl transition shadow-md shadow-indigo-600/25 text-sm sm:text-base disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Analysis...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Submit Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
