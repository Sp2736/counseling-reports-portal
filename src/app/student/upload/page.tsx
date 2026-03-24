// src/app/student/upload/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, AlertCircle, Send } from "lucide-react";

export default function StudentUploadPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    semester: "",
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (uploadStatus !== "idle") {
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/swot/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed");
      }

      setUploadStatus("success");
      setFormData({ semester: "", strengths: "", weaknesses: "", opportunities: "", threats: "" });
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared explicitly defined styles for inputs to override system dark-mode interference
  const inputStyles = "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm sm:text-base";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Submit SWOT Analysis</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Fill out your details below. You can list multiple points on separate lines. Our system will analyze your responses and send them to your assigned counselor.
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-5 sm:space-y-6">
          
          <div>
            <label htmlFor="semester" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Current Semester</label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label htmlFor="strengths" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Strengths</label>
              <textarea
                id="strengths"
                name="strengths"
                required
                rows={5}
                value={formData.strengths}
                onChange={handleChange}
                className={`${inputStyles} resize-y`}
                placeholder="What are your key strengths? (Separate points with a new line)"
              />
            </div>
            
            <div>
              <label htmlFor="weaknesses" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Weaknesses</label>
              <textarea
                id="weaknesses"
                name="weaknesses"
                required
                rows={5}
                value={formData.weaknesses}
                onChange={handleChange}
                className={`${inputStyles} resize-y`}
                placeholder="What areas need improvement? (Separate points with a new line)"
              />
            </div>
            
            <div>
              <label htmlFor="opportunities" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Opportunities</label>
              <textarea
                id="opportunities"
                name="opportunities"
                required
                rows={5}
                value={formData.opportunities}
                onChange={handleChange}
                className={`${inputStyles} resize-y`}
                placeholder="What opportunities are available to you right now?"
              />
            </div>
            
            <div>
              <label htmlFor="threats" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Threats</label>
              <textarea
                id="threats"
                name="threats"
                required
                rows={5}
                value={formData.threats}
                onChange={handleChange}
                className={`${inputStyles} resize-y`}
                placeholder="What challenges or obstacles do you face?"
              />
            </div>
          </div>

          {uploadStatus === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              <p className="text-sm text-green-700 font-medium">Analysis submitted successfully!</p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto flex justify-center items-center px-6 py-3 sm:py-2.5 rounded-lg text-white font-bold transition-colors text-sm sm:text-base ${
                isSubmitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              }`}
            >
              {isSubmitting ? "Processing Data..." : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}