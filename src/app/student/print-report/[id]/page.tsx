// src/app/student/print-report/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, University } from "lucide-react";

export default function StudentPrintReportPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We can reuse the counselor's fetch API since it returns the same document, 
    // or we can fetch from a student-specific endpoint. For now, we will use a generic fetch.
    // To ensure strict security, let's just fetch the whole list and find the specific one.
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

  if (isLoading) return <div className="p-8 text-center text-gray-500 print:hidden">Loading Official Report...</div>;
  if (!record || record.status !== "Reviewed_Completed") return <div className="p-8 text-center text-red-500 print:hidden">Report not available for printing.</div>;

  const ai = record.ai_analysis;
  const review = record.counselor_review;

  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-12 font-sans">
      
      {/* Top Action Bar (Hidden when actually printing to PDF) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden bg-gray-50 p-4 rounded-lg border border-gray-200">
        <button onClick={() => router.push("/student/dashboard")} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()} 
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" /> Save as PDF / Print
        </button>
      </div>

      {/* Official Report Document */}
      <div className="max-w-4xl mx-auto border border-gray-300 p-10 rounded-xl print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <University className="w-6 h-6 text-gray-800" />
              <h1 className="text-2xl font-bold tracking-tight uppercase">University Counseling Services</h1>
            </div>
            <h2 className="text-lg text-gray-600 font-medium">Official SWOT & Academic Report</h2>
          </div>
          <div className="text-right text-sm text-gray-500 space-y-1">
            <p><strong>Date:</strong> {new Date(review.reviewed_at).toLocaleDateString()}</p>
            <p><strong>Report ID:</strong> {record._id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Period:</strong> {record.report_period || 1}</p>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
          <p className="text-sm text-gray-800 mb-1"><strong>Final Assessed Risk Level:</strong> <span className={`font-bold ${review.final_risk_level === 'High' ? 'text-red-600' : 'text-gray-900'}`}>{review.final_risk_level}</span></p>
          <p className="text-sm text-gray-800"><strong>Counselor Signature:</strong> System Approved</p>
        </div>

        {/* AI & Counselor Findings */}
        <div className="space-y-8">
          
          <section>
            <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 text-gray-900">1. Psychological & Growth Profile</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
              <p><strong>Growth Category:</strong> {ai.psychological_profile.psychological_growth_category}</p>
              <p><strong>Learning Style:</strong> {ai.psychological_profile.learning_style}</p>
              <p className="col-span-2"><strong>Dominant Traits:</strong> {ai.psychological_profile.dominant_traits.join(", ")}</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 text-gray-900">2. Academic Risk Factors</h3>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {ai.risk_prediction.risk_factors.map((factor: string, i: number) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 text-gray-900">3. Official Action Plan & Next Steps</h3>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {review.final_action_plan}
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>This is a strictly confidential document generated by the University Counseling AI system.</p>
        </div>

      </div>
    </div>
  );
}