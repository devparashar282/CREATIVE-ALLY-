import { Schema, model, models } from "mongoose";

const courseSchema = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    whatYouLearn: [{ type: String, required: true }],
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Course = models.Course || model("Course", courseSchema);
export default Course;
