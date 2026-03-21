// src/app/student/print-report/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, University, ShieldCheck, Clock } from "lucide-react";

export default function StudentPrintReportPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const recordId = typeof params.id === 'string' ? params.id : (params.id as string[])?.[0];

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

  if (isLoading) return <div className="p-8 text-center text-slate-500 print:hidden">Generating Official Document...</div>;
  if (!record) return <div className="p-8 text-center text-red-500 print:hidden">Document not found.</div>;

  const swot = record.swot_input || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const ai = record.ai_analysis;
  const review = record.counselor_review;
  const isReviewed = record.status === "Reviewed_Completed";

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: A4; 
            margin: 15mm; /* REDUCED from 20mm to gain extra vertical space on every page! */
          }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
        }
      `}} />

      <div className="min-h-screen bg-slate-100 text-black p-4 md:p-8 font-sans print:bg-white print:p-0">
        
        {/* Top Action Bar */}
        <div className="max-w-[800px] mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <button onClick={() => router.push("/student/dashboard")} className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
          <div className="flex space-x-3 items-center">
            <span className="text-xs text-slate-400 font-mono">HIGH-DENSITY RENDER</span>
            <button 
              onClick={() => window.print()} 
              className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" /> Export to PDF
            </button>
          </div>
        </div>

        {/* --- OFFICIAL HIGH-DENSITY A4 DOCUMENT CANVAS --- */}
        <div className="max-w-[800px] mx-auto bg-white border border-gray-300 shadow-xl p-8 md:p-12 print:border-none print:shadow-none print:p-0 print:max-w-none">
          
          {/* COMPACT HEADER: Merged Title, Info, and Status Badge */}
          <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <University className="w-6 h-6 text-slate-900" />
                <h1 className="text-xl font-black tracking-tight uppercase text-slate-900 leading-none">Student Counseling Report</h1>
              </div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-8">Standardized SWOT & Growth Report</h2>
            </div>
            
            <div className="text-right text-[10px] text-slate-600 space-y-1 font-mono">
              <p><span className="font-bold text-slate-400">REPORT ID:</span> {record._id.substring(0, 8).toUpperCase()}</p>
              <p><span className="font-bold text-slate-400">STUDENT ID:</span> {record.student?.studentId || "N/A"}</p>
              <p><span className="font-bold text-slate-400">DATE:</span> {new Date(record.createdAt).toLocaleDateString()}</p>
              
              {/* Status Pill moved directly into header to save vertical space */}
              <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded border font-sans font-bold uppercase tracking-wider ${
                isReviewed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isReviewed ? <ShieldCheck className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                {isReviewed ? "Reviewed" : "Pending"}
              </div>
            </div>
          </div>

          {/* COMPACT MAIN CONTENT GRID */}
          <div className="space-y-6">

            {/* SECTION 1: Self-Assessment Data */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1.5 mb-3 text-slate-900 flex items-center">
                <span className="bg-slate-900 text-white w-4 h-4 inline-flex items-center justify-center rounded-full mr-2 text-[9px]">1</span> 
                Self-Assessment Data
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-100 break-inside-avoid">
                  <h4 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase tracking-wider">Strengths</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    {swot.strengths?.length > 0 ? swot.strengths.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                  </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100 break-inside-avoid">
                  <h4 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase tracking-wider">Weaknesses</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    {swot.weaknesses?.length > 0 ? swot.weaknesses.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                  </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100 break-inside-avoid">
                  <h4 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase tracking-wider">Opportunities</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    {swot.opportunities?.length > 0 ? swot.opportunities.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                  </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100 break-inside-avoid">
                  <h4 className="font-bold text-slate-800 mb-1.5 text-[11px] uppercase tracking-wider">Threats</h4>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside leading-relaxed">
                    {swot.threats?.length > 0 ? swot.threats.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 2: AI Profile */}
            {ai && (
              <section className="break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1.5 mb-3 text-slate-900 flex items-center">
                  <span className="bg-slate-900 text-white w-4 h-4 inline-flex items-center justify-center rounded-full mr-2 text-[9px]">2</span> 
                  Psychological & Growth Profile
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3.5 rounded border border-slate-100">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Learning Style</p>
                    <p className="text-slate-800 font-medium text-xs">{ai.psychological_profile?.learning_style || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Growth Category</p>
                    <p className="text-slate-800 font-medium text-xs">{ai.psychological_profile?.psychological_growth_category || "N/A"}</p>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 3: Official Action Plan */}
            {isReviewed && review && (
               <section className="break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest border-b border-indigo-200 pb-1.5 mb-3 text-indigo-900 flex items-center">
                  <span className="bg-indigo-600 text-white w-4 h-4 inline-flex items-center justify-center rounded-full mr-2 text-[9px]">3</span> 
                  Official Action Plan (Counselor Input)
                </h3>
                
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block mb-1.5">Final Assessed Risk Level</span>
                    <span className={`inline-block px-3 py-1 text-[11px] font-bold uppercase rounded shadow-sm border ${
                      review.final_risk_level === 'High' || review.final_risk_level === 'Critical' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : review.final_risk_level === 'Medium' 
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {review.final_risk_level}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block mb-1.5">Prescribed Interventions & Notes</span>
                    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {review.final_action_plan}
                    </p>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* COMPACT DUAL SIGNATURE FOOTER */}
          <div className="mt-8 pt-4 flex justify-between items-end opacity-60 break-inside-avoid">
            
            <div className="text-center w-1/3">
              <div className="w-full border-b border-slate-400 mb-1.5"></div>
              <p className="text-[9px] text-slate-800 font-bold mt-1 uppercase truncate">{record.student?.fullName || "Student"}'s Signature</p>
            </div>

            <div className="text-center w-1/3">
              <div className="w-full border-b border-slate-400 mb-1.5"></div>
              <p className="text-[9px] text-slate-800 font-bold mt-1 uppercase truncate">{record.assignedCounselor?.fullName || "Counselor"}'s Signature</p>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}