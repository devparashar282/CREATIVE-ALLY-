import { Schema, model, models } from "mongoose";

const campusAmbassadorSchema = new Schema(
  {
    name: { type: String, required: true },
    college: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ["new", "reviewed", "approved", "rejected"], default: "new" }
  },
  { timestamps: true }
);

const CampusAmbassadorApplication =
  models.CampusAmbassadorApplication || model("CampusAmbassadorApplication", campusAmbassadorSchema, "campus_ambassador_applications");

export default CampusAmbassadorApplication;
