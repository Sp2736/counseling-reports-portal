"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, Bot } from "lucide-react";
import { useDemo } from "@/src/lib/demo-context";
import { INITIAL_PIPELINE_RECORDS } from "@/src/lib/demo-data";

function PrintReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { getRecordById } = useDemo();

  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const found = (id ? getRecordById(id) : null) || INITIAL_PIPELINE_RECORDS[0];
    setRecord(found);
    setIsLoading(false);
  }, [id, getRecordById]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 print:hidden font-medium">
        Loading Document...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-8 text-center text-red-500 print:hidden font-medium">
        Document not found.
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
          <h2 className="text-xl font-bold text-slate-900">Analysis Pending</h2>
          <p className="text-slate-600 text-sm">
            Your submission is currently in the queue for processing. It cannot be printed until it is reviewed by a counselor.
          </p>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="mt-6 inline-flex items-center px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const swot = record.swot_input || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };
  const review = record.counselor_review;
  const ai = record.ai_analysis;
  const docDate = new Date(record.createdAt).toLocaleDateString("en-GB");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `,
        }}
      />

      <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
        <div className="max-w-[800px] mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-sm border border-slate-200 font-sans">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex items-center text-slate-600 hover:text-slate-900 transition font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
          <div className="flex space-x-3 items-center">
            <span className="text-xs text-slate-400 font-mono">
              OFFICIAL FORM RENDER
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-bold shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Official Form
            </button>
          </div>
        </div>

        <div
          className="max-w-[800px] mx-auto bg-white border border-gray-300 shadow-xl p-10 print:border-none print:shadow-none print:p-0 print:max-w-none text-[13px] leading-relaxed text-black"
          style={{ fontFamily: "Cambria, Georgia, serif" }}
        >
          <div className="text-center mb-6 text-black">
            <h1 className="font-bold text-[15px] uppercase">
              CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY (CHARUSAT)
            </h1>
            <h2 className="font-bold text-[14px] uppercase mt-1">
              DEVANG PATEL INSTITUTE OF ADVANCE TECHNOLOGY AND RESEARCH (DEPSTAR)
            </h2>
            <h3 className="font-bold text-[14px] mt-4">
              Student Counseling – SWOT Analysis Form
            </h3>
          </div>

          <table className="w-full border-collapse border border-black mb-6 text-black">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold w-[20%]">Student ID</td>
                <td className="border border-black p-2 w-[30%]">
                  {record.student?.studentId || "24DCS088"}
                </td>
                <td className="border border-black p-2 font-bold w-[20%]">Student Name</td>
                <td className="border border-black p-2 w-[30%]">
                  {record.student?.fullName || "Arjun Mehta"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Semester</td>
                <td className="border border-black p-2">{record.student?.semester || "4"}</td>
                <td className="border border-black p-2 font-bold">Department</td>
                <td className="border border-black p-2">
                  {record.student?.department || "DCS"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Date</td>
                <td className="border border-black p-2">{docDate}</td>
                <td className="border border-black p-2 font-bold">Risk Level</td>
                <td className="border border-black p-2 font-bold">
                  {review?.final_risk_level || ai?.risk_prediction?.risk_level || "Low"}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="font-bold text-[14px] mb-2 text-black">SWOT Analysis</div>
          <table className="w-full border-collapse border border-black mb-6 table-fixed text-black">
            <tbody>
              <tr>
                <td className="border border-black p-3 w-1/2 align-top">
                  <div className="font-bold mb-2">Strengths</div>
                  <ul className="list-disc pl-5 m-0 space-y-0.5">
                    {swot.strengths?.length > 0 ? (
                      swot.strengths.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>Strong technical grasp and discipline</li>
                    )}
                  </ul>
                </td>
                <td className="border border-black p-3 w-1/2 align-top">
                  <div className="font-bold mb-2">Weaknesses</div>
                  <ul className="list-disc pl-5 m-0 space-y-0.5">
                    {swot.weaknesses?.length > 0 ? (
                      swot.weaknesses.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>Time management challenges</li>
                    )}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3 w-1/2 align-top">
                  <div className="font-bold mb-2">Opportunities</div>
                  <ul className="list-disc pl-5 m-0 space-y-0.5">
                    {swot.opportunities?.length > 0 ? (
                      swot.opportunities.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>Departmental project mentoring</li>
                    )}
                  </ul>
                </td>
                <td className="border border-black p-3 w-1/2 align-top">
                  <div className="font-bold mb-2">Threats</div>
                  <ul className="list-disc pl-5 m-0 space-y-0.5">
                    {swot.threats?.length > 0 ? (
                      swot.threats.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>End-semester examination pressure</li>
                    )}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mb-8 space-y-4 text-black">
            <div>
              <span className="font-bold text-[14px]">Counselor Findings: </span>
              <br />
              <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                {ai?.generated_report?.counselor_findings ||
                  "Student displays solid academic aptitude with situational pressure during presentation and examination weeks."}
              </div>
            </div>
            <div>
              <span className="font-bold text-[14px]">Outcome / Action Plan: </span>
              <br />
              <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                {review?.final_action_plan ||
                  (ai?.generated_report?.priority_interventions?.length
                    ? "- " + ai.generated_report.priority_interventions.join("\n- ")
                    : "- Regular academic check-ins scheduled.\n- Linked with peer support group.")}
              </div>
            </div>
          </div>

          <div className="font-bold text-[14px] mb-2 text-black">
            Counseling Meeting Record
          </div>
          <table className="w-full border-collapse border border-black mb-12 text-black">
            <thead>
              <tr>
                <th className="border border-black p-2 font-bold text-left w-1/4">Date</th>
                <th className="border border-black p-2 font-bold text-left w-1/2">Discussion</th>
                <th className="border border-black p-2 font-bold text-left w-1/4">Action Taken</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2 h-[40px]">{docDate}</td>
                <td className="border border-black p-2">SWOT synthesis & academic goal alignment</td>
                <td className="border border-black p-2">Intervention plan approved</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse border border-black mt-8 text-black table-fixed break-inside-avoid">
            <tbody>
              <tr>
                <td className="border border-black p-4 w-1/3 align-top text-center h-[120px]">
                  <p className="font-bold text-[14px]">Student Signature</p>
                </td>

                <td className="border border-black p-4 w-1/3 text-center h-[120px] align-top">
                  <div className="flex flex-col h-full">
                    <p className="font-bold text-[14px]">Counselor Name</p>
                    <p className="font-bold text-[14px] mt-auto">
                      {record.assignedCounselor?.fullName || "Dr. Priya Sharma"}
                    </p>
                  </div>
                </td>

                <td className="border border-black p-4 w-1/3 align-top text-center h-[120px]">
                  <p className="font-bold text-[14px]">Counselor Signature</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function StudentPrintReportPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-medium">
          Loading Document...
        </div>
      }
    >
      <PrintReportContent />
    </Suspense>
  );
}

