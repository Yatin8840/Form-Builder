import mongoose from "mongoose";
const FieldOptionSchema = new mongoose.Schema(
  { label: String, value: String },
  { _id: false }
);
const FieldSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ["text", "email", "select", "checkbox", "radio", "textarea", "file"],
    required: true,
  },
  label: { type: String, required: true },
  name: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  validation: { type: Object, default: {} },
  options: { type: [FieldOptionSchema], default: [] },
  order: { type: Number, default: 0 },
});
const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  settings: {
    thankYouMessage: { type: String, default: "Thanks for your submission!" },
    submissionLimit: { type: Number, default: 0 },
    redirectUrl: { type: String, default: "" },
  },
  fields: { type: [FieldSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});
export const Form = mongoose.model("Form", FormSchema);
