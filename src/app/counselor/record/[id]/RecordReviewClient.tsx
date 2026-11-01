"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Save, FileText, Printer } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";
import { INITIAL_PIPELINE_RECORDS } from "@/src/lib/demo-data";

export default function RecordReviewClient({ id }: { id: string }) {
  const router = useRouter();
  const { getRecordById, approveRecord } = useDemo();

  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [riskLevel, setRiskLevel] = useState("Low");
  const [actionPlan, setActionPlan] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const found = getRecordById(id) || INITIAL_PIPELINE_RECORDS[1];
    setRecord(found);
    if (found?.counselor_review) {
      setRiskLevel(found.counselor_review.final_risk_level || "Low");
      setActionPlan(found.counselor_review.final_action_plan || "");
    } else if (found?.ai_analysis) {
      setRiskLevel(found.ai_analysis.risk_prediction?.risk_level || "Medium");
      setActionPlan(
        found.ai_analysis.generated_report?.priority_interventions?.length
          ? "- " + found.ai_analysis.generated_report.priority_interventions.join("\n- ")
          : ""
      );
    }
    setIsLoading(false);
  }, [id, getRecordById]);

  const handleAutoFillWithAI = () => {
    if (!record?.ai_analysis) return;
    const ai = record.ai_analysis;
    setRiskLevel(ai.risk_prediction?.risk_level || "Low");
    setActionPlan(
      ai.generated_report?.priority_interventions?.length
        ? "- " + ai.generated_report.priority_interventions.join("\n- ")
        : "Regular progress review recommended."
    );
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      approveRecord(id, riskLevel, actionPlan);
      setIsSaving(false);
      alert("Official Document successfully finalized and shared with the student!");
      router.push("/counselor/waiting-list");
    }, 350);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 print:hidden text-sm sm:text-base font-medium">
        Loading Document...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-8 text-center text-red-500 print:hidden text-sm sm:text-base font-medium">
        Record not found.
      </div>
    );
  }

  if (record.status === "Pending_AI") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-50 rounded-full inline-block">
              <Bot className="w-10 h-10 text-yellow-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">AI Analysis in Progress</h2>
          <p className="text-slate-600 text-sm">
            Background diagnostic systems are currently generating the report for {record.student?.fullName || "this student"}.
          </p>
          <button
            onClick={() => router.push("/counselor/waiting-list")}
            className="mt-6 inline-flex items-center px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8 pb-24 sm:pb-8 print:bg-white print:p-0">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 print:space-y-0">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden font-sans gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full md:w-auto">
              <button
                onClick={() => router.push("/counselor/waiting-list")}
                className="p-1.5 sm:p-2 bg-slate-50 rounded-full hover:bg-slate-100 cursor-pointer transition shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  Live Document Review
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate">
                  Student: {record.student?.fullName || "Student"} ({record.student?.studentId})
                </p>
              </div>
            </div>

            <div className="flex w-full md:w-auto space-x-2 sm:space-x-3">
              {isReviewed ? (
                <button
                  onClick={() => window.print()}
                  className="w-full md:w-auto cursor-pointer flex items-center justify-center bg-indigo-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-sm sm:text-base font-bold hover:bg-indigo-700 transition shadow-sm"
                >
                  <Printer className="w-4 h-4 mr-1.5 sm:mr-2" /> Print Official Form
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAutoFillWithAI}
                    className="flex-1 md:flex-none flex cursor-pointer items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base font-bold transition border border-indigo-200"
                  >
                    <Bot className="w-4 h-4 mr-1.5" /> Auto-Fill AI
                  </button>
                  <button
                    onClick={handleSaveReview}
                    disabled={isSaving}
                    className="flex-1 md:flex-none cursor-pointer flex items-center justify-center text-white px-3 py-2 sm:px-6 sm:py-2 rounded-xl text-sm sm:text-base font-bold transition shadow-sm bg-slate-900 hover:bg-slate-800"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    {isSaving ? "Finalizing..." : "Approve & Sign"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start print:block">
            {/* Left Column: Raw text & AI diagnostic summary */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:sticky lg:top-24 print:hidden font-sans">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 sm:mb-3 flex items-center uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-slate-500" />
                  Raw Student Submission
                </h2>
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl text-xs text-slate-700 whitespace-pre-wrap h-[150px] sm:h-[240px] overflow-y-auto border border-slate-100 font-mono leading-relaxed">
                  {record.original_submitted_text || "No raw text available."}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 sm:mb-3 flex items-center uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-indigo-600" />
                  Simulated AI Diagnostic
                </h2>
                {ai ? (
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-wider">
                        Calculated Risk Factor
                      </p>
                      <p
                        className={`font-black text-base mt-0.5 ${
                          ai.risk_prediction?.risk_level === "High"
                            ? "text-red-600"
                            : ai.risk_prediction?.risk_level === "Medium"
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {ai.risk_prediction?.risk_level} (Score: {ai.risk_prediction?.risk_score}/10)
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-wider mb-1">
                        Vulnerability Flags
                      </p>
                      <ul className="list-disc list-inside text-slate-700 text-xs space-y-1">
                        {ai.risk_prediction?.risk_factors?.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs">Diagnostic not available.</p>
                )}
              </div>
            </div>

            {/* Right Column: Printable Official University Form */}
            <div
              className="lg:col-span-8 bg-white border border-gray-300 shadow-xl p-4 sm:p-8 md:p-10 text-[11px] sm:text-[13px] leading-relaxed text-black w-full overflow-x-auto print:overflow-visible print:col-span-12 print:border-none print:shadow-none print:p-0 print:max-w-none"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              <div className="min-w-[600px] print:min-w-0">
                <div className="text-center mb-4 sm:mb-6 text-black">
                  <h1 className="font-bold text-[13px] sm:text-[15px] uppercase">
                    CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
                  </h1>
                  <h2 className="font-bold text-[12px] sm:text-[14px] uppercase mt-1">
                    DEVANG PATEL INSTITUTE OF ADVANCE TECHNOLOGY AND RESEARCH (DEPSTAR)
                  </h2>
                  <h3 className="font-bold text-[12px] sm:text-[14px] mt-3 sm:mt-4">
                    Student Counseling – SWOT Analysis Form
                  </h3>
                </div>

                <table className="w-full border-collapse border border-black mb-5 sm:mb-6 text-black">
                  <tbody>
                    <tr>
                      <td className="border border-black p-1.5 sm:p-2 font-bold w-[20%]">Student ID</td>
                      <td className="border border-black p-1.5 sm:p-2 w-[30%]">
                        {record.student?.studentId || "24DCS088"}
                      </td>
                      <td className="border border-black p-1.5 sm:p-2 font-bold w-[20%]">Student Name</td>
                      <td className="border border-black p-1.5 sm:p-2 w-[30%]">
                        {record.student?.fullName || "Arjun Mehta"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1.5 sm:p-2 font-bold">Semester</td>
                      <td className="border border-black p-1.5 sm:p-2">
                        {record.student?.semester || "4"}
                      </td>
                      <td className="border border-black p-1.5 sm:p-2 font-bold">Department</td>
                      <td className="border border-black p-1.5 sm:p-2">
                        {record.student?.department || "DCS"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1.5 sm:p-2 font-bold">Date</td>
                      <td className="border border-black p-1.5 sm:p-2">{docDate}</td>
                      <td className="border border-black p-1.5 sm:p-2 font-bold">Risk Level</td>
                      <td className="border border-black p-1.5 sm:p-2 bg-slate-50 print:bg-transparent">
                        {!isReviewed ? (
                          <select
                            value={riskLevel}
                            onChange={(e) => setRiskLevel(e.target.value)}
                            className="w-full focus:outline-none bg-transparent text-[11px] sm:text-[13px] font-bold text-black cursor-pointer"
                            style={{ fontFamily: "Cambria, Georgia, serif" }}
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        ) : (
                          record.counselor_review?.final_risk_level || "Low"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="font-bold text-[12px] sm:text-[14px] mb-1.5 sm:mb-2 text-black">
                  SWOT Analysis
                </div>
                <table className="w-full border-collapse border border-black mb-5 sm:mb-6 table-fixed text-black">
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 sm:p-3 w-1/2 align-top">
                        <div className="font-bold mb-1.5 sm:mb-2">Strengths</div>
                        <ul className="list-disc pl-4 sm:pl-5 m-0 space-y-0.5">
                          {swot.strengths?.length > 0 ? (
                            swot.strengths.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))
                          ) : (
                            <li>_________________________</li>
                          )}
                        </ul>
                      </td>
                      <td className="border border-black p-2 sm:p-3 w-1/2 align-top">
                        <div className="font-bold mb-1.5 sm:mb-2">Weaknesses</div>
                        <ul className="list-disc pl-4 sm:pl-5 m-0 space-y-0.5">
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
                      <td className="border border-black p-2 sm:p-3 w-1/2 align-top">
                        <div className="font-bold mb-1.5 sm:mb-2">Opportunities</div>
                        <ul className="list-disc pl-4 sm:pl-5 m-0 space-y-0.5">
                          {swot.opportunities?.length > 0 ? (
                            swot.opportunities.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))
                          ) : (
                            <li>_________________________</li>
                          )}
                        </ul>
                      </td>
                      <td className="border border-black p-2 sm:p-3 w-1/2 align-top">
                        <div className="font-bold mb-1.5 sm:mb-2">Threats</div>
                        <ul className="list-disc pl-4 sm:pl-5 m-0 space-y-0.5">
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

                <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4 text-black">
                  <div>
                    <span className="font-bold text-[14px]">Counselor Findings: </span>
                    <br />
                    <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                      {ai?.generated_report?.counselor_findings ||
                        "Student displays solid technical acumen with situational stress requiring mentorship."}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-[14px]">Outcome / Action Plan: </span>
                    <br />
                    {!isReviewed ? (
                      <textarea
                        rows={5}
                        value={actionPlan}
                        onChange={(e) => setActionPlan(e.target.value)}
                        placeholder="Click 'Auto-Fill AI' or enter official interventions here..."
                        className="w-full mt-1 p-2 sm:p-3 border border-indigo-300 focus:outline-none focus:ring-1 focus:ring-black bg-indigo-50/30 print:border-black print:bg-transparent text-black text-[11px] sm:text-[13px] resize-none"
                        style={{ fontFamily: "Cambria, Georgia, serif" }}
                      />
                    ) : (
                      <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                        {record.counselor_review?.final_action_plan ||
                          "- Scheduled bi-weekly mentoring review."}
                      </div>
                    )}
                  </div>
                </div>

                <div className="font-bold text-[12px] sm:text-[14px] mb-1.5 sm:mb-2 text-black">
                  Counseling Meeting Record
                </div>
                <table className="w-full border-collapse border border-black mb-8 sm:mb-12 text-black">
                  <thead>
                    <tr>
                      <th className="border border-black p-1.5 sm:p-2 font-bold text-left w-1/4">Date</th>
                      <th className="border border-black p-1.5 sm:p-2 font-bold text-left w-1/2">Discussion</th>
                      <th className="border border-black p-1.5 sm:p-2 font-bold text-left w-1/4">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-1.5 sm:p-2 h-[35px] sm:h-[40px]">{docDate}</td>
                      <td className="border border-black p-1.5 sm:p-2">Review of SWOT disclosures & academic trajectory</td>
                      <td className="border border-black p-1.5 sm:p-2">Intervention plan approved</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse border border-black mt-6 sm:mt-8 text-black table-fixed break-inside-avoid">
                  <tbody>
                    <tr>
                      <td className="border border-black p-3 sm:p-4 w-1/3 align-top text-center h-[90px] sm:h-[120px]">
                        <p className="font-bold text-[12px] sm:text-[14px]">Student Signature</p>
                      </td>

                      <td className="border border-black p-3 sm:p-4 w-1/3 text-center h-[90px] sm:h-[120px] align-top">
                        <div className="flex flex-col h-full">
                          <p className="font-bold text-[12px] sm:text-[14px]">Counselor Name</p>
                          <p className="font-bold text-[12px] sm:text-[14px] mt-auto truncate px-1">
                            {record.assignedCounselor?.fullName || "Dr. Priya Sharma"}
                          </p>
                        </div>
                      </td>

                      <td className="border border-black p-3 sm:p-4 w-1/3 align-top text-center h-[90px] sm:h-[120px]">
                        <p className="font-bold text-[12px] sm:text-[14px]">Counselor Signature</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

