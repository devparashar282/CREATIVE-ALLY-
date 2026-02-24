import { Schema, model, models } from "mongoose";

const certificateSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    college: { type: String, required: true },
    type: { type: String, enum: ["Workshop", "Internship", "Course"], required: true },
    courseName: { type: String, required: true },
    issueDate: { type: String, required: true },
    issuer: { type: String, default: "Creative Ally" }
  },
  { timestamps: true }
);

const Certificate = models.Certificate || model("Certificate", certificateSchema);
export default Certificate;
