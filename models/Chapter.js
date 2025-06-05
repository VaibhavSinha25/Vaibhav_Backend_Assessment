// This file defines the Mongoose schema for a Chapter model in a MongoDB database.
import mongoose from "mongoose";
const chapterSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    chapter: { type: String, required: true },
    class: { type: String, required: true },
    unit: { type: String, required: true },
    yearWiseQuestionCount: {
      type: Map,
      of: Number,
      required: true,
    },
    questionSolved: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      required: true,
    },
    isWeakChapter: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Exporting the Chapter model based on the defined schema
export default mongoose.model("Chapter", chapterSchema);
