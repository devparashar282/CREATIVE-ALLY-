import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1527980965255-d3b416303d12" },
    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
