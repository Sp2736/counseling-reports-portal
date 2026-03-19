// src/app/student/print-report/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, University, ShieldCheck } from "lucide-react";

export default function StudentPrintReportPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/records")
      .then((res) => res.json())
      .then((data) => {
        const specificRecord = data.find((r: any) => r._id === params.id);
        setRecord(specificRecord);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params.id]);

  if (isLoading) return <div className="p-8 text-center text-gray-500 print:hidden">Generating Official Document...</div>;
  if (!record) return <div className="p-8 text-center text-red-500 print:hidden">Document not found.</div>;

  // Extract the structured JSON data
  const swot = record.swot_input || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const ai = record.ai_analysis;
  const review = record.counselor_review;
  const isReviewed = record.status === "Reviewed_Completed";

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8 md:p-12 font-sans print:bg-white print:p-0">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-[800px] mx-auto mb-8 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <button onClick={() => router.push("/student/dashboard")} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        
        <div className="flex space-x-3 items-center">
          <span className="text-xs text-gray-400 font-mono">DATA-DRIVEN RENDER</span>
          <button 
            onClick={() => window.print()} 
            className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" /> Export to PDF
          </button>
        </div>
      </div>

      {/* --- OFFICIAL A4 DOCUMENT CANVAS --- */}
      <div className="max-w-[800px] mx-auto bg-white border border-gray-300 shadow-lg p-12 print:border-none print:shadow-none print:p-0 print:max-w-none">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <University className="w-8 h-8 text-slate-900" />
              <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">University Counseling</h1>
            </div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Standardized SWOT & Growth Report</h2>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-1.5 font-mono">
            <p><span className="font-bold text-slate-400">DOCUMENT ID:</span> {record._id.substring(0, 12).toUpperCase()}</p>
            <p><span className="font-bold text-slate-400">GENERATED:</span> {new Date().toLocaleDateString()}</p>
            <p><span className="font-bold text-slate-400">PERIOD:</span> Academic Cycle {record.report_period || 1}</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-lg mb-8 flex items-center justify-between border ${isReviewed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Official Status</p>
            <p className={`text-lg font-bold ${isReviewed ? 'text-green-800' : 'text-amber-800'}`}>
              {isReviewed ? "Reviewed & Finalized" : "Pending Counselor Review"}
            </p>
          </div>
          {isReviewed && <ShieldCheck className="w-8 h-8 text-green-600 opacity-50" />}
        </div>

        {/* Main Content Grid */}
        <div className="space-y-10">

          {/* SECTION 1: The Reconstructed SWOT (Data-Driven) */}
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 text-slate-900 flex items-center">
              <span className="bg-slate-900 text-white w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 text-xs">1</span> 
              Student Self-Assessment (SWOT)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 text-sm">Strengths</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  {swot.strengths?.length > 0 ? swot.strengths.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                </ul>
              </div>
              {/* Weaknesses */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 text-sm">Weaknesses</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  {swot.weaknesses?.length > 0 ? swot.weaknesses.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                </ul>
              </div>
              {/* Opportunities */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 text-sm">Opportunities</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  {swot.opportunities?.length > 0 ? swot.opportunities.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                </ul>
              </div>
              {/* Threats */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 text-sm">Threats</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  {swot.threats?.length > 0 ? swot.threats.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No data provided.</li>}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2: AI Insights */}
          {ai && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 text-slate-900 flex items-center">
                <span className="bg-slate-900 text-white w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 text-xs">2</span> 
                Algorithmic Profiling
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Learning Style</p>
                  <p className="text-slate-800 font-medium">{ai.psychological_profile?.learning_style || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Growth Category</p>
                  <p className="text-slate-800 font-medium">{ai.psychological_profile?.psychological_growth_category || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Identified Risk Factors</p>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {ai.risk_prediction?.risk_factors?.map((factor: string, i: number) => (
                      <li key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded-md border border-rose-100">
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: Counselor Final Review */}
          {isReviewed && review && (
             <section className="break-inside-avoid">
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 text-slate-900 flex items-center">
                <span className="bg-slate-900 text-white w-6 h-6 inline-flex items-center justify-center rounded-full mr-2 text-xs">3</span> 
                Official Action Plan
              </h3>
              
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded-r-lg">
                <div className="mb-4">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Assessed Risk Level</span>
                  <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full ${review.final_risk_level === 'High' ? 'bg-red-100 text-red-800' : review.final_risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {review.final_risk_level}
                  </span>
                </div>
                
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Prescribed Interventions</span>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {review.final_action_plan}
                  </p>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Official Footer */}
        <div className="mt-16 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
          <div className="text-[10px] text-slate-500 font-mono space-y-1">
            <p>SYSTEM: University Matrix Core v2.0</p>
            <p>GENERATION LOG: {record._id}</p>
            <p className="uppercase text-slate-400">Strictly Confidential - Do Not Distribute</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-slate-400 mb-2"></div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Authorized Signature</p>
          </div>
        </div>

      </div>
    </div>
  );
}