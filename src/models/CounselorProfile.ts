import mongoose from 'mongoose';

const counselorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{4}$/, 'Employee ID must be exactly 4 digits'],
    },
    // This array stores the ranges they manage (e.g., "23CSE001" to "23CSE060")
    managedRanges: [
      {
        department: { type: String, required: true },
        startId: { type: String, required: true },
        endId: { type: String, required: true },
      }
    ],
  },
  { timestamps: true }
);

export const CounselorProfile = mongoose.models.CounselorProfile || mongoose.model('CounselorProfile', counselorProfileSchema);