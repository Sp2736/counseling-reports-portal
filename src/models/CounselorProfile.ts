// src/models/CounselorProfile.ts
import mongoose from 'mongoose';

const CounselorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true }, // NEW: Employee ID field
  fullName: { type: String, required: true }, 
  department: { type: String, required: true },
  batchYear: { type: String, required: true },
  startRollNo: { type: String, required: true },
  endRollNo: { type: String, required: true }
}, { timestamps: true });

export const CounselorProfile = mongoose.models.CounselorProfile || mongoose.model('CounselorProfile', CounselorProfileSchema);