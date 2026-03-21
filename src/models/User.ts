// src/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Required for custom login
  role: { type: String, enum: ['student', 'counselor', 'admin'], default: 'student' },
  isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);