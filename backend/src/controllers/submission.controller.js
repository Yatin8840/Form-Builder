import { Form } from "../models/form.model.js";
import { Submission } from "../models/submission.model.js";

export const createSubmission = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    if (form?.settings?.submissionLimit && form.settings.submissionLimit > 0) {
      const count = await Submission.countDocuments({ formId: form._id });
      if (count >= form.settings.submissionLimit)
        return res.status(429).json({ message: "Submission limit reached" });
    }

    // combine multer fields + body
    const payload = { ...req.body };
    const errors = [];
    for (const field of form.fields) {
      const val = payload[field.name];
      if (
        field.required &&
        (val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0))
      ) {
        errors.push({ field: field.name, message: "Required" });
      }
      if (
        field.type === "email" &&
        val &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ) {
        errors.push({ field: field.name, message: "Invalid email" });
      }
    }
    if (errors.length)
      return res.status(400).json({ message: "Validation failed", errors });

    const files = (req.files || []).map((f) => ({
      filename: f.filename,
      path: `/uploads/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size,
    }));

    const submission = await Submission.create({
      formId: form._id,
      data: payload,
      files,
    });
    res
      .status(201)
      .json({
        message: form?.settings?.thankYouMessage || "Thanks!",
        redirectUrl: form?.settings?.redirectUrl || "",
        submission,
      });
  } catch (err) {
    next(err);
  }
};

export const listSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ formId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(submissions);
  } catch (err) {
    next(err);
  }
};
