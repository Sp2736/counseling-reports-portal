// src/app/counselor/record/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Save, FileText, Printer } from "lucide-react";

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
      `${ai.generated_report?.priority_interventions?.join("\n- ") || "N/A"}`,
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
      <div className="p-8 text-center text-slate-500 print:hidden">
        Generating Live Document...
      </div>
    );
  if (!record)
    return (
      <div className="p-8 text-center text-red-500 print:hidden">
        Record not found.
      </div>
    );

  const ai = record.ai_analysis;
  const swot = record.swot_input || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };
  const isReviewed = record.status === "Reviewed_Completed";
  const docDate = new Date(record.createdAt).toLocaleDateString("en-GB");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
        }
      `,
        }}
      />

      <div className="min-h-screen bg-slate-100 p-6 md:p-8 print:bg-white print:p-0">
        <div className="max-w-7xl mx-auto space-y-6 print:space-y-0">
          <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden font-sans">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <button
                onClick={() => router.push("/counselor/waiting-list")}
                className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Live Document Review
                </h1>
                <p className="text-sm text-slate-600">
                  Student: {record.student?.fullName || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex space-x-3 w-full md:w-auto">
              {isReviewed ? (
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4 mr-2" /> Print Record
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAutoFillWithAI}
                    className="group flex-1 md:flex-none flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors border border-indigo-200 cursor-pointer"
                  >
                    <Bot className="w-4 h-4 mr-2" /> Auto-Fill
                  </button>
                  <button
                    onClick={handleSaveReview}
                    disabled={isSaving}
                    className={`flex cursor-pointer items-center justify-center text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm ${
                      isSaving
                        ? "bg-slate-600 animate-pulse cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    <Save className="w-4 h-4 mr-2" />{" "}
                    {isSaving ? "Finalizing..." : "Approve & Share"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
            <div className="lg:col-span-4 space-y-6 sticky top-24 print:hidden font-sans">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center uppercase tracking-wider">
                  <FileText className="w-4 h-4 mr-2 text-slate-500" /> Raw
                  Student Text
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

            <div
              className="lg:col-span-8 bg-white border border-gray-300 shadow-xl p-8 md:p-10 text-[13px] leading-relaxed text-black w-full print:col-span-12 print:border-none print:shadow-none print:p-0 print:max-w-none"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              <div className="text-center mb-6 text-black">
                <h1 className="font-bold text-[15px] uppercase">
                  CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
                </h1>
                <h2 className="font-bold text-[14px] uppercase mt-1">
                  DEVANG PATEL INSTITUTE OF ADVANCE TECHNOLOGY AND RESEARCH
                  (DEPSTAR)
                </h2>
                <h3 className="font-bold text-[14px] underline mt-4">
                  Student Counseling – SWOT Analysis Form
                </h3>
              </div>

              <table className="w-full border-collapse border border-black mb-6 text-black">
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-bold w-[20%]">
                      Student ID
                    </td>
                    <td className="border border-black p-2 w-[30%]">
                      {record.student?.studentId || "________________"}
                    </td>
                    <td className="border border-black p-2 font-bold w-[20%]">
                      Student Name
                    </td>
                    <td className="border border-black p-2 w-[30%]">
                      {record.student?.fullName || "________________"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold">
                      Semester
                    </td>
                    <td className="border border-black p-2">
                      {record.student?.semester || ""}
                    </td>
                    <td className="border border-black p-2 font-bold">
                      Department
                    </td>
                    <td className="border border-black p-2">
                      {record.student?.department || "________________"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold">Date</td>
                    <td className="border border-black p-2">{docDate}</td>
                    <td className="border border-black p-2 font-bold">
                      Risk Level
                    </td>
                    <td className="border border-black p-2">
                      {!isReviewed ? (
                        <select
                          value={riskLevel}
                          onChange={(e) => setRiskLevel(e.target.value)}
                          className="w-full focus:outline-none bg-transparent text-[13px] font-bold text-black cursor-pointer"
                          style={{ fontFamily: "Cambria, Georgia, serif" }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      ) : (
                        record.counselor_review?.final_risk_level ||
                        "Low / Medium / High"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center font-bold text-[14px] underline mb-2 text-black">
                SWOT Analysis
              </div>
              <table className="w-full border-collapse border border-black mb-6 table-fixed text-black">
                <tbody>
                  <tr>
                    <td className="border border-black p-3 w-1/2 align-top">
                      <div className="font-bold mb-2">Strengths</div>
                      <ul className="list-disc pl-5 m-0">
                        {swot.strengths?.length > 0 ? (
                          swot.strengths.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>_________________________</li>
                        )}
                      </ul>
                    </td>
                    <td className="border border-black p-3 w-1/2 align-top">
                      <div className="font-bold mb-2">Weaknesses</div>
                      <ul className="list-disc pl-5 m-0">
                        {swot.weaknesses?.length > 0 ? (
                          swot.weaknesses.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>_________________________</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-3 w-1/2 align-top">
                      <div className="font-bold mb-2">Opportunities</div>
                      <ul className="list-disc pl-5 m-0">
                        {swot.opportunities?.length > 0 ? (
                          swot.opportunities.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>_________________________</li>
                        )}
                      </ul>
                    </td>
                    <td className="border border-black p-3 w-1/2 align-top">
                      <div className="font-bold mb-2">Threats</div>
                      <ul className="list-disc pl-5 m-0">
                        {swot.threats?.length > 0 ? (
                          swot.threats.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>_________________________</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mb-8 space-y-4 text-black">
                <div>
                  <span className="font-bold">Counselor Findings: </span>
                  <br />
                  <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                    {ai?.generated_report?.counselor_findings ||
                      "____________________________________________________________\n____________________________________________________________"}
                  </div>
                </div>
                <div>
                  <span className="font-bold">Outcome / Action Plan: </span>
                  <br />
                  {!isReviewed ? (
                    <textarea
                      rows={4}
                      value={actionPlan}
                      onChange={(e) => setActionPlan(e.target.value)}
                      placeholder="Click the 'Auto-Fill' button above, or type your official interventions here..."
                      className="w-full mt-1 p-3 border border-black focus:outline-none focus:ring-1 focus:ring-black bg-transparent text-black text-[13px] resize-none"
                      style={{ fontFamily: "Cambria, Georgia, serif" }}
                    />
                  ) : (
                    <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                      {record.counselor_review?.final_action_plan ||
                        "____________________________________________________________\n____________________________________________________________"}
                    </div>
                  )}
                </div>
              </div>

              <div className="font-bold text-[14px] mb-2 underline text-black">
                Counseling Meeting Record
              </div>
              <table className="w-full border-collapse border border-black mb-12 text-black">
                <thead>
                  <tr>
                    <th className="border border-black p-2 font-bold text-left w-1/4">
                      Date
                    </th>
                    <th className="border border-black p-2 font-bold text-left w-1/2">
                      Discussion
                    </th>
                    <th className="border border-black p-2 font-bold text-left w-1/4">
                      Action Taken
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 h-[40px]">
                      {docDate}
                    </td>
                    <td className="border border-black p-2">
                      Routine SWOT Assessment & Growth Mapping
                    </td>
                    <td className="border border-black p-2">
                      {isReviewed ? "Review Finalized" : "Pending Approval"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* THE FIX: STRICT TABLE LAYOUT FOR SIGNATURES */}
              <table className="w-full border-collapse border border-black mt-8 text-black table-fixed break-inside-avoid">
                <tbody>
                  <tr>
                    {/* 1. Student Block: Name High, Space for Signature Below */}
                    <td className="border border-black p-4 w-1/3 align-top text-center h-[120px]">
                      <p className="font-bold text-[14px]">
                        Student's Signature
                      </p>
                    </td>

                    {/* 2. Counselor Name Block: Label top, Name at bottom */}
                    <td className="border border-black p-4 w-1/3 text-center h-[120px] align-top">
                      <div className="flex flex-col h-full">
                        {/* This stays at the top */}
                        <p className="font-bold text-[14px]">Counselor Name</p>

                        {/* mt-auto pushes this to the very bottom of the flex container */}
                        <p className="font-bold text-[14px] mt-auto">
                          {record.assignedCounselor?.fullName ||
                            "Counselor Name"}
                        </p>
                      </div>
                    </td>

                    {/* 3. Counselor Signature Block: Blank Space for Pen Signature */}
                    <td className="border border-black p-4 w-1/3 align-top text-center h-[120px]">
                      <p className="font-bold text-[14px]">
                        Signature of Counselor
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
