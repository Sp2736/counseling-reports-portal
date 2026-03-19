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
  
  // UPGRADED: Added Cancelled statuses
  status: {
    type: String,
    enum: ['Pending_AI', 'Needs_Review', 'Reviewed_Completed', 'Cancelled_By_Student', 'Cancelled_By_Counselor'],
    default: 'Pending_AI'
  },

  // NEW: Tracking which report this is (e.g., 1 out of 4 for the semester)
  report_period: {
    type: Number,
    default: 1, 
    min: 1,
    max: 4
  },

  // NEW: Cancellation reason (filled by counselor if they reject it)
  cancellation_reason: {
    type: String,
    default: null
  },

  // NEW: The URL where the actual DOCX file is stored in the cloud
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
counselingRecordSchema.index({ student: 1 }); // Important for the student dashboard!

export const CounselingRecord = mongoose.models.CounselingRecord || mongoose.model('CounselingRecord', counselingRecordSchema);