import { Form } from "../models/form.model.js";
import { Submission } from "../models/submission.model.js";
export const listForms = async (req, res, next) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      forms.map(async (f) => ({
        ...f.toObject(),
        submissionCount: await Submission.countDocuments({ formId: f._id }),
      }))
    );
    res.json(withCounts);
  } catch (err) {
    next(err);
  }
};
export const createForm = async (req, res, next) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (err) {
    next(err);
  }
};
export const getForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    next(err);
  }
};
export const updateForm = async (req, res, next) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    next(err);
  }
};
export const deleteForm = async (req, res, next) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
export const duplicateForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    const clone = await Form.create({
      ...form.toObject(),
      _id: undefined,
      title: form.title + " (Copy)",
      createdAt: undefined,
      status: "draft",
    });
    res.status(201).json(clone);
  } catch (err) {
    next(err);
  }
};
