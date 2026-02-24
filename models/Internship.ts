import { Schema, model, models } from "mongoose";

const internshipSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    whatYouLearn: [{ type: String, required: true }],
    price: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Internship = models.Internship || model("Internship", internshipSchema);
export default Internship;
