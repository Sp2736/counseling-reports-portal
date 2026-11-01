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
      match: [/^[A-Za-z0-9-]+$/, 'Student ID must be in valid format (e.g., STU-2026-1088)'],
    },
    assignedCounselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CounselorProfile',
      required: true,
    },
    // We will extract year and department from the studentId automatically later
    department: { type: String }, 
    admissionYear: { type: String },
    semester: { 
      type: Number,
      min: [1, 'Semester cannot be less than 1'],
      max: [8, 'Semester cannot be more than 8']
    },
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);