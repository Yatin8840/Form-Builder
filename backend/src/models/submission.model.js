import mongoose from "mongoose";
const FileSchema = new mongoose.Schema(
  { filename: String, path: String, mimetype: String, size: Number },
  { _id: false }
);
const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  data: { type: Object, default: {} },
  files: { type: [FileSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});
export const Submission = mongoose.model("Submission", SubmissionSchema);
