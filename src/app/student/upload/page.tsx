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
    // Reset status when user starts typing again
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
      // Clear the form after successful submission
      setFormData({ semester: "", strengths: "", weaknesses: "", opportunities: "", threats: "" });
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit SWOT Analysis</h1>
        <p className="text-gray-600 mb-8">
          Fill out your details below. You can list multiple points on separate lines. Our system will analyze your responses and send them to your assigned counselor.
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
            <input
              type="number"
              id="semester"
              name="semester"
              min="1"
              max="10"
              required
              value={formData.semester}
              onChange={handleChange}
              className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g., 4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-1">Strengths</label>
              <textarea
                id="strengths"
                name="strengths"
                required
                rows={5}
                value={formData.strengths}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                placeholder="What are your key strengths? (Separate points with a new line)"
              />
            </div>
            
            <div>
              <label htmlFor="weaknesses" className="block text-sm font-medium text-gray-700 mb-1">Weaknesses</label>
              <textarea
                id="weaknesses"
                name="weaknesses"
                required
                rows={5}
                value={formData.weaknesses}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                placeholder="What areas need improvement? (Separate points with a new line)"
              />
            </div>
            
            <div>
              <label htmlFor="opportunities" className="block text-sm font-medium text-gray-700 mb-1">Opportunities</label>
              <textarea
                id="opportunities"
                name="opportunities"
                required
                rows={5}
                value={formData.opportunities}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                placeholder="What opportunities are available to you right now?"
              />
            </div>
            
            <div>
              <label htmlFor="threats" className="block text-sm font-medium text-gray-700 mb-1">Threats</label>
              <textarea
                id="threats"
                name="threats"
                required
                rows={5}
                value={formData.threats}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                placeholder="What challenges or obstacles do you face?"
              />
            </div>
          </div>

          {uploadStatus === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">Analysis submitted successfully!</p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isSubmitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
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