// src/app/counselor/record/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BrainCircuit, AlertTriangle, Briefcase, CheckCircle, FileText, ArrowLeft } from "lucide-react";

export default function CounselorReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State for Counselor Review
  const [finalRiskLevel, setFinalRiskLevel] = useState("Low");
  const [finalActionPlan, setFinalActionPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch(`/api/counselor/records/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);
        // Pre-fill the form with the AI's suggested risk level if it exists
        if (data.ai_analysis?.risk_prediction?.risk_level) {
          setFinalRiskLevel(data.ai_analysis.risk_prediction.risk_level);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/counselor/records/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ final_risk_level: finalRiskLevel, final_action_plan: finalActionPlan }),
      });

      if (!res.ok) throw new Error("Failed to save review");

      setSuccessMessage("Review successfully completed and saved!");
      
      // Redirect back to waiting list after a short delay
      setTimeout(() => {
        router.push("/counselor/waiting-list");
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Error saving review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading AI Analysis...</div>;
  if (!record) return <div className="p-8 text-center text-red-500">Record not found.</div>;

  const ai = record.ai_analysis;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Back Button */}
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={() => router.push("/counselor/waiting-list")} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Counseling Report</h1>
            <p className="text-gray-600 mt-1">
              Student: {record?.student?.fullName || "Unknown Student"} ({record?.student?.studentId || "No ID"})
            </p>
          </div>
        </div>

        {/* AI Analysis Grid */}
        {ai && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Psychological Profile */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <BrainCircuit className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-800">Psychological Profile</h2>
              </div>
              <p className="text-sm text-gray-600 mb-2"><strong>Growth Category:</strong> {ai.psychological_profile.psychological_growth_category}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Learning Style:</strong> {ai.psychological_profile.learning_style}</p>
              <div className="mt-4">
                <span className="text-sm font-semibold text-gray-700">Dominant Traits:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ai.psychological_profile.dominant_traits.map((trait: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md">{trait}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Prediction */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className={`w-5 h-5 ${ai.risk_prediction.risk_level === 'High' ? 'text-red-500' : ai.risk_prediction.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                <h2 className="text-lg font-bold text-gray-800">Risk Assessment</h2>
              </div>
              <div className="flex items-end space-x-2 mb-4">
                <span className="text-3xl font-black text-gray-900">{ai.risk_prediction.risk_score}</span>
                <span className="text-sm text-gray-500 mb-1">/ 100 Score</span>
              </div>
              <p className="text-sm text-gray-600 mb-2"><strong>Predicted Level:</strong> {ai.risk_prediction.risk_level}</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                {ai.risk_prediction.risk_factors.map((factor: string, i: number) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>

            {/* AI Generated Findings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-800">AI Counselor Draft</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                {ai.generated_report.counselor_findings}
              </p>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Priority Interventions:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {ai.generated_report.priority_interventions.map((intervention: string, i: number) => (
                  <li key={i}>{intervention}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Official Counselor Review Form */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Official Counselor Review</h2>
          <p className="text-sm text-gray-600 mb-6">Review the AI insights above and finalize the official action plan for this student.</p>
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Assessed Risk Level</label>
              <select 
                value={finalRiskLevel}
                onChange={(e) => setFinalRiskLevel(e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Action Plan & Notes</label>
              <textarea 
                required
                rows={4}
                value={finalActionPlan}
                onChange={(e) => setFinalActionPlan(e.target.value)}
                placeholder="Detail the steps the student must take, mentoring schedules, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || record.status === "Reviewed_Completed"}
              className={`px-6 py-2 text-white rounded-md font-medium transition-colors ${
                isSubmitting || record.status === "Reviewed_Completed" ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Saving..." : record.status === "Reviewed_Completed" ? "Already Reviewed" : "Approve & Save Report"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}