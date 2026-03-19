import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // SECURITY: This ensures the database never accidentally returns the password in a normal query
    },
    role: {
      type: String,
      enum: ['student', 'counselor', 'admin'],
      required: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false, // Forces new users to go to the onboarding page
    },
  },
  { timestamps: true }
);

// This line prevents Mongoose from recreating the model every time Next.js recompiles
export const User = mongoose.models.User || mongoose.model('User', userSchema);