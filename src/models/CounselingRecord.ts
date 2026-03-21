// src/models/CounselingRecord.ts
import mongoose from 'mongoose';

const counselingRecordSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile', 
    required: true 
  },
  assignedCounselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CounselorProfile',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending_AI', 'Needs_Review', 'Reviewed_Completed', 'Cancelled_By_Student', 'Cancelled_By_Counselor'],
    default: 'Pending_AI'
  },
  cancellation_reason: {
    type: String,
    default: null
  },
  file_url: {
    type: String,
    default: null
  },
  swot_input: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    opportunities: [{ type: String }],
    threats: [{ type: String }],
    submitted_at: { type: Date, default: Date.now }
  },
  ai_analysis: {
    psychological_profile: {
      dominant_traits: [{ type: String }],
      learning_style: String,
      motivation_level: String,
      psychological_growth_category: String
    },
    risk_prediction: {
      risk_score: Number,
      risk_level: String,
      risk_factors: [{ type: String }]
    },
    career_insights: {
      detected_interests: [{ type: String }],
      potential_career_paths: [{ type: String }]
    },
    generated_report: {
      counselor_findings: String,
      recommended_action_plan: String,
      priority_interventions: [{ type: String }]
    }
  },
  counselor_review: {
    final_risk_level: String,
    final_action_plan: String,
    reviewed_at: Date
  }
}, { timestamps: true });

counselingRecordSchema.index({ status: 1 });
counselingRecordSchema.index({ assignedCounselor: 1 });
counselingRecordSchema.index({ student: 1 }); 

export const CounselingRecord = mongoose.models.CounselingRecord || mongoose.model('CounselingRecord', counselingRecordSchema);