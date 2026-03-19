import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
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
    studentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [/^\d{2}[A-Za-z]{3}\d{3}$/, 'Student ID must be in the format XXCCCXXX (e.g., 23DCS102)'],
    },
    assignedCounselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CounselorProfile',
      required: true,
    },
    // We will extract year and department from the studentId automatically later
    department: { type: String }, 
    admissionYear: { type: String },
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);