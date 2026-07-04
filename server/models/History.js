import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
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

export default mongoose.models.History || mongoose.model("History", HistorySchema);
