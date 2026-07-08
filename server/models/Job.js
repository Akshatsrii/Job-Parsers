import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    salary: {
      type: String,
      default: "",
      trim: true,
    },
    experience: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    contact: {
      type: String,
      default: "",
      trim: true,
    },
    isJobList: {
      type: Boolean,
      default: false,
    },
    jobs: {
      type: [Object],
      default: [],
    },
    isCompanyList: {
      type: Boolean,
      default: false,
    },
    companies: {
      type: [Object],
      default: [],
    },
    sourceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    parsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent mongoose model compiled error
export default mongoose.models.Job || mongoose.model("Job", JobSchema);
