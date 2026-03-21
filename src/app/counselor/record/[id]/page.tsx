// src/app/counselor/record/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Save,
  CheckCircle,
  University,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function CounselorRecordReview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [riskLevel, setRiskLevel] = useState("Low");
  const [actionPlan, setActionPlan] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/counselor/records/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);
        if (data.counselor_review) {
          setRiskLevel(data.counselor_review.final_risk_level || "Low");
          setActionPlan(data.counselor_review.final_action_plan || "");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [resolvedParams.id]);

  const handleAutoFillWithAI = () => {
    if (!record?.ai_analysis) return;
    const ai = record.ai_analysis;
    setRiskLevel(ai.risk_prediction?.risk_level || "Low");
    setActionPlan(
      `Counselor Findings:\n${ai.generated_report?.counselor_findings || "N/A"}\n\n` +
        `Recommended Interventions:\n${ai.generated_report?.priority_interventions?.join("\n- ") || "N/A"}`,
    );
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/counselor/records/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          final_risk_level: riskLevel,
          final_action_plan: actionPlan,
        }),
      });

      if (!res.ok) throw new Error("Failed to save review.");

      alert(
        "Official Document successfully finalized and shared with the student!",
      );
      router.push("/counselor/waiting-list");
    } catch (error) {
      alert("Error saving review.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">
        Generating Live Document...
      </div>
    );
  if (!record)
    return (
      <div className="p-8 text-center text-red-500">Record not found.</div>
    );

  const ai = record.ai_analysis;
  const swot = record.swot_input || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };
  const isReviewed = record.status === "Reviewed_Completed";

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => router.push("/counselor/waiting-list")}
              className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Live Document Review
              </h1>
              <p className="text-sm text-slate-600">
                Student: {record.student?.fullName || "Unknown"} | Cycle:{" "}
                {record.report_period || 1}
              </p>
            </div>
          </div>

          <div className="flex space-x-3 w-full md:w-auto">
            {!isReviewed && (
              <button
                type="button"
                onClick={handleAutoFillWithAI}
                className="group flex-1 md:flex-none flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out border border-indigo-200"
              >
                <Bot className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:animate-bounce" />{" "}
                Auto-Fill Document
              </button>
            )}
            {!isReviewed && (
              <button
                onClick={handleSaveReview}
                disabled={isSaving}
                className={`group flex-1 md:flex-none flex items-center justify-center text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out shadow-sm ${
                  isSaving
                    ? "bg-slate-600 animate-pulse cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                }`}
              >
                <Save
                  className={`w-4 h-4 mr-2 transition-transform duration-300 ${isSaving ? "" : "group-hover:scale-110"}`}
                />
                {isSaving ? "Finalizing..." : "Approve & Share"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Reference Materials */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center uppercase tracking-wider">
                <FileText className="w-4 h-4 mr-2 text-slate-500" /> Raw Student
                Text
              </h2>
              <div className="bg-slate-50 p-4 rounded-md text-xs text-slate-700 whitespace-pre-wrap h-[300px] overflow-y-auto border border-slate-100 font-mono leading-relaxed">
                {record.original_submitted_text || "No raw text available."}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center uppercase tracking-wider">
                <Bot className="w-4 h-4 mr-2 text-indigo-600" /> AI Diagnostic
                Summary
              </h2>
              {ai ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                      Calculated Risk Factor
                    </p>
                    <p
                      className={`font-bold mt-1 ${ai.risk_prediction?.risk_level === "High" ? "text-red-600" : "text-slate-900"}`}
                    >
                      {ai.risk_prediction?.risk_level} (Score:{" "}
                      {ai.risk_prediction?.risk_score}/10)
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      Key Flags
                    </p>
                    <ul className="list-disc list-inside text-slate-700 text-xs space-y-1">
                      {ai.risk_prediction?.risk_factors?.map(
                        (f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  Diagnostic not available.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive A4 Document Preview */}
          <div className="lg:col-span-8 bg-white border border-gray-300 shadow-xl p-8 md:p-12 text-black max-w-[800px] mx-auto w-full">
            {/* Document Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <University className="w-8 h-8 text-slate-900" />
                  <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                    Student Counseling
                  </h1>
                </div>
                {/* NEW: Updated Sub-Title */}
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  SWOT Analysis Report
                </h2>
              </div>
              <div className="text-right text-xs text-slate-600 space-y-1.5 font-mono">
                <p>
                  <span className="font-bold text-slate-400">REPORT ID:</span>{" "}
                  {record._id.substring(0, 8).toUpperCase()}
                </p>
                <p>
                  <span className="font-bold text-slate-400">STUDENT ID:</span>{" "}
                  {record.student?.studentId}
                </p>
                <p>
                  <span className="font-bold text-slate-400">
                    DATE OF APPROVAL:
                  </span>{" "}
                  {new Date(record.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {isReviewed && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-800 mb-1">
                    Document Status
                  </p>
                  <p className="text-sm font-bold text-green-900">
                    Reviewed & Finalized
                  </p>
                </div>
                <ShieldCheck className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            )}

            <div className="space-y-10">
              <section>
                <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 text-slate-900 flex items-center">
                  <span className="bg-slate-900 text-white w-5 h-5 inline-flex items-center justify-center rounded-full mr-2 text-[10px]">
                    1
                  </span>
                  Self-Assessment Data
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2 text-xs uppercase">
                      Strengths
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {swot.strengths?.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-2 text-xs uppercase">
                      Weaknesses
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {swot.weaknesses?.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {ai && (
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 text-slate-900 flex items-center">
                    <span className="bg-slate-900 text-white w-5 h-5 inline-flex items-center justify-center rounded-full mr-2 text-[10px]">
                      2
                    </span>
                    Psychological & Growth Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm bg-slate-50 p-5 rounded-md border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Learning Style
                      </p>
                      <p className="text-slate-800 font-medium">
                        {ai.psychological_profile?.learning_style}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Growth Category
                      </p>
                      <p className="text-slate-800 font-medium">
                        {
                          ai.psychological_profile
                            ?.psychological_growth_category
                        }
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <section className="break-inside-avoid">
                <h3 className="text-sm font-black uppercase tracking-widest border-b border-indigo-200 pb-2 mb-4 text-indigo-900 flex items-center">
                  <span className="bg-indigo-600 text-white w-5 h-5 inline-flex items-center justify-center rounded-full mr-2 text-[10px]">
                    3
                  </span>
                  Official Action Plan (Counselor Input)
                </h3>

                <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-lg space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-2">
                      Final Assessed Risk Level
                    </label>
                    <select
                      className={`w-full md:w-1/2 px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 text-sm font-bold uppercase transition-colors ${riskLevel === "High" || riskLevel === "Critical" ? "border-red-300 bg-red-50 text-red-700" : "border-indigo-200 bg-white text-indigo-900"}`}
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value)}
                      disabled={isReviewed}
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                      <option value="Critical">
                        Critical Intervention Required
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-2">
                      Prescribed Interventions & Notes
                    </label>
                    <textarea
                      rows={8}
                      required
                      placeholder="Click 'Auto-Fill Document' to generate insights, or type your official interventions here..."
                      className="w-full px-4 py-3 border border-indigo-200 rounded-md bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
                      value={actionPlan}
                      onChange={(e) => setActionPlan(e.target.value)}
                      disabled={isReviewed}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* NEW: Updated Footer Layout */}
            <div className="mt-16 pt-6 flex justify-between items-end opacity-60">
              {/* Student Signature Block */}
              <div className="text-center w-1/3">
                <div className="w-full border-b border-slate-400 mb-2"></div>

                <p className="text-[10px] text-slate-800 font-bold mt-1 uppercase truncate">
                  {record.student?.fullName || "Student"}'s Signature
                </p>
              </div>

              {/* Counselor Signature Block */}
              <div className="text-center w-1/3">
                <div className="w-full border-b border-slate-400 mb-2"></div>

                <p className="text-[10px] text-slate-800 font-bold mt-1 uppercase truncate">
                  {record.assignedCounselor?.fullName || "Counselor"}'s
                  Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
