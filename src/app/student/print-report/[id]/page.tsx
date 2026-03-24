// src/app/student/print-report/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";

export default function StudentPrintReportPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const recordId =
    typeof params.id === "string" ? params.id : (params.id as string[])?.[0];

  useEffect(() => {
    fetch("/api/student/records")
      .then((res) => res.json())
      .then((data) => {
        const specificRecord = data.find((r: any) => r._id === recordId);
        setRecord(specificRecord);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [recordId]);

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500 print:hidden">
        Generating Official Document...
      </div>
    );
  if (!record)
    return (
      <div className="p-8 text-center text-red-500 print:hidden">
        Document not found.
      </div>
    );

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
        {/* Top Action Bar */}
        <div className="max-w-[800px] mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-sm border border-slate-200 font-sans">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex items-center cursor-pointer text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
          <div className="flex space-x-3 items-center">
            <span className="text-xs text-slate-400 font-mono">
              OFFICIAL FORM RENDER
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Official Form
            </button>
          </div>
        </div>

        {/* --- OFFICIAL WORD DOCUMENT CANVAS --- */}
        <div
          className="max-w-[800px] mx-auto bg-white border border-gray-300 shadow-xl p-10 print:border-none print:shadow-none print:p-0 print:max-w-none text-[13px] leading-relaxed text-black"
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
                <td className="border border-black p-2 font-bold">Semester</td>
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
                  {review?.final_risk_level
                    ? review.final_risk_level
                    : "Low / Medium / High"}
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
              <div className="mt-1 min-h-[40px] whitespace-pre-wrap">
                {review?.final_action_plan ||
                  "____________________________________________________________\n____________________________________________________________"}
              </div>
            </div>
          </div>

          <div className="font-bold text-[14px] mb-2 underline text-black">
            Counseling Meeting Record
          </div>
          <table className="w-full border-collapse border border-black mb-16 text-black">
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
                <td className="border border-black p-2 h-[40px]">{docDate}</td>
                <td className="border border-black p-2">
                  Routine SWOT Assessment & Growth Mapping
                </td>
                <td className="border border-black p-2">
                  {review ? "Review Finalized" : "Pending Review"}
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
                  <p className="font-bold text-[14px]">Student's Signature</p>
                </td>

                {/* 2. Counselor Name Block: Label top, Name at bottom */}
                <td className="border border-black p-4 w-1/3 text-center h-[120px] align-top">
                  <div className="flex flex-col h-full">
                    {/* This stays at the top */}
                    <p className="font-bold text-[14px]">Counselor Name</p>

                    {/* mt-auto pushes this to the very bottom of the flex container */}
                    <p className="font-bold text-[14px] mt-auto">
                      {record.assignedCounselor?.fullName || "Counselor Name"}
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
    </>
  );
}
