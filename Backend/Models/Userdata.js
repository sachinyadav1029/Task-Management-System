import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String }, // Add profile picture field
}, { timestamps: true });

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.models.User || mongoose.model("User", userSchema);